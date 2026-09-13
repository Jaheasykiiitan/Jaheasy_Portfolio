import type { SiteContent, ProjectsContent } from "@/lib/admin/types";
import { getBackend } from "@/lib/admin/backend";

export const SITE_PATH = "content/site.json";
export const PROJECTS_PATH = "content/projects.json";

export async function loadSiteContent(): Promise<SiteContent> {
  const raw = await getBackend().readFile(SITE_PATH);
  if (!raw) throw new Error("content/site.json not found");
  return JSON.parse(raw) as SiteContent;
}

export async function saveSiteContent(site: SiteContent): Promise<void> {
  const json = JSON.stringify(site, null, 2) + "\n";
  await getBackend().writeFile(SITE_PATH, json, "update: site content");
}

export async function loadProjectsContent(): Promise<ProjectsContent> {
  const raw = await getBackend().readFile(PROJECTS_PATH);
  if (!raw) return [];
  return JSON.parse(raw) as ProjectsContent;
}

export async function saveProjectsContent(projects: ProjectsContent): Promise<void> {
  const json = JSON.stringify(projects, null, 2) + "\n";
  await getBackend().writeFile(PROJECTS_PATH, json, "update: projects");
}