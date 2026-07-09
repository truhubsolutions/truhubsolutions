"use client";
import { Check, Sparkles, CalendarClock, MessageCircle } from "lucide-react";
import { Reveal } from "./reveal";
import { SectionHeader, type SectionMeta } from "./section-header";

export function Pricing({
  plans,
  addons,
  meta,
  addonsMeta,
}: {
  plans: Array<{ id: string; name: string; price: string; tagline: string | null; features: string[]; cta_label: string; highlighted: boolean }>;
  addons: Array<{ id: string; name: string; price: string }>;
  meta?: SectionMeta;
  addonsMeta?: SectionMeta;
}) {
  const addonsHeading = addonsMeta?.heading ?? "Additional Services";
  return (
    <section id="pricing" className="section relative">
      <div className="container-x">
        <SectionHeader
          meta={meta}
          eyebrow="Pricing"
          heading="Transparent pricing. Premium value."
          subheading="Choose a plan, or ask us for a custom quote."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {plans.map((p, i) => (
            <Reveal key={p.id} delay={i}>
              <div
                className={`group relative flex h-full flex-col rounded-3xl border p-7 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_rgba(30,167,255,0.35)] ${
                  p.highlighted
                    ? "border-[#38BDF8]/60 bg-gradient-to-b from-[rgba(30,167,255,0.14)] to-[rgba(11,18,32,0.9)] anim-glow-pulse"
                    : "border-white/10 bg-gradient-to-b from-[rgba(17,24,39,0.9)] to-[rgba(11,18,32,0.8)] hover:border-[#38BDF8]/40"
                }`}
              >
                {/* Glow border on hover */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(600px circle at 50% 0%, rgba(56,189,248,0.18), transparent 60%)",
                  }}
                />

                {p.tagline && (
                  <div
                    className="badge-radium absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#FF7A8A]/40 bg-[#1a0608]/80 px-3 py-1 text-xs font-semibold text-[#ffd8de] backdrop-blur-sm"
                  >
                    <span className="relative z-10 inline-flex items-center gap-1.5">
                      <img src="/truhub-logo.webp" alt="" aria-hidden className="h-3.5 w-3.5 rounded-full object-contain drop-shadow-[0_0_6px_rgba(255,122,138,0.9)]" />
                      {p.tagline}
                    </span>
                  </div>
                )}
                {p.highlighted && (
                  <img
                    src="/truhub-logo.webp"
                    alt=""
                    aria-hidden
                    className="absolute right-4 top-4 h-10 w-10 rounded-full object-contain opacity-90 [animation:spin_10s_linear_infinite] drop-shadow-[0_0_12px_rgba(255,122,138,0.6)]"
                  />
                )}
                <div className="text-sm uppercase tracking-widest text-white/50">{p.name}</div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-display text-4xl font-bold text-gradient-primary">{p.price}</span>
                </div>

                <div className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white/60">
                  <CalendarClock size={11} />
                  Monthly EMI — Coming Soon
                </div>

                <ul className="mt-6 flex-1 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-white/80">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1EA7FF]/15 text-[#38BDF8]">
                        <Check size={12} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  aria-label={`${p.cta_label} — ${p.name} plan`}
                  className={`mt-8 ${p.highlighted ? "btn-primary btn-primary-hover" : "btn-ghost btn-ghost-hover"}`}
                >
                  {p.cta_label}
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mt-8 text-center text-xs text-white/50">
            GST applicable as per government regulations.
          </p>
        </Reveal>

        {/* Need something unique? */}
        <Reveal>
          <div className="mt-14 rounded-3xl border border-white/10 bg-gradient-to-br from-[rgba(229,57,53,0.08)] via-[rgba(11,18,32,0.6)] to-[rgba(21,101,192,0.10)] p-8 text-center backdrop-blur-md md:p-12">
            <h3 className="font-display text-2xl font-bold text-white md:text-3xl">
              Need something unique?
            </h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-white/70 md:text-base">
              Every business is different. We also build completely custom software, AI solutions, ERP systems, CRM platforms, Restaurant Management Systems, Hospital Management Systems, School ERP, Mobile Apps and Enterprise Solutions.
            </p>
            <a href="#contact" className="btn-primary btn-primary-hover mt-6 inline-flex items-center gap-2">
              <MessageCircle size={16} />
              Talk to Our Experts
            </a>
          </div>
        </Reveal>

        {addons.length > 0 && (
          <Reveal>
            <div className="mt-16">
              <h3 className="mb-6 text-center font-display text-2xl font-semibold text-white/80">{addonsHeading}</h3>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
                {addons.map((a) => (
                  <div
                    key={a.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center transition hover:border-[#38BDF8]/40 hover:bg-white/[0.06]"
                  >
                    <div className="text-xs text-white/60">{a.name}</div>
                    <div className="mt-1 font-display font-semibold text-[#38BDF8]">{a.price}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
