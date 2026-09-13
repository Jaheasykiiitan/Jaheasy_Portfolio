import type { ReactNode } from "react";

/* Fixed full-screen film-grain texture that sits above all content. */
export function FilmGrain() {
  return (
    <div
      aria-hidden="true"
      className="grain-layer pointer-events-none fixed inset-[-20%] z-[400] opacity-[0.05] mix-blend-overlay"
    />
  );
}

export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[600] focus:border focus:border-paper/20 focus:bg-cine-black focus:px-4 focus:py-2 focus:font-mono focus:text-[11px] focus:uppercase focus:tracking-[0.3em] focus:text-paper"
    >
      Skip to content
    </a>
  );
}

export const withFade = (children: ReactNode) => children;