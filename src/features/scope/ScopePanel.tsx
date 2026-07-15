import { useMemo, useRef, useEffect } from "react";
import { useStudio } from "../store/studio-store";

const COLORS = ["#38bdf8", "#22c55e", "#f59e0b", "#ef4444", "#a855f7", "#f472b6", "#14b8a6", "#eab308"];

export function ScopePanel() {
  const samples = useStudio((s) => s.samples);
  const ref = useRef<HTMLCanvasElement>(null);

  const channels = useMemo(() => {
    const set = new Set<string>();
    for (const s of samples) for (const k of Object.keys(s.values)) set.add(k);
    return Array.from(set);
  }, [samples]);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const w = c.clientWidth * dpr;
    const h = c.clientHeight * dpr;
    if (c.width !== w || c.height !== h) {
      c.width = w;
      c.height = h;
    }
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#030712";
    ctx.fillRect(0, 0, w, h);

    // grid
    ctx.strokeStyle = "#1f2937";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const x = (i / 10) * w;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
      const y = (i / 10) * h;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    if (!samples.length || !channels.length) return;

    // scale
    let min = Infinity;
    let max = -Infinity;
    for (const s of samples)
      for (const k of channels) {
        const v = s.values[k];
        if (v == null || !isFinite(v)) continue;
        if (v < min) min = v;
        if (v > max) max = v;
      }
    if (!isFinite(min) || !isFinite(max)) return;
    if (min === max) {
      min -= 1;
      max += 1;
    }
    const pad = (max - min) * 0.1;
    min -= pad;
    max += pad;

    const t0 = samples[0].t;
    const t1 = samples[samples.length - 1].t;
    const tRange = Math.max(1e-6, t1 - t0);

    channels.forEach((ch, idx) => {
      ctx.strokeStyle = COLORS[idx % COLORS.length];
      ctx.lineWidth = 1.5 * dpr;
      ctx.beginPath();
      let started = false;
      for (const s of samples) {
        const v = s.values[ch];
        if (v == null || !isFinite(v)) continue;
        const x = ((s.t - t0) / tRange) * w;
        const y = h - ((v - min) / (max - min)) * h;
        if (!started) {
          ctx.moveTo(x, y);
          started = true;
        } else ctx.lineTo(x, y);
      }
      ctx.stroke();
    });
  }, [samples, channels]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-slate-800 px-3 py-1.5 text-xs">
        <div className="text-[10px] uppercase tracking-wider text-slate-400">Oscilloscope</div>
        <div className="flex gap-3">
          {channels.map((c, i) => (
            <div key={c} className="flex items-center gap-1 text-[10px] text-slate-400">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: COLORS[i % COLORS.length] }}
              />
              {c}
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 relative">
        <canvas ref={ref} className="absolute inset-0 h-full w-full" />
        {samples.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-600 text-xs">
            Add a Scope block and press Play to see traces.
          </div>
        )}
      </div>
    </div>
  );
}
