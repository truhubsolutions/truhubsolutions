import { useMemo, useState } from "react";
import { BLOCKS, CATEGORIES } from "../blocks/registry";
import { useStudio } from "../store/studio-store";

export function BlockLibraryPanel() {
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () => BLOCKS.filter((b) => b.label.toLowerCase().includes(q.toLowerCase())),
    [q],
  );
  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-slate-800">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search blocks…"
          className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-100 outline-none focus:border-sky-400"
        />
      </div>
      <div className="flex-1 overflow-auto text-xs">
        {CATEGORIES.map((cat) => {
          const items = filtered.filter((b) => b.category === cat.id);
          if (!items.length) return null;
          return (
            <div key={cat.id} className="border-b border-slate-800">
              <div className="px-3 py-2 text-[10px] uppercase tracking-wider text-slate-400 bg-slate-900/50">
                {cat.label}
              </div>
              <div className="grid grid-cols-2 gap-1 p-2">
                {items.map((b) => (
                  <div
                    key={b.type}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("application/truhub-block", b.type)}
                    className="cursor-grab active:cursor-grabbing rounded border border-slate-700 bg-slate-900 hover:border-sky-500 hover:bg-slate-800 p-2"
                    title={b.description}
                    style={{ borderLeft: `3px solid ${b.color}` }}
                  >
                    <div className="text-[11px] font-semibold text-slate-100">{b.label}</div>
                    <div className="text-[9px] text-slate-500 line-clamp-1">{b.description}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function PropertyInspectorPanel() {
  const selection = useStudio((s) => s.selection);
  const nodes = useStudio((s) => s.nodes);
  const updateParams = useStudio((s) => s.updateNodeParams);
  const updateLabel = useStudio((s) => s.updateNodeLabel);
  const node = nodes.find((n) => n.id === selection[0]);
  if (!node) {
    return <div className="p-4 text-xs text-slate-500">Select a block to edit its properties.</div>;
  }
  const def = BLOCKS.find((b) => b.type === node.data.blockType);
  if (!def) return null;
  return (
    <div className="p-3 space-y-3 text-xs overflow-auto">
      <div>
        <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Label</div>
        <input
          value={node.data.label}
          onChange={(e) => updateLabel(node.id, e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-100"
        />
      </div>
      <div className="text-[10px] text-slate-500">Type: {def.label} · ID: {node.id}</div>
      {def.params.map((p) => {
        const v = node.data.params[p.key] ?? p.default;
        return (
          <div key={p.key}>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">
              {p.label} {p.unit && <span className="text-slate-500">({p.unit})</span>}
            </div>
            {p.type === "boolean" ? (
              <input
                type="checkbox"
                checked={!!v}
                onChange={(e) => updateParams(node.id, { [p.key]: e.target.checked })}
              />
            ) : p.type === "select" ? (
              <select
                value={String(v)}
                onChange={(e) => updateParams(node.id, { [p.key]: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-100"
              >
                {p.options?.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ) : p.type === "string" ? (
              <input
                value={String(v)}
                onChange={(e) => updateParams(node.id, { [p.key]: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-100"
              />
            ) : (
              <input
                type="number"
                value={Number(v)}
                step={p.step ?? "any"}
                min={p.min}
                max={p.max}
                onChange={(e) => updateParams(node.id, { [p.key]: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-100"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function ConsolePanel() {
  const logs = useStudio((s) => s.logs);
  const clear = useStudio((s) => s.clearLogs);
  const vars = useStudio((s) => s.variables);
  return (
    <div className="flex flex-col h-full text-xs">
      <div className="flex items-center justify-between border-b border-slate-800 px-3 py-1.5">
        <div className="text-[10px] uppercase tracking-wider text-slate-400">Console</div>
        <button onClick={clear} className="text-[10px] text-slate-500 hover:text-sky-400">
          clear
        </button>
      </div>
      <div className="flex-1 overflow-auto font-mono">
        {logs.length === 0 && <div className="p-3 text-slate-600">No messages.</div>}
        {logs.map((l) => (
          <div
            key={l.id}
            className={`px-3 py-1 border-b border-slate-900 ${
              l.level === "error"
                ? "text-red-400"
                : l.level === "warn"
                  ? "text-amber-400"
                  : "text-slate-300"
            }`}
          >
            <span className="text-slate-600 mr-2">{new Date(l.ts).toLocaleTimeString()}</span>
            {l.msg}
          </div>
        ))}
      </div>
      {Object.keys(vars).length > 0 && (
        <div className="border-t border-slate-800 p-2 text-[10px] text-slate-400 max-h-24 overflow-auto">
          <div className="uppercase tracking-wider mb-1">Live variables</div>
          <div className="grid grid-cols-2 gap-x-3">
            {Object.entries(vars).map(([k, v]) => (
              <div key={k} className="flex justify-between font-mono">
                <span className="text-slate-500">{k}</span>
                <span className="text-sky-300">{Number(v).toFixed(4)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
