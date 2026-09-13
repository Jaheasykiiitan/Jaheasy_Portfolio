import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { ProjectsContent, SiteContent } from "@/lib/admin/types";

/**
 * Fresh reads of the content files from disk.
 *
 * Called from server components on every render, so edits saved in /admin (or
 * made by hand) appear on the public site with just a refresh — no rebuild
 * needed. For this to stay true in production the root layout opts into
 * `dynamic = "force-dynamic"`. Never import this module from a client
 * component.
 */

export function getSiteContent(): SiteContent {
  return JSON.parse(
    readFileSync(join(process.cwd(), "content", "site.json"), "utf8")
  ) as SiteContent;
}

export function getProjectsContent(): ProjectsContent {
  return JSON.parse(
    readFileSync(join(process.cwd(), "content", "projects.json"), "utf8")
  ) as ProjectsContent;
}