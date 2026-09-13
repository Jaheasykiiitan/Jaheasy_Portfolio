import { NextResponse } from "next/server";
import { checkAuth } from "@/lib/admin/auth";
import { saveProjectsContent } from "@/lib/admin/content";
import type { ProjectsContent } from "@/lib/admin/types";

function looksLikeProjects(v: unknown): v is ProjectsContent {
  if (!Array.isArray(v)) return false;
  return v.every((p) => {
    if (!p || typeof p !== "object") return false;
    const o = p as Record<string, unknown>;
    return typeof o["slug"] === "string" && typeof o["title"] === "string";
  });
}

export async function POST(request: Request) {
  const denied = await checkAuth();
  if (denied) return denied;
  const { projects } = (await request.json()) as { projects: ProjectsContent };
  if (!looksLikeProjects(projects)) {
    return NextResponse.json({ error: "invalid projects payload shape" }, { status: 400 });
  }
  await saveProjectsContent(projects);
  return NextResponse.json({ ok: true });
}