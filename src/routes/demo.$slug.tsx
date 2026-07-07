import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowUpRight, Check, MapPin, Phone, MessageCircle, Sparkles, Calendar } from "lucide-react";
import { getDemo, type DemoSection } from "@/lib/demos-data";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { FloatingWhatsApp } from "@/components/site/whatsapp";

export const Route = createFileRoute("/demo/$slug")({
  loader: ({ params }) => {
    const demo = getDemo(params.slug);
    if (!demo) throw notFound();
    return { demo };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Demo not found" }, { name: "robots", content: "noindex" }] };
    const d = loaderData.demo;
    return {
      meta: [
        { title: `${d.tagline} — Live Demo · TruHub Solutions` },
        { name: "description", content: `${d.description} Starting from ₹${d.startingPrice.toLocaleString("en-IN")}.` },
        { property: "og:title", content: `${d.tagline} — Live Demo` },
        { property: "og:description", content: d.description },
        { property: "og:image", content: d.thumbnail },
      ],
    };
  },
  component: DemoDetailPage,
  notFoundComponent: DemoNotFound,
});

function DemoNotFound() {
  return (
    <div className="min-h-screen bg-background text-white">
      <Navbar />
      <div className="container-x flex min-h-[70vh] items-center justify-center text-center">
        <div>
          <h1 className="font-display text-4xl">Demo not found</h1>
          <p className="mt-2 text-white/60">The demo you're looking for doesn't exist.</p>
          <Link to="/demo" className="btn-primary btn-primary-hover mt-6 inline-flex">Browse all demos</Link>
        </div>
      </div>
    </div>
  );
}

