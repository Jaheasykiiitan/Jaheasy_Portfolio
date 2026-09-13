const DEFAULT_SITE_URL = "https://jaheasy.example.com";

function withoutTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

/**
 * Normalize a candidate origin to a full, absolute `https://` URL.
 * Vercel sets NEXT_PUBLIC_VERCEL_URL WITHOUT the scheme (e.g.
 * "jaheasy.vercel.app"), so `new URL(url)` would throw ERR_INVALID_URL.
 * We re-attach "https://" whenever the scheme is missing before the value
 * can ever reach `new URL()`, canonical, sitemap or metadataBase.
 */
function normalizeOrigin(url: string | undefined, fallback: string): string {
  const value = (url || "").trim();
  if (!value) return fallback;
  const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  return withoutTrailingSlash(withScheme);
}

/**
 * Resolve the canonical site origin for SEO (canonical, sitemap, OG).
 * Priority: explicit NEXT_PUBLIC_SITE_URL → Vercel's auto-assigned URL
 * (NEXT_PUBLIC_VERCEL_URL, set by the platform) → placeholder. This way a
 * zero-config deploy still emits correct, non-broken absolute URLs even
 * without a custom domain yet.
 */
export const SITE_URL = normalizeOrigin(
  process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_VERCEL_URL,
  DEFAULT_SITE_URL
);

export function absUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}