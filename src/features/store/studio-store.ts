import { create } from "zustand";
import type { Edge, Node } from "@xyflow/react";
import { getBlockDef } from "../blocks/registry";

export interface BlockNodeData extends Record<string, unknown> {
  blockType: string;
  label: string;
  params: Record<string, number | string | boolean>;
  rotation: 0 | 90 | 180 | 270;
}
export type BlockNode = Node<BlockNodeData>;

export interface LogEntry {
  id: string;
  ts: number;
  level: "info" | "warn" | "error";
  msg: string;
}

export interface ScopeSample {
  t: number;
  values: Record<string, number>;
}

export interface StudioProject {
  name: string;
  createdAt: number;
  updatedAt: number;
  nodes: BlockNode[];
  edges: Edge[];
}

type UndoEntry = { nodes: BlockNode[]; edges: Edge[] };

interface StudioState {
  project: StudioProject;
  nodes: BlockNode[];
  edges: Edge[];
  selection: string[];
  clipboard: { nodes: BlockNode[]; edges: Edge[] } | null;
  past: UndoEntry[];
  future: UndoEntry[];

  // sim
  running: boolean;
  simTime: number;
  simSpeed: number;
  dt: number;
  samples: ScopeSample[];
  logs: LogEntry[];
  variables: Record<string, number>;

  // canvas
  gridSnap: boolean;
  showGrid: boolean;

  // actions
  setNodes: (n: BlockNode[] | ((prev: BlockNode[]) => BlockNode[])) => void;
  setEdges: (e: Edge[] | ((prev: Edge[]) => Edge[])) => void;
  addBlock: (blockType: string, position: { x: number; y: number }) => void;
  updateNodeParams: (id: string, patch: Record<string, number | string | boolean>) => void;
  updateNodeLabel: (id: string, label: string) => void;
  rotateNode: (id: string) => void;
  deleteSelection: () => void;
  copySelection: () => void;
  pasteClipboard: () => void;
  setSelection: (ids: string[]) => void;
  snapshot: () => void;
  undo: () => void;
  redo: () => void;

  // sim actions
  setRunning: (r: boolean) => void;
  setSimSpeed: (v: number) => void;
  setDt: (v: number) => void;
  pushSample: (t: number, channels: Record<string, number>) => void;
  pushLog: (level: LogEntry["level"], msg: string) => void;
  clearLogs: () => void;
  clearSamples: () => void;

  // project
  newProject: (name?: string) => void;
  loadProject: (p: StudioProject) => void;
  renameProject: (name: string) => void;

  toggleSnap: () => void;
  toggleGrid: () => void;
}

const emptyProject = (name = "Untitled"): StudioProject => ({
  name,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  nodes: [],
  edges: [],
});

let nodeIdCounter = 1;
const nextId = () => `n_${Date.now().toString(36)}_${nodeIdCounter++}`;

const MAX_SAMPLES = 4000;
const MAX_LOGS = 200;

