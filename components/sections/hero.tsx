"use client";

import { motion, useReducedMotion } from "motion/react";
import type { SiteEntry } from "@/lib/admin/types";
import { CinematicVideo } from "@/components/cinematic-video";
import { Container } from "@/components/containers";

const EASE = [0.22, 1, 0.36, 1] as const;

function Wordmark({
  name,
  reduce,
}: {
  name: string;
  reduce: boolean | null;
}) {
  const letters = name.split("");

  if (reduce) {
    return (
      <h1 className="font-display font-light uppercase leading-[0.86] tracking-[0.02em] text-paper">
        {name}
      </h1>
    );
  }

  return (
    <h1
      aria-label={name}
      className="font-display font-light uppercase leading-[0.86] tracking-[0.02em] text-paper"
    >
      <span aria-hidden="true" className="flex justify-center">
        {letters.map((letter, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.06em]">
            <motion.span
              className="inline-block will-change-transform"
              initial={{ y: "112%" }}
              animate={{ y: "0%" }}
              transition={{
                duration: 1.1,
                delay: 0.35 + i * 0.055,
                ease: EASE,
              }}
            >
              {letter}
            </motion.span>
          </span>
        ))}
      </span>
    </h1>
  );
}

export function Hero({
  site,
  heroBackdrop,
}: {
  site: SiteEntry;
  heroBackdrop: { eyebrow: string; subline: string };
}) {
  const reduce = useReducedMotion();

  return (
    <section id="top" className="relative flex min-h-svh flex-col overflow-hidden bg-cine-black">
      {/* Background showreel loop */}
      <div className="absolute inset-0" aria-hidden="true">
        <CinematicVideo
          src={site.heroMedia.video}
          poster={site.heroMedia.poster}
          autoplay
          priority
          className="absolute inset-0"
        />
        <div className="vignette absolute inset-0" />
        {/* Dark overlay for legibility */}
        <div className="absolute inset-0 bg-cine-black/55" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-cine-black/90 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-cine-black via-cine-black/60 to-transparent" />
      </div>

      <Container className="relative flex flex-1 flex-col">
        <div className="flex flex-1 flex-col items-center justify-center pt-28 pb-24 text-center sm:pt-32">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
            className="mb-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-haze sm:text-[11px]"
          >
            <span className="hidden h-px w-10 bg-line sm:block" aria-hidden="true" />
            {heroBackdrop.eyebrow}
            <span className="hidden h-px w-10 bg-line sm:block" aria-hidden="true" />
          </motion.p>

          <div className="w-full text-[clamp(4.75rem,17.5vw,15rem)]">
            <Wordmark name={site.name} reduce={reduce} />
          </div>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.95, ease: EASE }}
            className="mt-10 font-mono text-[11px] uppercase tracking-[0.46em] text-haze sm:text-xs"
          >
            {site.roles.join("  ·  ")}
          </motion.p>

          <motion.blockquote
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.1, ease: EASE }}
            className="mt-12 max-w-3xl font-display text-2xl font-light italic leading-snug text-paper/95 sm:text-3xl lg:text-[2.6rem]"
          >
            “{site.tagline}”
          </motion.blockquote>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.25, ease: EASE }}
            className="mt-14 flex flex-col items-center gap-4 sm:flex-row sm:gap-5"
          >
            <a
              href="#showreel"
              className="group inline-flex items-center gap-3 border border-paper bg-paper px-8 py-4 font-mono text-[11px] uppercase tracking-[0.3em] text-cine-black transition-colors duration-300 hover:bg-transparent hover:text-paper"
            >
              <span
                aria-hidden="true"
                className="flex h-6 w-6 items-center justify-center rounded-full border border-current text-[9px]"
              >
                ▶
              </span>
              Watch Showreel
            </a>
            <a
              href="#work"
              className="group inline-flex items-center gap-3 border border-paper/35 px-8 py-4 font-mono text-[11px] uppercase tracking-[0.3em] text-paper transition-colors duration-300 hover:bg-paper hover:text-cine-black"
            >
              View Work
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          </motion.div>
        </div>

        {/* Bottom meta strip */}
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="relative z-10 flex items-end justify-between pb-8 font-mono text-[10px] uppercase tracking-[0.3em] text-dim"
        >
          <span className="flex items-center gap-3">
            Scroll
            <span
              aria-hidden="true"
              className="relative block h-10 w-px overflow-hidden bg-line"
            >
              <span className="absolute inset-x-0 top-0 h-4 animate-[scrollcue_1.8s_ease-in-out_infinite] bg-paper/70" />
            </span>
          </span>
          <span className="hidden sm:block">{site.availability}</span>
          <a href="#work" className="transition-colors hover:text-paper">
            Selected Work ↓
          </a>
        </motion.div>
      </Container>
    </section>
  );
}