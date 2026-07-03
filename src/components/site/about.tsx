"use client";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "./reveal";

function Counter({ to, suffix = "", label }: { to: number; suffix?: string; label: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const dur = 1600;
          const tick = (t: number) => {
            const p = Math.min(1, (t - start) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(Math.round(to * eased));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      });
    });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return (
    <div ref={ref} className="card-premium card-premium-hover p-8 text-center">
      <div className="font-display text-5xl font-bold text-gradient-primary">
        {val}
        {suffix}
      </div>
      <div className="mt-2 text-sm text-white/60">{label}</div>
    </div>
  );
}

export function About({
  heading,
  body,
  stats,
}: {
  heading: string;
  body: string;
  stats: { projects: number; clients: number; satisfaction: number; support: string };
}) {
  return (
    <section id="about" className="section relative">
      <div className="container-x relative">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div>
              <div className="mb-4 inline-block rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-[#38BDF8]">
                About TruHub
              </div>
              <h2 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
                <span className="text-gradient">{heading}</span>
              </h2>
              <p className="mt-6 max-w-xl text-white/70">{body}</p>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 gap-4">
            <Reveal delay={0}><Counter to={stats.projects} suffix="+" label="Projects Completed" /></Reveal>
            <Reveal delay={1}><Counter to={stats.clients} suffix="+" label="Happy Clients" /></Reveal>
            <Reveal delay={2}><Counter to={stats.satisfaction} suffix="%" label="Customer Satisfaction" /></Reveal>
            <Reveal delay={3}>
              <div className="card-premium card-premium-hover p-8 text-center">
                <div className="font-display text-5xl font-bold text-gradient-primary">{stats.support}</div>
                <div className="mt-2 text-sm text-white/60">Support Available</div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