function DemoDetailPage() {
  const { demo: d } = Route.useLoaderData() as { demo: import("@/lib/demos-data").Demo };

  return (
    <div className="min-h-screen bg-background text-white">
      <Navbar />

      {/* Sticky demo sub-nav */}
      <div className="fixed top-20 left-0 right-0 z-40 hidden lg:block">
        <div className="container-x">
          <div className="mx-auto flex max-w-fit items-center gap-1 rounded-full border border-white/10 bg-[#0B1220]/80 px-2 py-1.5 text-xs backdrop-blur">
            <span className="rounded-full bg-white/10 px-2.5 py-1 font-medium">{d.icon} {d.industry} Demo</span>
            {d.pages.slice(0, 6).map(p => (
              <a key={p} href={`#${p.toLowerCase().replace(/\s+/g, "-")}`} className="rounded-full px-2.5 py-1 text-white/60 hover:bg-white/5 hover:text-white">{p}</a>
            ))}
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div
          className="absolute inset-0 -z-10 opacity-30"
          style={{ background: `radial-gradient(1200px 500px at 50% 0%, ${d.accent}55, transparent 60%)` }}
        />
        <div className="container-x">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium" style={{ color: d.accent }}>
                <Sparkles size={12} /> Live Demo · {d.industry}
              </div>
              <h1 className="mt-4 font-display text-4xl font-bold sm:text-6xl">
                <span className="text-gradient">{d.tagline}</span>
              </h1>
              <p className="mt-4 max-w-lg text-white/60">{d.description}</p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a href="#overview" className="btn-primary btn-primary-hover">
                  Explore Demo <ArrowUpRight size={14} />
                </a>
                <a
                  href={`https://wa.me/917989367882?text=${encodeURIComponent(`Hi TruHub, I'd like a ${d.industry} website like your demo.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost btn-ghost-hover"
                >
                  <MessageCircle size={14} /> Request Similar Website
                </a>
              </div>
              <div className="mt-8 text-xs text-white/50">
                Starting from <span className="font-display text-2xl text-white">₹{d.startingPrice.toLocaleString("en-IN")}</span>
              </div>
            </div>
            <div className="relative animate-fade-in" style={{ animationDelay: "120ms" }}>
              <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)]">
                <img src={d.thumbnail} alt={d.industry} className="w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/50 to-transparent" />
              </div>
              <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] opacity-30 blur-3xl" style={{ background: d.accent }} />
            </div>
          </div>
        </div>
      </section>

      {/* Overview: pages + features */}
      <section id="overview" className="section">
        <div className="container-x grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-[#0B1220] p-8">
            <h2 className="font-display text-2xl font-semibold">Pages Included</h2>
            <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {d.pages.map(p => (
                <li key={p} className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-white/80">
                  <Check size={14} className="text-[#38BDF8]" /> {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#0B1220] p-8">
            <h2 className="font-display text-2xl font-semibold">Features</h2>
            <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {d.features.map(f => (
                <li key={f} className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-white/80">
                  <Check size={14} style={{ color: d.accent }} /> {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Dynamic sections */}
      {d.sections.map((s, i) => (
        <SectionRenderer key={s.id} section={s} accent={d.accent} idx={i} />
      ))}

      {/* Contact bar */}
      <section className="container-x pb-16">
        <div className="rounded-2xl border border-white/10 bg-[#0B1220] p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-3">
            <InfoLine icon={<MapPin size={16} />} title="Visit" text="123 Sample Street, City" />
            <InfoLine icon={<Phone size={16} />} title="Call" text="+91 98765 43210" />
            <InfoLine icon={<Calendar size={16} />} title="Hours" text="Mon–Sat · 10am – 8pm" />
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 p-10 md:p-16 text-center" style={{ background: `linear-gradient(135deg, ${d.accent}22, #0B1220 60%)` }}>
            <div className="absolute -inset-1 -z-10 opacity-40 blur-3xl" style={{ background: d.accent }} />
            <h2 className="font-display text-3xl font-bold sm:text-5xl">
              <span className="text-gradient">Like this website?</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/70">
              We can build a similar website customized for your business — with your branding, content and features.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a href="/#contact" className="btn-primary btn-primary-hover">Get Free Quote</a>
              <a
                href={`https://wa.me/917989367882?text=${encodeURIComponent(`Hi TruHub, I'd like a free consultation for a ${d.industry} website.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost btn-ghost-hover"
              >
                Book Free Consultation
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer email="hello@truhubsolutions.com" phone="+91 79893 67882" />
      <FloatingWhatsApp />
    </div>
  );
}

function InfoLine({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-[#38BDF8]/10 text-[#38BDF8]">{icon}</div>
      <div>
        <div className="text-xs uppercase tracking-widest text-white/50">{title}</div>
        <div className="text-sm">{text}</div>
      </div>
    </div>
  );
}

function SectionRenderer({ section: s, accent, idx }: { section: DemoSection; accent: string; idx: number }) {
  const anchorId = s.title.toLowerCase().replace(/\s+/g, "-");
  if (s.kind === "hero") {
    return (
      <section id={anchorId} className="section">
        <div className="container-x">
          <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-[#0B1220]/70 p-10 text-center backdrop-blur">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">{s.title}</h2>
            {s.body && <p className="mt-4 text-white/70">{s.body}</p>}
          </div>
        </div>
      </section>
    );
  }
  if (s.kind === "text") {
    return (
      <section id={anchorId} className="section">
        <div className="container-x mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl"><span className="text-gradient">{s.title}</span></h2>
          {s.body && <p className="mt-4 text-white/70">{s.body}</p>}
        </div>
      </section>
    );
  }
  if (s.kind === "form") {
    return (
      <section id={anchorId} className="section">
        <div className="container-x mx-auto max-w-2xl">
          <h2 className="text-center font-display text-3xl font-bold sm:text-4xl"><span className="text-gradient">{s.title}</span></h2>
          <form className="mt-8 grid gap-3 rounded-2xl border border-white/10 bg-[#0B1220] p-6" onSubmit={e => e.preventDefault()}>
            <input placeholder="Full name" className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none focus:border-[#38BDF8]/50" />
            <input placeholder="Phone or email" className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none focus:border-[#38BDF8]/50" />
            <div className="grid grid-cols-2 gap-3">
              <input type="date" className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none focus:border-[#38BDF8]/50" />
              <input placeholder="Guests / party size" className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none focus:border-[#38BDF8]/50" />
            </div>
            <button type="submit" className="btn-primary btn-primary-hover mt-1 justify-center" style={{ background: `linear-gradient(135deg, ${accent}, #2563EB)` }}>Confirm Booking</button>
          </form>
        </div>
      </section>
    );
  }
  if (s.kind === "list" || s.kind === "table") {
    return (
      <section id={anchorId} className="section">
        <div className="container-x mx-auto max-w-3xl">
          <h2 className="text-center font-display text-3xl font-bold sm:text-4xl"><span className="text-gradient">{s.title}</span></h2>
          <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#0B1220]">
            {s.items?.map((it, i) => (
              <div key={i} className={`flex items-center justify-between px-6 py-4 ${i > 0 ? "border-t border-white/5" : ""}`}>
                <div>
                  <div className="font-medium">{it.title}</div>
                  {it.description && <div className="text-xs text-white/50">{it.description}</div>}
                </div>
                {it.meta && <div className="text-sm text-white/70">{it.meta}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  if (s.kind === "gallery") {
    return (
      <section id={anchorId} className="section">
        <div className="container-x">
          <h2 className="text-center font-display text-3xl font-bold sm:text-4xl"><span className="text-gradient">{s.title}</span></h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {s.items?.map((it, i) => (
              <div key={i} className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                {it.image && <img src={it.image} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  // grid
  return (
    <section id={anchorId} className={`section ${idx % 2 === 0 ? "" : "bg-white/[0.02]"}`}>
      <div className="container-x">
        <h2 className="text-center font-display text-3xl font-bold sm:text-4xl"><span className="text-gradient">{s.title}</span></h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {s.items?.map((it, i) => (
            <div key={i} className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0B1220] transition hover:-translate-y-1 hover:border-[#38BDF8]/40 animate-fade-in" style={{ animationDelay: `${i * 60}ms`, boxShadow: "0 20px 60px -30px rgba(0,0,0,0.8)" }}>
              {it.image && (
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={it.image} alt={it.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-display text-base font-semibold">{it.title}</div>
                  {it.meta && <div className="text-xs" style={{ color: accent }}>{it.meta}</div>}
                </div>
                {it.description && <p className="mt-1 text-sm text-white/60">{it.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
