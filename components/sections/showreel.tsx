"use client";

import { useRef, useState } from "react";
import {
  CinematicVideo,
  type CinematicVideoHandle,
} from "@/components/cinematic-video";
import { Container, Eyebrow, SectionTitle } from "@/components/containers";
import { MaskLine, Reveal } from "@/components/reveal";
import type { SiteEntry } from "@/lib/admin/types";

export function Showreel({ site }: { site: SiteEntry }) {
  const [playing, setPlaying] = useState(true);
  const reelRef = useRef<CinematicVideoHandle>(null);

  const toggle = () => {
    if (playing) {
      reelRef.current?.pause();
    } else {
      reelRef.current?.play();
    }
  };

  return (
    <section id="showreel" className="relative scroll-mt-24 py-24 sm:py-28 lg:py-36">
      <Container>
        <div className="-mb-[100px] lg:-mb-[100px]">
          <div>
            <Reveal>
              <Eyebrow index="01">Showreel</Eyebrow>
            </Reveal>
            <Reveal delay={0.15} className="mt-2">
              <p className="max-w-sm font-mono text-[11px] uppercase leading-relaxed tracking-[0.24em] text-dim">
                A single cut through {site.showreel.runtime} of edits, grades and
                cinematography — spanning film, YouTube, commercials and AI work.
              </p>
            </Reveal>
            <SectionTitle className="mt-6 text-5xl sm:text-6xl lg:text-7xl">
              <MaskLine>The Work,</MaskLine>
              <MaskLine delay={0.08} className="italic">
                In Motion
              </MaskLine>
            </SectionTitle>
          </div>
        </div>

        <Reveal>
          <figure className="group relative">
            <div className="relative aspect-video w-full overflow-hidden border border-line bg-cine-black sm:aspect-[16/8] lg:aspect-[21/9]">
              <CinematicVideo
                ref={reelRef}
                src={site.showreel.video}
                poster={site.showreel.poster}
                autoplay
                alt={`${site.showreel.title} — film still`}
                className="absolute inset-0"
                onPlayingChange={setPlaying}
              />
              <div className="vignette absolute inset-0" aria-hidden="true" />

              {/* Reel meta chips */}
              <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 font-mono text-[10px] uppercase tracking-[0.28em] text-paper/85 sm:p-6">
                <span className="flex items-center gap-2 border border-paper/25 bg-cine-black/50 px-3 py-1.5 backdrop-blur-sm">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {site.showreel.title}
                </span>
                <span className="border border-paper/25 bg-cine-black/50 px-3 py-1.5 backdrop-blur-sm">
                  {playing ? "Playing" : "Paused"} · 00:00 / {site.showreel.runtime}
                </span>
              </div>

              {/* Play / pause control */}
              <button
                type="button"
                onClick={toggle}
                aria-pressed={!playing}
                aria-label={playing ? "Pause showreel" : "Play showreel"}
                className="absolute inset-0 z-10 flex items-center justify-center"
              >
                <span
                  aria-hidden="true"
                  className={`flex h-20 w-20 items-center justify-center rounded-full border border-paper/60 bg-cine-black/20 text-paper backdrop-blur-sm transition-all duration-500 sm:h-24 sm:w-24 ${
                    playing
                      ? "translate-y-0 opacity-0 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:opacity-100"
                      : "opacity-100"
                  }`}
                >
                  <span className="pl-0.5 text-sm tracking-tighter">
                    {playing ? "❚❚" : "▶"}
                  </span>
                </span>
              </button>
            </div>

            <figcaption className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-x border-b border-line px-2 py-4 font-mono text-[10px] uppercase tracking-[0.3em] text-dim sm:px-4">
              <span className="text-accent">{site.showreel.title}</span>
              <span>Edit · Grade · Sound · Color</span>
              <span>2023 — 2026</span>
              <a
                href="#contact"
                className="transition-colors hover:text-paper"
              >
                Request full reel →
              </a>
            </figcaption>
          </figure>
        </Reveal>
      </Container>
    </section>
  );
}