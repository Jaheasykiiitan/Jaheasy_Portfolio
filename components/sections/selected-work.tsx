"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CinematicVideo } from "@/components/cinematic-video";
import { Container, Eyebrow, SectionTitle } from "@/components/containers";
import { MaskLine, Reveal } from "@/components/reveal";
import {
  projectCategories,
  type Project,
  type ProjectCategory,
} from "@/lib/types";
import type { SiteEntry } from "@/lib/admin/types";

type Filter = "All" | ProjectCategory;

const FILTERS: Filter[] = ["All", ...projectCategories];

const CARD_SIZE = "lg:col-span-4";

function externalHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "open";
  }
}

function ProjectCard({ project, reduced }: { project: Project; reduced: boolean }) {
  const [resolution, setResolution] = useState<{ w: number; h: number } | null>(null);
  const portrait = resolution ? resolution.h > resolution.w : false;

  return (
    <motion.article
      layout={reduced ? false : true}
      initial={reduced ? false : { opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduced ? undefined : { opacity: 0, scale: 0.985 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`group flex flex-col ${portrait ? "sm:col-span-1 lg:col-span-2" : CARD_SIZE}`}
    >
      <div
        className="relative aspect-video w-full overflow-hidden border border-line bg-cine-black"
        style={resolution ? { aspectRatio: `${resolution.w} / ${resolution.h}` } : undefined}
      >
        <CinematicVideo
          src={project.video ?? ""}
          poster={project.poster}
          playOnHover={Boolean(project.video)}
          onResolution={(w, h) => setResolution({ w, h })}
          alt={`${project.title} — ${project.category.toLowerCase()} still`}
          className="absolute inset-0 transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
        />
        <div className="vignette pointer-events-none absolute inset-0" aria-hidden="true" />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-cine-black/80 via-transparent to-transparent opacity-70 transition-opacity duration-700 group-hover:opacity-95"
          aria-hidden="true"
        />

        {/* top meta */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4 font-mono text-[10px] uppercase tracking-[0.28em] text-paper/90 sm:p-5">
          <span>{project.category}</span>
          <span className="text-haze">{project.year}</span>
        </div>

        {/* play chip */}
        {project.video ? (
          <span className="pointer-events-none absolute right-4 top-11 z-10 flex translate-y-14 items-center gap-2 border border-paper/30 bg-cine-black/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-paper opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:right-5"
          >
            <span aria-hidden="true" className="text-[8px]">▶</span>
            Preview
          </span>
        ) : null}
      </div>

      {/* Meta */}
      <div className="relative flex flex-col gap-2 pt-6">
        <h3 className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          {project.externalUrl ? (
            <a
              href={project.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} — open in new tab`}
              className="font-display text-3xl font-light leading-tight text-paper transition-colors duration-300 hover:text-accent sm:text-4xl"
            >
              {project.title}
            </a>
          ) : (
            <span className="font-display text-3xl font-light leading-tight text-paper sm:text-4xl">
              {project.title}
            </span>
          )}
        </h3>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-dim">
          My role — {project.role}
        </p>
        {project.externalUrl ? (
          <a
            href={project.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.title} — open ${externalHost(project.externalUrl)}`}
            className="mt-1 inline-flex w-fit items-center gap-2 border border-line px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-haze transition-colors duration-300 hover:border-paper hover:text-paper"
          >
            <span aria-hidden="true" className="text-[10px]">↗</span>
            {externalHost(project.externalUrl)}
          </a>
        ) : null}
        <p className="mt-1 max-w-md text-sm leading-relaxed text-haze">
          {project.description}
        </p>
      </div>
    </motion.article>
  );
}

export function SelectedWork({
  site,
  projects,
}: {
  site: SiteEntry;
  projects: Project[];
}) {
  const [filter, setFilter] = useState<Filter>("All");
  const reduce = useReducedMotion();
  const visible =
    filter === "All"
      ? projectCategories
          .map((cat) => projects.find((p) => p.category === cat))
          .filter((p): p is Project => Boolean(p))
      : projects.filter((p) => p.category === filter);

  return (
    <section id="work" className="relative scroll-mt-24 py-24 sm:py-28 lg:py-36">
      <Container>
        <div className="mb-6 lg:mb-8">
          <div>
            <Reveal>
              <Eyebrow index="02">Selected Work</Eyebrow>
            </Reveal>
            <Reveal delay={0.15} className="mt-2">
              <p className="max-w-sm text-sm leading-relaxed text-haze">
                A few frames from recent films, channels and campaigns. Hover the
                stills to watch them move.
              </p>
            </Reveal>
            <SectionTitle className="mt-6 text-5xl sm:text-6xl lg:text-8xl">
              <MaskLine>Selected</MaskLine>
              <MaskLine delay={0.08} className="italic">
                Work — 2024 / 26
              </MaskLine>
            </SectionTitle>
          </div>
        </div>

        {/* Category filter */}
        <Reveal>
          <div
            role="group"
            aria-label="Filter projects by category"
            className="mb-7 flex flex-wrap gap-2 border-b border-line-soft pb-6 sm:gap-3"
          >
            {FILTERS.map((f) => {
              const active = filter === f;
              return (
                <button
                  key={f}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(f)}
                  className={`border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.26em] transition-colors duration-300 ${
                    active
                      ? "border-paper bg-paper text-cine-black"
                      : "border-line text-haze hover:border-paper/50 hover:text-paper"
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Asymmetric grid */}
        <motion.div
          layout={reduce ? false : true}
          className="grid grid-cols-1 gap-x-8 gap-y-20 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-14 lg:gap-y-32"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((project) => (
              <ProjectCard
                key={`${project.slug || project.title}-${project.category}`}
                project={project}
                reduced={Boolean(reduce)}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="mt-20 flex justify-center lg:mt-28">
          <a
            href="#contact"
            className="group inline-flex items-center gap-3 border border-paper/30 px-8 py-4 font-mono text-[11px] uppercase tracking-[0.3em] text-paper transition-colors duration-300 hover:bg-paper hover:text-cine-black"
          >
            {site.name} — Full catalog on request
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>
      </Container>
    </section>
  );
}