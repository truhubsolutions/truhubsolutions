import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Trash2, Save, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { DEMOS as SEED, type Demo } from "@/lib/demos-data";
import { Link } from "@tanstack/react-router";

const STORAGE_KEY = "truhub_demos_overrides_v1";

export const Route = createFileRoute("/admin/demos")({
  head: () => ({ meta: [{ title: "Demos Admin — TruHub" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: DemosAdmin,
});

type Store = { demos: Demo[] };

function load(): Store {
  if (typeof window === "undefined") return { demos: SEED };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* noop */ }
  return { demos: SEED };
}

function save(s: Store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

function blankDemo(): Demo {
  return {
    slug: "new-demo-" + Math.random().toString(36).slice(2, 6),
    industry: "New Industry",
    icon: "✨",
    tagline: "New Demo Website",
    description: "Describe this demo.",
    thumbnail: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=70",
    accent: "#38BDF8",
    startingPrice: 14999,
    features: ["Responsive", "Modern UI", "Mobile Friendly"],
    pages: ["Home", "About", "Contact"],
    sections: [{ id: "hero", kind: "hero", title: "Welcome", body: "Beautiful landing hero." }],
    enabled: true,
  };
}

function DemosAdmin() {
  const [store, setStore] = useState<Store>(() => ({ demos: SEED }));
  const [dirty, setDirty] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  useEffect(() => { setStore(load()); }, []);

  function update(idx: number, patch: Partial<Demo>) {
    setStore(s => ({ demos: s.demos.map((d, i) => i === idx ? { ...d, ...patch } : d) }));
    setDirty(true);
  }
  function remove(idx: number) {
    if (!confirm("Delete this demo?")) return;
    setStore(s => ({ demos: s.demos.filter((_, i) => i !== idx) }));
    setDirty(true);
  }
  function add() {
    setStore(s => ({ demos: [blankDemo(), ...s.demos] }));
    setDirty(true);
  }
  function persist() {
    save(store);
    setDirty(false);
  }
  function reset() {
    if (!confirm("Reset to defaults? All local edits will be lost.")) return;
    localStorage.removeItem(STORAGE_KEY);
    setStore({ demos: SEED });
    setDirty(false);
  }

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="border-b border-white/10 bg-[#0B1220]/80 backdrop-blur">
        <div className="container-x flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="text-white/60 hover:text-white"><ArrowLeft size={16} /></Link>
            <h1 className="font-display text-lg font-semibold">Demos Admin</h1>
            <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-white/50">{store.demos.length} demos · local</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={reset} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/60 hover:text-white">Reset</button>
            <button onClick={add} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs hover:border-white/30"><Plus size={12} className="inline" /> Add Demo</button>
            <button onClick={persist} disabled={!dirty} className="btn-primary btn-primary-hover !py-1.5 !text-xs disabled:opacity-40">
              <Save size={12} /> {dirty ? "Save" : "Saved"}
            </button>
          </div>
        </div>
      </div>

      <div className="container-x py-8">
        <p className="mb-6 text-xs text-white/50">Changes save to browser localStorage as overrides. Wire up backend later for multi-user editing.</p>
        <div className="space-y-3">
          {store.demos.map((d, i) => (
            <div key={d.slug + i} className="rounded-2xl border border-white/10 bg-[#0B1220]">
              <div className="flex items-center gap-4 p-4">
                <img src={d.thumbnail} alt="" className="h-14 w-20 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span>{d.icon}</span>
                    <span className="font-display text-base font-semibold">{d.industry}</span>
                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/50">/demo/{d.slug}</span>
                    {d.enabled === false && <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] text-red-300">disabled</span>}
                  </div>
                  <div className="mt-1 truncate text-xs text-white/50">{d.description}</div>
                  <div className="mt-1 text-xs text-[#38BDF8]">from ₹{d.startingPrice.toLocaleString("en-IN")}</div>
                </div>
                <button onClick={() => update(i, { enabled: d.enabled === false })} className="rounded-lg border border-white/10 p-2 text-white/60 hover:text-white" title="Toggle enabled">
                  {d.enabled === false ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button onClick={() => setEditing(editing === d.slug ? null : d.slug)} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs hover:border-white/30">
                  {editing === d.slug ? "Close" : "Edit"}
                </button>
                <button onClick={() => remove(i)} className="rounded-lg border border-red-500/20 p-2 text-red-400 hover:bg-red-500/10">
                  <Trash2 size={14} />
                </button>
              </div>
              {editing === d.slug && (
                <div className="grid gap-3 border-t border-white/5 p-4 md:grid-cols-2">
                  <Field label="Industry" value={d.industry} onChange={v => update(i, { industry: v })} />
                  <Field label="Slug" value={d.slug} onChange={v => update(i, { slug: v.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} />
                  <Field label="Tagline" value={d.tagline} onChange={v => update(i, { tagline: v })} />
                  <Field label="Icon (emoji)" value={d.icon} onChange={v => update(i, { icon: v })} />
                  <Field label="Thumbnail URL" value={d.thumbnail} onChange={v => update(i, { thumbnail: v })} className="md:col-span-2" />
                  <Field label="Description" value={d.description} onChange={v => update(i, { description: v })} className="md:col-span-2" textarea />
                  <Field label="Accent color" value={d.accent} onChange={v => update(i, { accent: v })} />
                  <Field label="Starting price (₹)" type="number" value={String(d.startingPrice)} onChange={v => update(i, { startingPrice: Number(v) || 0 })} />
                  <Field label="Features (comma-separated)" value={d.features.join(", ")} onChange={v => update(i, { features: v.split(",").map(s => s.trim()).filter(Boolean) })} className="md:col-span-2" />
                  <Field label="Pages (comma-separated)" value={d.pages.join(", ")} onChange={v => update(i, { pages: v.split(",").map(s => s.trim()).filter(Boolean) })} className="md:col-span-2" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, className = "", type = "text", textarea = false }: { label: string; value: string; onChange: (v: string) => void; className?: string; type?: string; textarea?: boolean }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-[10px] uppercase tracking-widest text-white/50">{label}</span>
      {textarea ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} rows={2} className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm outline-none focus:border-[#38BDF8]/50" />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm outline-none focus:border-[#38BDF8]/50" />
      )}
    </label>
  );
}
