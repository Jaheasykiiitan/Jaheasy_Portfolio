import { NextResponse } from "next/server";
import { checkAuth } from "@/lib/admin/auth";
import { saveSiteContent } from "@/lib/admin/content";
import type { SiteContent } from "@/lib/admin/types";

const SITE_TOP_KEYS = [
  "site",
  "navLinks",
  "heroBackdrop",
  "marqueeItems",
  "aboutText",
  "stats",
  "services",
  "skills",
  "experience",
  "process",
  "socials",
];

function looksLikeSiteContent(v: unknown): v is SiteContent {
  if (!v || typeof v !== "object" || Array.isArray(v)) return false;
  const o = v as Record<string, unknown>;
  return (
    SITE_TOP_KEYS.every((k) => k in o) &&
    typeof o["site"] === "object" &&
    Array.isArray(o["stats"]) &&
    Array.isArray(o["services"]) &&
    Array.isArray(o["socials"])
  );
}

export async function POST(request: Request) {
  const denied = await checkAuth();
  if (denied) return denied;
  const { site } = (await request.json()) as { site: SiteContent };
  if (!looksLikeSiteContent(site)) {
    return NextResponse.json({ error: "invalid site payload shape" }, { status: 400 });
  }
  await saveSiteContent(site);
  return NextResponse.json({ ok: true });
}