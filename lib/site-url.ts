const DEFAULT_SITE_URL = "https://jaheasy.example.com";

function withoutTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

/**
 * Resolve the canonical site origin for SEO (canonical, sitemap, OG).
 * Priority: explicit NEXT_PUBLIC_SITE_URL → Vercel's auto-assigned URL
 * (NEXT_PUBLIC_VERCEL_URL, set by the platform) → placeholder. This way a
 * zero-config deploy still emits correct, non-broken absolute URLs even
 * without a custom domain yet.
 */
export const SITE_URL = withoutTrailingSlash(
  process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_VERCEL_URL ??
    DEFAULT_SITE_URL
);

export function absUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}