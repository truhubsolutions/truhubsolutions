import type { BlockDefinition, BlockCategory } from "./types";

/**
 * Central block registry. Each block is a small, self-contained module
 * with I/O, parameters, and an update function used by the simulation engine.
 *
 * Blocks are intentionally simplified educational models — not spice-accurate —
 * but expose the same authoring surface as a professional EDA tool.
 */

const K = (v: unknown, d = 0) => (typeof v === "number" && isFinite(v) ? v : d);

export const BLOCKS: BlockDefinition[] = [
  // ─────────── Electrical ───────────
  {
    type: "resistor",
    label: "Resistor",
    category: "electrical",
    description: "Passive resistor. V = I·R",
    icon: "Minus",
    color: "#f59e0b",
    inputs: [{ id: "in", label: "V in" }],
    outputs: [{ id: "out", label: "V out" }],
    params: [{ key: "R", label: "Resistance", type: "number", default: 1000, unit: "Ω" }],
    step: ({ inputs, params }) => {
      const R = K(params.R as number, 1000);
      // simple voltage divider approx: V_out = V_in * R/(R+1)
      return { out: (K(inputs.in) * R) / (R + 1) };
    },
  },
  {
    type: "capacitor",
    label: "Capacitor",
    category: "electrical",
    description: "Passive capacitor. dV/dt = I/C",
    icon: "SquareStack",
    color: "#f59e0b",
    inputs: [{ id: "in", label: "I in" }],
    outputs: [{ id: "out", label: "V" }],
    params: [{ key: "C", label: "Capacitance", type: "number", default: 1e-6, unit: "F" }],
    initialState: { V: 0 },
    step: ({ inputs, params, dt, state }) => {
      const C = K(params.C as number, 1e-6);
      state.V = K(state.V) + (K(inputs.in) * dt) / C;
      return { out: state.V };
    },
  },
  {
    type: "inductor",
    label: "Inductor",
    category: "electrical",
    description: "Passive inductor. dI/dt = V/L",
    icon: "Waves",
    color: "#f59e0b",
    inputs: [{ id: "in", label: "V in" }],
    outputs: [{ id: "out", label: "I" }],
    params: [{ key: "L", label: "Inductance", type: "number", default: 1e-3, unit: "H" }],
    initialState: { I: 0 },
    step: ({ inputs, params, dt, state }) => {
      const L = K(params.L as number, 1e-3);
      state.I = K(state.I) + (K(inputs.in) * dt) / L;
      return { out: state.I };
    },
  },
  {
    type: "battery",
    label: "Battery",
    category: "electrical",
    description: "DC voltage source",
    icon: "Battery",
    color: "#22c55e",
    inputs: [],
    outputs: [{ id: "out", label: "V" }],
    params: [{ key: "V", label: "Voltage", type: "number", default: 9, unit: "V" }],
    step: ({ params }) => ({ out: K(params.V as number, 9) }),
  },
  {
    type: "ground",
    label: "Ground",
    category: "electrical",
    description: "Reference 0 V",
    icon: "CornerDownLeft",
    color: "#64748b",
    inputs: [{ id: "in", label: "" }],
    outputs: [],
    params: [],
    step: () => ({}),
  },
  {
    type: "voltage_source",
    label: "Voltage Source",
    category: "electrical",
    description: "Ideal voltage source (DC or AC)",
    icon: "Zap",
    color: "#22c55e",
    inputs: [],
    outputs: [{ id: "out", label: "V" }],
    params: [
      { key: "V", label: "Amplitude", type: "number", default: 5, unit: "V" },
      { key: "f", label: "Frequency", type: "number", default: 0, unit: "Hz" },
    ],
    step: ({ t, params }) => {
      const V = K(params.V as number, 5);
      const f = K(params.f as number, 0);
      return { out: f === 0 ? V : V * Math.sin(2 * Math.PI * f * t) };
    },
  },
  {
    type: "current_source",
    label: "Current Source",
    category: "electrical",
    description: "Ideal current source",
    icon: "ArrowRight",
    color: "#22c55e",
    inputs: [],
    outputs: [{ id: "out", label: "I" }],
    params: [{ key: "I", label: "Current", type: "number", default: 0.01, unit: "A" }],
    step: ({ params }) => ({ out: K(params.I as number, 0.01) }),
  },
  {
    type: "switch",
    label: "Switch",
    category: "electrical",
    description: "Pass or block signal",
    icon: "ToggleLeft",
    color: "#f59e0b",
    inputs: [{ id: "in", label: "In" }],
    outputs: [{ id: "out", label: "Out" }],
    params: [{ key: "closed", label: "Closed", type: "boolean", default: true }],
    step: ({ inputs, params }) => ({ out: params.closed ? K(inputs.in) : 0 }),
  },
  {
    type: "fuse",
    label: "Fuse",
    category: "electrical",
    description: "Breaks on overcurrent",
    icon: "ShieldAlert",
    color: "#f59e0b",
    inputs: [{ id: "in", label: "I in" }],
    outputs: [{ id: "out", label: "I out" }],
    params: [{ key: "I_max", label: "Trip current", type: "number", default: 1, unit: "A" }],
    initialState: { blown: 0 },
    step: ({ inputs, params, state }) => {
      const i = K(inputs.in);
      if (Math.abs(i) > K(params.I_max as number, 1)) state.blown = 1;
      return { out: state.blown ? 0 : i };
    },
  },
  {
    type: "transformer",
    label: "Transformer",
    category: "electrical",
    description: "Ideal transformer with turns ratio",
    icon: "Repeat",
    color: "#f59e0b",
    inputs: [{ id: "in", label: "V pri" }],
    outputs: [{ id: "out", label: "V sec" }],
    params: [{ key: "N", label: "Turns ratio Ns/Np", type: "number", default: 0.5 }],
    step: ({ inputs, params }) => ({ out: K(inputs.in) * K(params.N as number, 0.5) }),
  },

  // ─────────── Semiconductors ───────────
  {
    type: "diode",
    label: "Diode",
    category: "semiconductors",
    description: "Ideal diode with forward drop",
    icon: "TriangleRight",
    color: "#ef4444",
    inputs: [{ id: "in", label: "V" }],
    outputs: [{ id: "out", label: "V" }],
    params: [{ key: "Vf", label: "Forward drop", type: "number", default: 0.7, unit: "V" }],
    step: ({ inputs, params }) => {
      const v = K(inputs.in);
      const vf = K(params.Vf as number, 0.7);
      return { out: v > vf ? v - vf : 0 };
    },
  },
  {
    type: "led",
    label: "LED",
    category: "semiconductors",
    description: "LED emits when forward biased",
    icon: "Lightbulb",
    color: "#ef4444",
    inputs: [{ id: "in", label: "V" }],
    outputs: [{ id: "lum", label: "Lum" }],
    params: [{ key: "Vf", label: "Forward drop", type: "number", default: 2.0, unit: "V" }],
    step: ({ inputs, params }) => {
      const v = K(inputs.in);
      const vf = K(params.Vf as number, 2);
      return { lum: v > vf ? Math.min(1, (v - vf) / 2) : 0 };
    },
  },
  {
    type: "zener",
    label: "Zener",
    category: "semiconductors",
    description: "Voltage regulator diode",
    icon: "TriangleRight",
    color: "#ef4444",
    inputs: [{ id: "in", label: "V" }],
    outputs: [{ id: "out", label: "V" }],
    params: [{ key: "Vz", label: "Zener voltage", type: "number", default: 5.1, unit: "V" }],
    step: ({ inputs, params }) => ({ out: Math.min(K(inputs.in), K(params.Vz as number, 5.1)) }),
  },
  {
    type: "bjt",
    label: "BJT",
    category: "semiconductors",
    description: "Bipolar junction transistor (linear)",
    icon: "GitBranch",
    color: "#ef4444",
    inputs: [{ id: "b", label: "Base" }, { id: "c", label: "Coll" }],
    outputs: [{ id: "e", label: "Emit" }],
    params: [{ key: "beta", label: "β gain", type: "number", default: 100 }],
    step: ({ inputs, params }) => {
      const ib = K(inputs.b);
      const beta = K(params.beta as number, 100);
      return { e: ib * beta };
    },
  },
  {
    type: "mosfet",
    label: "MOSFET",
    category: "semiconductors",
    description: "N-channel MOSFET (switch model)",
    icon: "GitBranchPlus",
    color: "#ef4444",
    inputs: [{ id: "g", label: "Gate" }, { id: "d", label: "Drain" }],
    outputs: [{ id: "s", label: "Src" }],
    params: [{ key: "Vth", label: "Threshold", type: "number", default: 2, unit: "V" }],
    step: ({ inputs, params }) => {
      const vg = K(inputs.g);
      return { s: vg > K(params.Vth as number, 2) ? K(inputs.d) : 0 };
    },
  },
  {
    type: "scr",
    label: "SCR",
    category: "semiconductors",
    description: "Silicon-controlled rectifier",
    icon: "Zap",
    color: "#ef4444",
    inputs: [{ id: "g", label: "Gate" }, { id: "a", label: "Anode" }],
    outputs: [{ id: "k", label: "Cath" }],
    params: [],
    initialState: { on: 0 },
    step: ({ inputs, state }) => {
      if (K(inputs.g) > 0.5) state.on = 1;
      if (K(inputs.a) <= 0) state.on = 0;
      return { k: state.on ? K(inputs.a) : 0 };
    },
  },
  {
    type: "triac",
    label: "TRIAC",
    category: "semiconductors",
    description: "Bidirectional thyristor",
    icon: "Zap",
    color: "#ef4444",
    inputs: [{ id: "g", label: "Gate" }, { id: "in", label: "MT1" }],
    outputs: [{ id: "out", label: "MT2" }],
    params: [],
    initialState: { on: 0 },
    step: ({ inputs, state }) => {
      if (K(inputs.g) > 0.5) state.on = 1;
      if (Math.abs(K(inputs.in)) < 1e-3) state.on = 0;
      return { out: state.on ? K(inputs.in) : 0 };
    },
  },

  // ─────────── Integrated Circuits ───────────
  {
    type: "timer_555",
    label: "555 Timer",
    category: "ic",
    description: "Astable oscillator",
    icon: "Timer",
    color: "#a855f7",
    inputs: [],
    outputs: [{ id: "out", label: "Out" }],
    params: [
      { key: "f", label: "Frequency", type: "number", default: 1, unit: "Hz" },
      { key: "duty", label: "Duty cycle", type: "number", default: 0.5, min: 0, max: 1, step: 0.05 },
    ],
    step: ({ t, params }) => {
      const f = K(params.f as number, 1);
      const duty = K(params.duty as number, 0.5);
      const phase = (t * f) % 1;
      return { out: phase < duty ? 5 : 0 };
    },
  },
  {
    type: "opamp",
    label: "Op-Amp",
    category: "ic",
    description: "Ideal opamp (v+ - v-) * gain, clipped",
    icon: "Triangle",
    color: "#a855f7",
    inputs: [{ id: "vp", label: "V+" }, { id: "vn", label: "V-" }],
    outputs: [{ id: "out", label: "Out" }],
    params: [
      { key: "gain", label: "Gain", type: "number", default: 100000 },
      { key: "Vcc", label: "Supply ±", type: "number", default: 12, unit: "V" },
    ],
    step: ({ inputs, params }) => {
      const g = K(params.gain as number, 1e5);
      const vcc = K(params.Vcc as number, 12);
      const v = (K(inputs.vp) - K(inputs.vn)) * g;
      return { out: Math.max(-vcc, Math.min(vcc, v)) };
    },
  },
  {
    type: "comparator",
    label: "Comparator",
    category: "ic",
    description: "Compares two signals",
    icon: "Scale",
    color: "#a855f7",
    inputs: [{ id: "a", label: "A" }, { id: "b", label: "B" }],
    outputs: [{ id: "out", label: "Out" }],
    params: [{ key: "Vhigh", label: "V high", type: "number", default: 5 }],
    step: ({ inputs, params }) => ({
      out: K(inputs.a) > K(inputs.b) ? K(params.Vhigh as number, 5) : 0,
    }),
  },
  {
    type: "logic_gate",
    label: "Logic Gate",
    category: "ic",
    description: "AND / OR / XOR / NAND / NOR / NOT",
    icon: "Cpu",
    color: "#a855f7",
    inputs: [{ id: "a", label: "A" }, { id: "b", label: "B" }],
    outputs: [{ id: "out", label: "Out" }],
    params: [
      {
        key: "op",
        label: "Operation",
        type: "select",
        default: "AND",
        options: ["AND", "OR", "XOR", "NAND", "NOR", "NOT"],
      },
    ],
    step: ({ inputs, params }) => {
      const a = K(inputs.a) > 0.5 ? 1 : 0;
      const b = K(inputs.b) > 0.5 ? 1 : 0;
      let r = 0;
      switch (params.op as string) {
        case "AND": r = a & b; break;
        case "OR":  r = a | b; break;
        case "XOR": r = a ^ b; break;
        case "NAND": r = 1 - (a & b); break;
        case "NOR":  r = 1 - (a | b); break;
        case "NOT":  r = 1 - a; break;
      }
      return { out: r ? 5 : 0 };
    },
  },
  {
    type: "adc",
    label: "ADC",
    category: "ic",
    description: "Analog to digital (8-bit)",
    icon: "SignalHigh",
    color: "#a855f7",
    inputs: [{ id: "in", label: "V" }],
    outputs: [{ id: "out", label: "code" }],
    params: [
      { key: "Vref", label: "Vref", type: "number", default: 5 },
      { key: "bits", label: "Bits", type: "number", default: 8 },
    ],
    step: ({ inputs, params }) => {
      const vref = K(params.Vref as number, 5);
      const bits = K(params.bits as number, 8);
      const max = Math.pow(2, bits) - 1;
      return { out: Math.max(0, Math.min(max, Math.round((K(inputs.in) / vref) * max))) };
    },
  },
  {
    type: "dac",
    label: "DAC",
    category: "ic",
    description: "Digital to analog",
    icon: "SignalLow",
    color: "#a855f7",
    inputs: [{ id: "in", label: "code" }],
    outputs: [{ id: "out", label: "V" }],
    params: [
      { key: "Vref", label: "Vref", type: "number", default: 5 },
      { key: "bits", label: "Bits", type: "number", default: 8 },
    ],
    step: ({ inputs, params }) => {
      const vref = K(params.Vref as number, 5);
      const max = Math.pow(2, K(params.bits as number, 8)) - 1;
      return { out: (K(inputs.in) / max) * vref };
    },
  },

  // ─────────── Power Electronics ───────────
  {
    type: "rectifier",
    label: "Rectifier",
    category: "power",
    description: "Full-wave rectifier |V|",
    icon: "MoveDown",
    color: "#06b6d4",
    inputs: [{ id: "in", label: "V ac" }],
    outputs: [{ id: "out", label: "V dc" }],
    params: [],
    step: ({ inputs }) => ({ out: Math.abs(K(inputs.in)) }),
  },
  {
    type: "buck",
    label: "Buck Converter",
    category: "power",
    description: "Step-down DC-DC",
    icon: "TrendingDown",
    color: "#06b6d4",
    inputs: [{ id: "in", label: "V in" }],
    outputs: [{ id: "out", label: "V out" }],
    params: [{ key: "D", label: "Duty", type: "number", default: 0.5, min: 0, max: 1, step: 0.01 }],
    step: ({ inputs, params }) => ({ out: K(inputs.in) * K(params.D as number, 0.5) }),
  },
  {
    type: "boost",
    label: "Boost Converter",
    category: "power",
    description: "Step-up DC-DC",
    icon: "TrendingUp",
    color: "#06b6d4",
    inputs: [{ id: "in", label: "V in" }],
    outputs: [{ id: "out", label: "V out" }],
    params: [{ key: "D", label: "Duty", type: "number", default: 0.5, min: 0.01, max: 0.95, step: 0.01 }],
    step: ({ inputs, params }) => {
      const d = K(params.D as number, 0.5);
      return { out: K(inputs.in) / Math.max(0.01, 1 - d) };
    },
  },
  {
    type: "inverter",
    label: "Inverter",
    category: "power",
    description: "DC → AC (square wave)",
    icon: "RefreshCw",
    color: "#06b6d4",
    inputs: [{ id: "in", label: "V dc" }],
    outputs: [{ id: "out", label: "V ac" }],
    params: [{ key: "f", label: "Frequency", type: "number", default: 50, unit: "Hz" }],
    step: ({ t, inputs, params }) => {
      const phase = (t * K(params.f as number, 50)) % 1;
      return { out: (phase < 0.5 ? 1 : -1) * K(inputs.in) };
    },
  },
  {
    type: "pwm",
    label: "PWM",
    category: "power",
    description: "Pulse-width modulator",
    icon: "BarChart3",
    color: "#06b6d4",
    inputs: [{ id: "duty", label: "Duty" }],
    outputs: [{ id: "out", label: "Out" }],
    params: [{ key: "f", label: "Frequency", type: "number", default: 1000, unit: "Hz" }],
    step: ({ t, inputs, params }) => {
      const phase = (t * K(params.f as number, 1000)) % 1;
      const d = Math.max(0, Math.min(1, K(inputs.duty, 0.5)));
      return { out: phase < d ? 1 : 0 };
    },
  },

  // ─────────── Control Systems ───────────
  {
    type: "pid",
    label: "PID",
    category: "control",
    description: "Proportional-integral-derivative controller",
    icon: "Sliders",
    color: "#3b82f6",
    inputs: [{ id: "sp", label: "SP" }, { id: "pv", label: "PV" }],
    outputs: [{ id: "out", label: "u" }],
    params: [
      { key: "Kp", label: "Kp", type: "number", default: 1 },
      { key: "Ki", label: "Ki", type: "number", default: 0 },
      { key: "Kd", label: "Kd", type: "number", default: 0 },
    ],
    initialState: { i: 0, prev: 0 },
    step: ({ inputs, params, dt, state }) => {
      const e = K(inputs.sp) - K(inputs.pv);
      state.i = K(state.i) + e * dt;
      const d = (e - K(state.prev)) / (dt || 1e-6);
      state.prev = e;
      return {
        out:
          K(params.Kp as number, 1) * e +
          K(params.Ki as number) * state.i +
          K(params.Kd as number) * d,
      };
    },
  },
  {
    type: "gain",
    label: "Gain",
    category: "control",
    description: "y = k · x",
    icon: "Sigma",
    color: "#3b82f6",
    inputs: [{ id: "in", label: "In" }],
    outputs: [{ id: "out", label: "Out" }],
    params: [{ key: "k", label: "Gain", type: "number", default: 1 }],
    step: ({ inputs, params }) => ({ out: K(inputs.in) * K(params.k as number, 1) }),
  },
  {
    type: "transfer_fn",
    label: "Transfer Fn",
    category: "control",
    description: "First-order lag: y' = (kx-y)/τ",
    icon: "FunctionSquare",
    color: "#3b82f6",
    inputs: [{ id: "in", label: "In" }],
    outputs: [{ id: "out", label: "Out" }],
    params: [
      { key: "k", label: "Gain", type: "number", default: 1 },
      { key: "tau", label: "τ", type: "number", default: 0.1, unit: "s" },
    ],
    initialState: { y: 0 },
    step: ({ inputs, params, dt, state }) => {
      const tau = Math.max(1e-6, K(params.tau as number, 0.1));
      state.y = K(state.y) + ((K(params.k as number, 1) * K(inputs.in) - K(state.y)) * dt) / tau;
      return { out: state.y };
    },
  },
  {
    type: "integrator",
    label: "Integrator",
    category: "control",
    description: "y = ∫ x dt",
    icon: "Infinity",
    color: "#3b82f6",
    inputs: [{ id: "in", label: "In" }],
    outputs: [{ id: "out", label: "Out" }],
    params: [],
    initialState: { y: 0 },
    step: ({ inputs, dt, state }) => {
      state.y = K(state.y) + K(inputs.in) * dt;
      return { out: state.y };
    },
  },
  {
    type: "sum",
    label: "Sum",
    category: "control",
    description: "a + b (or with sign params)",
    icon: "Plus",
    color: "#3b82f6",
    inputs: [{ id: "a", label: "A" }, { id: "b", label: "B" }],
    outputs: [{ id: "out", label: "Out" }],
    params: [
      { key: "sa", label: "Sign A", type: "select", default: "+", options: ["+", "-"] },
      { key: "sb", label: "Sign B", type: "select", default: "+", options: ["+", "-"] },
    ],
    step: ({ inputs, params }) => {
      const sa = params.sa === "-" ? -1 : 1;
      const sb = params.sb === "-" ? -1 : 1;
      return { out: sa * K(inputs.a) + sb * K(inputs.b) };
    },
  },
  {
    type: "constant",
    label: "Constant",
    category: "control",
    description: "Emits a fixed value",
    icon: "Hash",
    color: "#3b82f6",
    inputs: [],
    outputs: [{ id: "out", label: "K" }],
    params: [{ key: "value", label: "Value", type: "number", default: 1 }],
    step: ({ params }) => ({ out: K(params.value as number, 1) }),
  },
  {
    type: "step",
    label: "Step Input",
    category: "control",
    description: "0 → V at t = t₀",
    icon: "StepForward",
    color: "#3b82f6",
    inputs: [],
    outputs: [{ id: "out", label: "Out" }],
    params: [
      { key: "V", label: "Amplitude", type: "number", default: 1 },
      { key: "t0", label: "Step time", type: "number", default: 0.5 },
    ],
    step: ({ t, params }) => ({ out: t >= K(params.t0 as number, 0.5) ? K(params.V as number, 1) : 0 }),
  },

  // ─────────── Signal Processing ───────────
  {
    type: "sine",
    label: "Sine Wave",
    category: "signal",
    description: "A·sin(2πft + φ)",
    icon: "Activity",
    color: "#14b8a6",
    inputs: [],
    outputs: [{ id: "out", label: "Out" }],
    params: [
      { key: "A", label: "Amplitude", type: "number", default: 1 },
      { key: "f", label: "Frequency", type: "number", default: 1, unit: "Hz" },
      { key: "phi", label: "Phase", type: "number", default: 0 },
    ],
    step: ({ t, params }) =>
      ({ out: K(params.A as number, 1) * Math.sin(2 * Math.PI * K(params.f as number, 1) * t + K(params.phi as number)) }),
  },
  {
    type: "noise",
    label: "Noise",
    category: "signal",
    description: "Uniform white noise",
    icon: "Waves",
    color: "#14b8a6",
    inputs: [],
    outputs: [{ id: "out", label: "n" }],
    params: [{ key: "A", label: "Amplitude", type: "number", default: 0.1 }],
    step: ({ params }) => ({ out: (Math.random() - 0.5) * 2 * K(params.A as number, 0.1) }),
  },
  {
    type: "fft",
    label: "FFT",
    category: "signal",
    description: "Passthrough (spectrum shown in scope)",
    icon: "BarChart2",
    color: "#14b8a6",
    inputs: [{ id: "in", label: "In" }],
    outputs: [{ id: "out", label: "Out" }],
    params: [],
    step: ({ inputs }) => ({ out: K(inputs.in) }),
  },
  {
    type: "filter",
    label: "Filter (LPF)",
    category: "signal",
    description: "1st-order low-pass",
    icon: "Filter",
    color: "#14b8a6",
    inputs: [{ id: "in", label: "In" }],
    outputs: [{ id: "out", label: "Out" }],
    params: [{ key: "fc", label: "Cutoff", type: "number", default: 10, unit: "Hz" }],
    initialState: { y: 0 },
    step: ({ inputs, params, dt, state }) => {
      const rc = 1 / (2 * Math.PI * Math.max(0.001, K(params.fc as number, 10)));
      const a = dt / (rc + dt);
      state.y = K(state.y) + a * (K(inputs.in) - K(state.y));
      return { out: state.y };
    },
  },

  // ─────────── Mechanical ───────────
  {
    type: "mass",
    label: "Mass",
    category: "mechanical",
    description: "F = m·a → integrate to velocity",
    icon: "Box",
    color: "#eab308",
    inputs: [{ id: "F", label: "Force" }],
    outputs: [{ id: "v", label: "v" }],
    params: [{ key: "m", label: "Mass", type: "number", default: 1, unit: "kg" }],
    initialState: { v: 0 },
    step: ({ inputs, params, dt, state }) => {
      state.v = K(state.v) + (K(inputs.F) / Math.max(1e-6, K(params.m as number, 1))) * dt;
      return { v: state.v };
    },
  },
  {
    type: "spring",
    label: "Spring",
    category: "mechanical",
    description: "F = k·x",
    icon: "Spline",
    color: "#eab308",
    inputs: [{ id: "x", label: "x" }],
    outputs: [{ id: "F", label: "F" }],
    params: [{ key: "k", label: "Stiffness", type: "number", default: 10, unit: "N/m" }],
    step: ({ inputs, params }) => ({ F: -K(inputs.x) * K(params.k as number, 10) }),
  },
  {
    type: "damper",
    label: "Damper",
    category: "mechanical",
    description: "F = c·v",
    icon: "Wind",
    color: "#eab308",
    inputs: [{ id: "v", label: "v" }],
    outputs: [{ id: "F", label: "F" }],
    params: [{ key: "c", label: "Damping", type: "number", default: 0.5 }],
    step: ({ inputs, params }) => ({ F: -K(inputs.v) * K(params.c as number, 0.5) }),
  },
  {
    type: "motor",
    label: "DC Motor",
    category: "mechanical",
    description: "ω = Kv · V",
    icon: "RotateCw",
    color: "#eab308",
    inputs: [{ id: "V", label: "V" }],
    outputs: [{ id: "w", label: "ω" }],
    params: [{ key: "Kv", label: "Kv", type: "number", default: 100 }],
    step: ({ inputs, params }) => ({ w: K(inputs.V) * K(params.Kv as number, 100) }),
  },
  {
    type: "gear",
    label: "Gear",
    category: "mechanical",
    description: "ω_out = ω_in / ratio",
    icon: "Cog",
    color: "#eab308",
    inputs: [{ id: "in", label: "ω in" }],
    outputs: [{ id: "out", label: "ω out" }],
    params: [{ key: "ratio", label: "Ratio", type: "number", default: 2 }],
    step: ({ inputs, params }) => ({ out: K(inputs.in) / Math.max(1e-6, K(params.ratio as number, 2)) }),
  },

  // ─────────── Communication ───────────
  {
    type: "am",
    label: "AM Modulator",
    category: "communication",
    description: "(1 + m·x) · cos(2πfc·t)",
    icon: "Radio",
    color: "#f472b6",
    inputs: [{ id: "in", label: "msg" }],
    outputs: [{ id: "out", label: "AM" }],
    params: [
      { key: "fc", label: "Carrier fc", type: "number", default: 100 },
      { key: "m", label: "Mod index", type: "number", default: 0.5 },
    ],
    step: ({ t, inputs, params }) => ({
      out:
        (1 + K(params.m as number, 0.5) * K(inputs.in)) *
        Math.cos(2 * Math.PI * K(params.fc as number, 100) * t),
    }),
  },
  {
    type: "fm",
    label: "FM Modulator",
    category: "communication",
    description: "cos(2π(fc + Δf·x)·t)",
    icon: "Radio",
    color: "#f472b6",
    inputs: [{ id: "in", label: "msg" }],
    outputs: [{ id: "out", label: "FM" }],
    params: [
      { key: "fc", label: "Carrier fc", type: "number", default: 100 },
      { key: "df", label: "Δf", type: "number", default: 20 },
    ],
    step: ({ t, inputs, params }) => ({
      out: Math.cos(
        2 * Math.PI * (K(params.fc as number, 100) + K(params.df as number, 20) * K(inputs.in)) * t,
      ),
    }),
  },
  {
    type: "bpsk",
    label: "BPSK",
    category: "communication",
    description: "sign(x) · cos(2πfc·t)",
    icon: "Radio",
    color: "#f472b6",
    inputs: [{ id: "in", label: "bit" }],
    outputs: [{ id: "out", label: "s" }],
    params: [{ key: "fc", label: "fc", type: "number", default: 100 }],
    step: ({ t, inputs, params }) => ({
      out: (K(inputs.in) >= 0.5 ? 1 : -1) * Math.cos(2 * Math.PI * K(params.fc as number, 100) * t),
    }),
  },
  {
    type: "qpsk",
    label: "QPSK",
    category: "communication",
    description: "Two-bit phase shift keying",
    icon: "Radio",
    color: "#f472b6",
    inputs: [{ id: "i", label: "I" }, { id: "q", label: "Q" }],
    outputs: [{ id: "out", label: "s" }],
    params: [{ key: "fc", label: "fc", type: "number", default: 100 }],
    step: ({ t, inputs, params }) => {
      const w = 2 * Math.PI * K(params.fc as number, 100) * t;
      return { out: K(inputs.i) * Math.cos(w) - K(inputs.q) * Math.sin(w) };
    },
  },
  {
    type: "channel",
    label: "Channel",
    category: "communication",
    description: "AWGN channel",
    icon: "Signal",
    color: "#f472b6",
    inputs: [{ id: "in", label: "In" }],
    outputs: [{ id: "out", label: "Out" }],
    params: [{ key: "n", label: "Noise σ", type: "number", default: 0.1 }],
    step: ({ inputs, params }) => ({
      out: K(inputs.in) + (Math.random() - 0.5) * 2 * K(params.n as number, 0.1),
    }),
  },

  // ─────────── Sinks (Scope) ───────────
  {
    type: "scope",
    label: "Scope",
    category: "sinks",
    description: "Oscilloscope — records input trace",
    icon: "MonitorPlay",
    color: "#38bdf8",
    inputs: [{ id: "in", label: "In" }],
    outputs: [],
    params: [{ key: "channel", label: "Channel name", type: "string", default: "ch1" }],
    step: ({ inputs, params, log }) => {
      log?.((params.channel as string) || "ch1", K(inputs.in));
      return {};
    },
  },
];

export const CATEGORIES: { id: BlockCategory; label: string }[] = [
  { id: "electrical", label: "Electrical" },
  { id: "semiconductors", label: "Semiconductors" },
  { id: "ic", label: "Integrated Circuits" },
  { id: "power", label: "Power Electronics" },
  { id: "control", label: "Control Systems" },
  { id: "signal", label: "Signal Processing" },
  { id: "mechanical", label: "Mechanical" },
  { id: "communication", label: "Communication" },
  { id: "sinks", label: "Sinks / Scopes" },
];

const byType = new Map(BLOCKS.map((b) => [b.type, b]));
export function getBlockDef(type: string): BlockDefinition | undefined {
  return byType.get(type);
}
