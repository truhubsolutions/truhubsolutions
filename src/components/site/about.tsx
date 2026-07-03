"use client";
import { Reveal } from "./reveal";

export function About({
  heading,
  body,
}: {
  heading: string;
  body: string;
}) {
  return (
    <section id="about" className="section relative">
      <div className="container-x relative">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-block rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-[#38BDF8]">
              About TruHub
            </div>
            <h2 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
              <span className="text-gradient">{heading}</span>
            </h2>
            <p className="mt-6 text-white/70">{body}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

