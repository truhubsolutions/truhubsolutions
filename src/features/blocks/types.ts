// Core block/simulation type definitions for TruHub Lab
export type ParamType = "number" | "string" | "boolean" | "select";

export interface ParamDef {
  key: string;
  label: string;
  type: ParamType;
  default: number | string | boolean;
  options?: string[]; // for select
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
}

export interface PortDef {
  id: string;
  label: string;
}

export type BlockCategory =
  | "electrical"
  | "semiconductors"
  | "ic"
  | "power"
  | "control"
  | "signal"
  | "mechanical"
  | "communication"
  | "sinks";

export interface SimContext {
  t: number;
  dt: number;
  inputs: Record<string, number>;
  params: Record<string, number | string | boolean>;
  state: Record<string, number>;
  // history writers for scopes
  log?: (channel: string, value: number) => void;
}

export interface BlockDefinition {
  type: string;
  label: string;
  category: BlockCategory;
  description: string;
  icon: string; // lucide-react icon name
  color: string; // css var or hex accent
  inputs: PortDef[];
  outputs: PortDef[];
  params: ParamDef[];
  initialState?: Record<string, number>;
  /**
   * Compute outputs and next state from inputs. Called each simulation step.
   * Must be pure w.r.t. the given ctx (mutations to ctx.state allowed).
   */
  step: (ctx: SimContext) => Record<string, number>;
}
