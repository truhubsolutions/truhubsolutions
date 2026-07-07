import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Sparkles, ArrowUpRight, Check, MessageCircle } from "lucide-react";
import { DEMOS } from "@/lib/demos-data";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { FloatingWhatsApp } from "@/components/site/whatsapp";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Live Website Demos — TruHub Solutions" },
      { name: "description", content: "Explore 18+ premium industry website demos — restaurants, corporate, e-commerce, hotels and more. Every site customizable for your business." },
      { property: "og:title", content: "Live Website Demos — TruHub Solutions" },
      { property: "og:description", content: "Premium industry website templates you can customize for your business." },
    ],
  }),
  component: DemoGalleryPage,
});

const ALL_FEATURES = ["Responsive", "WhatsApp Integration", "Booking System", "SEO Optimized", "Modern UI", "Mobile Friendly"];
const PRICE_RANGES = [
  { label: "All prices", min: 0, max: Infinity },
  { label: "Under ₹15K", min: 0, max: 15000 },
  { label: "₹15K – ₹20K", min: 15000, max: 20000 },
  { label: "₹20K+", min: 20000, max: Infinity },
];

function DemoGalleryPage() {
  const [q, setQ] = useState("");
  const [price, setPrice] = useState(0);
  const [feature, setFeature] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const range = PRICE_RANGES[price];
    return DEMOS.filter(d => {
      if (q && !(d.industry + " " + d.description + " " + d.tagline).toLowerCase().includes(q.toLowerCase())) return false;
      if (d.startingPrice < range.min || d.startingPrice > range.max) return false;
      if (feature && !d.features.includes(feature)) return false;
      return true;
    });
  }, [q, price, feature]);

  return (
    <div className="min-h-screen bg-background text-white">
      <Navbar />

      <section className="relative pt-32 pb-16">
        <div className="absolute inset-0 -z-10 opacity-40" style={{ background: "radial-gradient(1200px 500px at 50% 0%, rgba(30,167,255,0.25), transparent 60%)" }} />
        <div className="container-x text-center">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-[#38BDF8]">
            <Sparkles size={12} /> Live Demo Gallery
          </div>
          <h1 className="font-display text-4xl font-bold sm:text-6xl">
            <span className="text-gradient">Explore Our Live Website Demos</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/60">
            Experience premium demo websites built for different industries. Every website can be customized for your business.
          </p>
        </div>
      </section>

      <section className="container-x pb-6">
        <div className="rounded-2xl border border-white/10 bg-[#0B1220]/70 p-4 backdrop-blur">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Search demos by industry, feature..."
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-[#38BDF8]/50"
              />
            </div>
            <select value={price} onChange={e => setPrice(Number(e.target.value))} className="rounded-xl border border-white/10 bg-[#0B1220] px-3 py-2.5 text-sm text-white outline-none focus:border-[#38BDF8]/50">
              {PRICE_RANGES.map((r, i) => <option key={r.label} value={i}>{r.label}</option>)}
            </select>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={() => setFeature(null)} className={`rounded-full border px-3 py-1 text-xs transition ${!feature ? "border-[#38BDF8]/60 bg-[#38BDF8]/10 text-[#38BDF8]" : "border-white/10 text-white/60 hover:border-white/30 hover:text-white"}`}>All features</button>
            {ALL_FEATURES.map(f => (
              <button key={f} onClick={() => setFeature(f === feature ? null : f)} className={`rounded-full border px-3 py-1 text-xs transition ${feature === f ? "border-[#38BDF8]/60 bg-[#38BDF8]/10 text-[#38BDF8]" : "border-white/10 text-white/60 hover:border-white/30 hover:text-white"}`}>{f}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x pb-24">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-sm text-white/50">
            No demos match your filters.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((d, i) => (
              <article
                key={d.slug}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0B1220] transition-all duration-500 hover:-translate-y-1 hover:border-[#38BDF8]/40 animate-fade-in"
                style={{ animationDelay: `${(i % 6) * 60}ms`, boxShadow: "0 20px 60px -30px rgba(0,0,0,0.8)" }}
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-[#0B1220] to-[#111827]">
                  <img src={d.thumbnail} alt={d.industry} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-xs backdrop-blur">
                    <span>{d.icon}</span>
                    <span className="font-medium">{d.industry}</span>
                  </div>
                  <div className="absolute right-3 top-3 rounded-full bg-white/10 px-2.5 py-1 text-[10px] uppercase tracking-widest backdrop-blur" style={{ color: d.accent }}>
                    from ₹{d.startingPrice.toLocaleString("en-IN")}
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-lg font-semibold">{d.tagline}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-white/60">{d.description}</p>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {d.features.slice(0, 5).map(f => (
                      <li key={f} className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] text-white/70">
                        <Check size={10} className="text-[#38BDF8]" /> {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex gap-2 pt-5">
                    <Link
                      to="/demo/$slug"
                      params={{ slug: d.slug }}
                      className="btn-primary btn-primary-hover flex-1 justify-center !py-2 !text-xs"
                    >
                      View Live Demo <ArrowUpRight size={12} />
                    </Link>
                    <a
                      href={`https://wa.me/917989367882?text=${encodeURIComponent(`Hi TruHub, I'd like a website similar to your ${d.industry} demo.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost btn-ghost-hover !py-2 !text-xs"
                    >
                      <MessageCircle size={12} /> Request
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
