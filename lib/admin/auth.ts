import {
  createHmac,
  timingSafeEqual,
} from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "jaheasy_admin";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function getSecret(): string | null {
  return process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length > 0
    ? process.env.ADMIN_PASSWORD
    : null;
}

function hmac(input: string, secret: string): string {
  return createHmac("sha256", secret).update(input).digest("hex");
}

export function createSessionToken(): string {
  const secret = getSecret();
  if (!secret) return "";
  const issuedAt = Date.now().toString();
  const body = `v1.${issuedAt}`;
  return `${body}.${hmac(body, secret)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const secret = getSecret();
  if (!secret) return false;
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "v1") return false;
  const [, issuedAtRaw, supplied] = parts;
  const issuedAt = Number(issuedAtRaw);
  if (!Number.isFinite(issuedAt)) return false;
  if (Date.now() - issuedAt > SESSION_TTL_MS) return false;
  const body = `v1.${issuedAtRaw}`;
  const expected = hmac(body, secret);
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(supplied, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function verifyPassword(input: string): boolean {
  const secret = getSecret();
  if (!secret) return false;
  const a = Buffer.from(input, "utf8");
  const b = Buffer.from(secret, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function authConfigured(): boolean {
  return getSecret() !== null;
}

export async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(COOKIE_NAME)?.value);
}

export async function checkAuth(): Promise<Response | null> {
  if (!(await isAuthed())) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  return null;
}

export const AUTH_COOKIE = COOKIE_NAME;
export function sessionCookieOptions(): Record<string, string | number | boolean> {
  const maxAge = 30 * 24 * 60 * 60;
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}