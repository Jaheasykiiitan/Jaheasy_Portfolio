"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import type { SiteEntry } from "@/lib/admin/types";
import type { NavLink, SocialLink } from "@/lib/types";
import { FilmGrain, SkipLink } from "@/components/ambient";
import { Navbar } from "@/components/navbar";
import { ScrollProgress } from "@/components/scroll-progress";

export function SiteShell({
  children,
  site,
  navLinks,
  socials,
}: {
  children: ReactNode;
  site: SiteEntry;
  navLinks: NavLink[];
  socials: SocialLink[];
}) {
  return (
    <MotionConfig reducedMotion="user">
      <SkipLink />
      <FilmGrain />
      <ScrollProgress />
      <Navbar site={site} navLinks={navLinks} socials={socials} />
      <main id="main">{children}</main>
    </MotionConfig>
  );
}