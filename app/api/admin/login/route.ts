import { NextResponse } from "next/server";
import {
  authConfigured,
  verifyPassword,
  createSessionToken,
  sessionCookieOptions,
  AUTH_COOKIE,
} from "@/lib/admin/auth";

export async function POST(request: Request) {
  if (!authConfigured()) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD env var is not set — add it to your .env and restart the server." },
      { status: 503 },
    );
  }
  const { password } = (await request.json()) as { password?: string };
  if (!password || !verifyPassword(password)) {
    return NextResponse.json({ error: "wrong password" }, { status: 401 });
  }
  const token = createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE, token, sessionCookieOptions());
  return res;
}