export const useStudio = create<StudioState>((set, get) => ({
  project: emptyProject(),
  nodes: [],
  edges: [],
  selection: [],
  clipboard: null,
  past: [],
  future: [],

  running: false,
  simTime: 0,
  simSpeed: 1,
  dt: 0.01,
  samples: [],
  logs: [],
  variables: {},

  gridSnap: true,
  showGrid: true,

  setNodes: (n) =>
    set((s) => ({ nodes: typeof n === "function" ? (n as (p: BlockNode[]) => BlockNode[])(s.nodes) : n })),
  setEdges: (e) =>
    set((s) => ({ edges: typeof e === "function" ? (e as (p: Edge[]) => Edge[])(s.edges) : e })),

  addBlock: (blockType, position) => {
    const def = getBlockDef(blockType);
    if (!def) return;
    get().snapshot();
    const params: Record<string, number | string | boolean> = {};
    for (const p of def.params) params[p.key] = p.default;
    const node: BlockNode = {
      id: nextId(),
      type: "block",
      position,
      data: { blockType, label: def.label, params, rotation: 0 },
    };
    set((s) => ({ nodes: [...s.nodes, node] }));
  },

  updateNodeParams: (id, patch) => {
    set((s) => ({
      nodes: s.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, params: { ...n.data.params, ...patch } } } : n,
      ),
    }));
  },

  updateNodeLabel: (id, label) => {
    set((s) => ({
      nodes: s.nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, label } } : n)),
    }));
  },

  rotateNode: (id) => {
    get().snapshot();
    set((s) => ({
      nodes: s.nodes.map((n) => {
        if (n.id !== id) return n;
        const r = (((n.data.rotation ?? 0) + 90) % 360) as 0 | 90 | 180 | 270;
        return { ...n, data: { ...n.data, rotation: r } };
      }),
    }));
  },

  deleteSelection: () => {
    const sel = new Set(get().selection);
    if (!sel.size) return;
    get().snapshot();
    set((s) => ({
      nodes: s.nodes.filter((n) => !sel.has(n.id)),
      edges: s.edges.filter((e) => !sel.has(e.source) && !sel.has(e.target) && !sel.has(e.id)),
      selection: [],
    }));
  },

  copySelection: () => {
    const sel = new Set(get().selection);
    const nodes = get().nodes.filter((n) => sel.has(n.id));
    const edges = get().edges.filter((e) => sel.has(e.source) && sel.has(e.target));
    set({ clipboard: { nodes, edges } });
  },

  pasteClipboard: () => {
    const cb = get().clipboard;
    if (!cb || !cb.nodes.length) return;
    get().snapshot();
    const idMap = new Map<string, string>();
    const newNodes: BlockNode[] = cb.nodes.map((n) => {
      const id = nextId();
      idMap.set(n.id, id);
      return {
        ...n,
        id,
        position: { x: n.position.x + 40, y: n.position.y + 40 },
        selected: false,
      };
    });
    const newEdges = cb.edges.map((e) => ({
      ...e,
      id: `e_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
      source: idMap.get(e.source)!,
      target: idMap.get(e.target)!,
    }));
    set((s) => ({ nodes: [...s.nodes, ...newNodes], edges: [...s.edges, ...newEdges] }));
  },

  setSelection: (ids) => set({ selection: ids }),

  snapshot: () =>
    set((s) => ({
      past: [...s.past.slice(-49), { nodes: s.nodes, edges: s.edges }],
      future: [],
    })),

  undo: () => {
    const p = get().past;
    if (!p.length) return;
    const prev = p[p.length - 1];
    set((s) => ({
      past: p.slice(0, -1),
      future: [{ nodes: s.nodes, edges: s.edges }, ...s.future].slice(0, 50),
      nodes: prev.nodes,
      edges: prev.edges,
    }));
  },
  redo: () => {
    const f = get().future;
    if (!f.length) return;
    const next = f[0];
    set((s) => ({
      future: f.slice(1),
      past: [...s.past, { nodes: s.nodes, edges: s.edges }].slice(-50),
      nodes: next.nodes,
      edges: next.edges,
    }));
  },

  setRunning: (r) => set({ running: r }),
  setSimSpeed: (v) => set({ simSpeed: v }),
  setDt: (v) => set({ dt: v }),
  pushSample: (t, channels) =>
    set((s) => {
      const merged: Record<string, number> = { ...(s.samples.at(-1)?.values ?? {}), ...channels };
      const next = [...s.samples, { t, values: merged }];
      return { samples: next.length > MAX_SAMPLES ? next.slice(-MAX_SAMPLES) : next, simTime: t, variables: merged };
    }),
  pushLog: (level, msg) =>
    set((s) => {
      const next = [
        ...s.logs,
        { id: `l_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, ts: Date.now(), level, msg },
      ];
      return { logs: next.length > MAX_LOGS ? next.slice(-MAX_LOGS) : next };
    }),
  clearLogs: () => set({ logs: [] }),
  clearSamples: () => set({ samples: [], simTime: 0 }),

  newProject: (name = "Untitled") =>
    set({
      project: emptyProject(name),
      nodes: [],
      edges: [],
      past: [],
      future: [],
      samples: [],
      logs: [],
      selection: [],
      simTime: 0,
      running: false,
    }),
  loadProject: (p) =>
    set({
      project: p,
      nodes: p.nodes,
      edges: p.edges,
      past: [],
      future: [],
      samples: [],
      logs: [],
      selection: [],
      simTime: 0,
      running: false,
    }),
  renameProject: (name) => set((s) => ({ project: { ...s.project, name, updatedAt: Date.now() } })),
  toggleSnap: () => set((s) => ({ gridSnap: !s.gridSnap })),
  toggleGrid: () => set((s) => ({ showGrid: !s.showGrid })),
}));
