"use client";
import { Reveal } from "./reveal";

export function Process({ steps }: { steps: Array<{ title: string; desc: string }> }) {
  return (
    <section id="process" className="section relative">
      <div className="container-x">
        <Reveal>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <div className="mb-3 inline-block rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-[#38BDF8]">
              Our Process
            </div>
            <h2 className="font-display text-4xl font-bold sm:text-5xl">
              <span className="text-gradient">Six steps from idea to launch</span>
            </h2>
          </div>
        </Reveal>

        <div className="relative mx-auto max-w-3xl">
          <div
            className="absolute left-6 top-0 h-full w-px md:left-1/2"
            style={{ background: "linear-gradient(180deg, transparent, rgba(56,189,248,0.5), transparent)" }}
          />
          <div className="space-y-8">
            {steps.map((s, i) => {
              const left = i % 2 === 0;
              return (
                <Reveal key={s.title} delay={i}>
                  <div className={`relative flex items-start gap-6 md:items-center ${left ? "md:flex-row" : "md:flex-row-reverse"}`}>
                    <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1EA7FF] to-[#2563EB] font-display font-bold shadow-[0_10px_30px_-10px_rgba(30,167,255,0.7)] md:absolute md:left-1/2 md:-translate-x-1/2">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className={`card-premium card-premium-hover flex-1 p-6 md:max-w-[45%] ${left ? "md:mr-auto" : "md:ml-auto"}`}>
                      <div className="font-display text-xl font-semibold">{s.title}</div>
                      <div className="mt-2 text-sm text-white/60">{s.desc}</div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
