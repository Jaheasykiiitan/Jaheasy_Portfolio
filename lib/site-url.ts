const DEFAULT_SITE_URL = "https://jaheasy.example.com";

function withoutTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

export const SITE_URL = withoutTrailingSlash(
  process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL
);

export function absUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}