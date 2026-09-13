"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import type { SiteEntry } from "@/lib/admin/types";
import type { NavLink, SocialLink } from "@/lib/types";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Navbar({
  site,
  navLinks,
  socials,
}: {
  site: SiteEntry;
  navLinks: NavLink[];
  socials: SocialLink[];
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest: number) => {
    setScrolled(latest > 28);
  });

  /* Lock page scroll while the menu is open. */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* Close on Escape. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <motion.header
        initial={reduce ? false : { y: "-100%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.25 }}
        className={`fixed inset-x-0 top-0 z-[350] transition-[background-color,border-color,backdrop-filter] duration-500 ${
          scrolled
            ? "border-b border-line-soft bg-cine-black/85 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-5 sm:h-20 sm:px-8 lg:px-12"
        >
          <a
            href="#top"
            className="group flex flex-col leading-none"
            aria-label="JAHEASY — back to top"
          >
            <span className="font-display text-lg font-light uppercase tracking-[0.28em] text-paper transition-opacity duration-300 group-hover:opacity-70 sm:text-xl">
              {site.name}
            </span>
            <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.4em] text-dim">
              Film · Motion
            </span>
          </a>

          <ul className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="group relative font-mono text-[11px] uppercase tracking-[0.28em] text-haze transition-colors duration-300 hover:text-paper"
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1.5 left-0 h-px w-0 bg-paper/70 transition-all duration-400 group-hover:w-full"
                  />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href={`mailto:${site.email}?subject=${encodeURIComponent(site.emailSubject)}`}
              className="group hidden items-center gap-3 border border-paper/25 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.28em] text-paper transition-colors duration-300 hover:bg-paper hover:text-cine-black md:inline-flex"
            >
              Contact
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-300 group-hover:translate-x-0.5"
              >
                →
              </span>
            </a>

            <button
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              className="relative flex h-11 w-11 items-center justify-center border border-paper/25 text-paper transition-colors hover:bg-paper/10 md:hidden"
            >
              <span className="relative block h-3 w-5" aria-hidden="true">
                <span
                  className={`absolute left-0 top-0 h-px w-5 bg-current transition-transform duration-300 ${
                    open ? "translate-y-[5.5px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-[11px] h-px w-5 bg-current transition-transform duration-300 ${
                    open ? "-translate-y-[5.5px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed inset-0 z-[360] flex flex-col bg-cine-black/97 backdrop-blur-2xl md:hidden"
          >
            <div className="flex h-16 items-center justify-between px-5">
              <span className="font-display text-lg font-light uppercase tracking-[0.28em] text-paper">
                {site.name}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-11 w-11 items-center justify-center border border-paper/25 text-paper"
              >
                <span aria-hidden="true" className="text-lg leading-none">
                  ✕
                </span>
              </button>
            </div>

            <nav
              aria-label="Mobile"
              className="flex flex-1 flex-col justify-center gap-1 px-6"
            >
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={reduce ? false : { opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.55,
                    delay: 0.08 + i * 0.06,
                    ease: EASE,
                  }}
                  className="group flex items-baseline gap-4 border-b border-line-soft py-4"
                >
                  <span className="font-mono text-[11px] text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-4xl font-light uppercase tracking-tight text-paper transition-colors group-hover:text-haze">
                    {link.label}
                  </span>
                </motion.a>
              ))}
            </nav>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: EASE }}
              className="space-y-6 px-6 pb-10"
            >
              <a
                href={`mailto:${site.email}?subject=${encodeURIComponent(site.emailSubject)}`}
                onClick={() => setOpen(false)}
                className="block font-mono text-xs text-haze underline decoration-line underline-offset-4"
              >
                {site.email}
              </a>
              <ul className="flex flex-wrap gap-x-5 gap-y-2">
                {socials.map((s) => (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setOpen(false)}
                      className="font-mono text-[11px] uppercase tracking-[0.2em] text-dim hover:text-paper"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}