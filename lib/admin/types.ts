import type {
  ExperienceRow,
  NavLink,
  ProcessStep,
  Project,
  Service,
  Skill,
  SocialLink,
} from "@/lib/types";

export interface MediaPair {
  video: string;
  poster: string;
}

export interface SiteEntry {
  name: string;
  roles: string[];
  tagline: string;
  quote: string;
  email: string;
  emailSubject: string;
  availability: string;
  address: string;
  showreel: MediaPair & { title: string; runtime: string };
  heroMedia: MediaPair;
  aboutFrame: { poster: string; caption: string };
}

export interface SiteContent {
  site: SiteEntry;
  navLinks: NavLink[];
  heroBackdrop: { eyebrow: string; subline: string };
  marqueeItems: string[];
  aboutText: string[];
  stats: { value: string; label: string }[];
  services: Service[];
  skills: Skill[];
  experience: ExperienceRow[];
  process: ProcessStep[];
  socials: SocialLink[];
}

export type ProjectsContent = Project[];

export interface BackendInfo {
  name: "local" | "github";
  label: string;
  hint?: string;
}

export const MEDIA_VIDEO_EXTS = ["mp4", "webm", "mov", "m4v"];
export const MEDIA_IMAGE_EXTS = ["jpg", "jpeg", "png", "webp", "gif"];

export const CATEGORIES = [
  "Films",
  "Cinematography",
  "YouTube",
  "Commercials",
  "Social Content",
  "AI Videos",
  "Music Video",
] as const;

export const LAYOUTS = ["wide", "tall", "standard", "portrait", "cinematic"] as const;