import { NextResponse } from "next/server";
import { checkAuth } from "@/lib/admin/auth";
import { loadSiteContent, loadProjectsContent } from "@/lib/admin/content";
import { getBackend } from "@/lib/admin/backend";

export async function GET() {
  const denied = await checkAuth();
  if (denied) return denied;
  const backend = getBackend();
  const site = await loadSiteContent();
  const projects = await loadProjectsContent();
  return NextResponse.json({ site, projects, backend: backend.info });
}