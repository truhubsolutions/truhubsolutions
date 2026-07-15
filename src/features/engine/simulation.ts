import { getBlockDef } from "../blocks/registry";
import type { SimContext } from "../blocks/types";

export interface EdgeSpec {
  id: string;
  source: string; // node id
  sourceHandle: string; // port id
  target: string;
  targetHandle: string;
}
export interface NodeSpec {
  id: string;
  type: string;
  params: Record<string, number | string | boolean>;
}

export interface StepResult {
  t: number;
  // node id → output port id → value
  values: Record<string, Record<string, number>>;
  // channel name → value  (from scope blocks)
  channels: Record<string, number>;
}

export interface EngineOptions {
  dt: number;
  speed: number; // steps per RAF tick
  onStep: (r: StepResult) => void;
  onLog: (level: "info" | "warn" | "error", msg: string) => void;
}

/**
 * Discrete-time simulation engine.
 *
 * Execution model per step:
 *   1. Determine order (topological; feedback edges break cycles → previous-step value).
 *   2. For each node, read inputs from prior step outputs.
 *   3. Call block.step() to compute new outputs + mutate internal state.
 *   4. Notify listeners with values and channel logs (for scopes).
 */
export class SimulationEngine {
  private nodes: NodeSpec[] = [];
  private edges: EdgeSpec[] = [];
  private states = new Map<string, Record<string, number>>();
  private outputs = new Map<string, Record<string, number>>();
  private order: string[] = [];
  private t = 0;
  private raf: number | null = null;
  private running = false;

  constructor(private opts: EngineOptions) {}

  load(nodes: NodeSpec[], edges: EdgeSpec[]) {
    this.nodes = nodes;
    this.edges = edges;
    this.reset();
  }

  reset() {
    this.t = 0;
    this.states.clear();
    this.outputs.clear();
    for (const n of this.nodes) {
      const def = getBlockDef(n.type);
      this.states.set(n.id, { ...(def?.initialState ?? {}) });
      this.outputs.set(n.id, {});
    }
    this.order = this.topoOrder();
  }

  play() {
    if (this.running) return;
    this.running = true;
    const loop = () => {
      if (!this.running) return;
      for (let i = 0; i < Math.max(1, this.opts.speed); i++) this.tickOnce();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
    this.opts.onLog("info", "Simulation started");
  }
  pause() {
    this.running = false;
    if (this.raf != null) cancelAnimationFrame(this.raf);
    this.raf = null;
    this.opts.onLog("info", "Simulation paused");
  }
  stop() {
    this.pause();
    this.reset();
    this.opts.onLog("info", "Simulation stopped and reset");
  }

  isRunning() {
    return this.running;
  }

  private tickOnce() {
    const channels: Record<string, number> = {};
    const nextOutputs = new Map<string, Record<string, number>>();
    for (const id of this.order) {
      const node = this.nodes.find((n) => n.id === id);
      if (!node) continue;
      const def = getBlockDef(node.type);
      if (!def) continue;
      const inputs: Record<string, number> = {};
      // gather from edges targeting this node
      for (const e of this.edges) {
        if (e.target !== id) continue;
        const upstream = this.outputs.get(e.source);
        if (upstream) inputs[e.targetHandle] = upstream[e.sourceHandle] ?? 0;
      }
      const state = this.states.get(id) ?? {};
      const ctx: SimContext = {
        t: this.t,
        dt: this.opts.dt,
        inputs,
        params: node.params,
        state,
        log: (ch, v) => (channels[ch] = v),
      };
      try {
        const outs = def.step(ctx);
        nextOutputs.set(id, outs);
      } catch (err) {
        this.opts.onLog("error", `Block ${def.label} (${id}) failed: ${(err as Error).message}`);
        nextOutputs.set(id, {});
      }
    }
    // swap
    for (const [id, v] of nextOutputs) this.outputs.set(id, v);
    this.t += this.opts.dt;
    this.opts.onStep({ t: this.t, values: Object.fromEntries(this.outputs), channels });
  }

  private topoOrder(): string[] {
    // Simple Kahn's algorithm. Any remaining nodes (cycles) appended at end.
    const indeg = new Map<string, number>();
    for (const n of this.nodes) indeg.set(n.id, 0);
    for (const e of this.edges) indeg.set(e.target, (indeg.get(e.target) ?? 0) + 1);
    const q: string[] = [];
    indeg.forEach((v, k) => v === 0 && q.push(k));
    const out: string[] = [];
    while (q.length) {
      const id = q.shift()!;
      out.push(id);
      for (const e of this.edges.filter((e) => e.source === id)) {
        const d = (indeg.get(e.target) ?? 0) - 1;
        indeg.set(e.target, d);
        if (d === 0) q.push(e.target);
      }
    }
    // append cycle members
    for (const n of this.nodes) if (!out.includes(n.id)) out.push(n.id);
    return out;
  }
}
