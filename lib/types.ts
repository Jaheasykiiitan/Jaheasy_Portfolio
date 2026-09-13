export type ProjectCategory =
  | "Films"
  | "Cinematography"
  | "YouTube"
  | "Commercials"
  | "Social Content"
  | "AI Videos"
  | "Music Video";

export interface Project {
  /** Unique slug — also used as the project id and image alt key. */
  slug: string;
  /** Project title shown on the card. */
  title: string;
  /** One of the six portfolio categories. */
  category: ProjectCategory;
  /** Release / production year, rendered as editorial small type. */
  year: string;
  /** Your role on the project. */
  role: string;
  /** One-or-two sentence description. */
  description: string;
  /**
   * Optional direct source video URL (MP4). When present the card plays it
   * on hover / tap. Leave empty to keep a still frame.
   */
  video?: string;
  /** Poster / thumbnail image URL. Also used while the video loads. */
  poster: string;
  /** Optional external link (YouTube, Vimeo, Loom…) per project. */
  externalUrl?: string;
  /**
   * Editorial layout variant that drives the asymmetric grid.
   *   "wide"       → col-span-8, 16/10
   *   "tall"       → col-span-4, 3/4
   *   "standard"   → col-span-6, 4/3
   *   "portrait"   → col-span-5, 4/5
   *   "cinematic"  → col-span-7, 16/10
   */
  layout?: "wide" | "tall" | "standard" | "portrait" | "cinematic";
}

export interface ProcessStep {
  index: string;
  title: string;
  description: string;
}

export interface Service {
  index: string;
  title: string;
  description: string;
}

export interface Skill {
  name: string;
  note: string;
}

export interface ExperienceRow {
  title: string;
  summary: string;
}

export interface SocialLink {
  label: string;
  handle: string;
  url: string;
}

export const projectCategories = [
  "Films",
  "Cinematography",
  "YouTube",
  "Commercials",
  "Social Content",
  "AI Videos",
  "Music Video",
] as const;

export interface NavLink {
  label: string;
  href: string;
}