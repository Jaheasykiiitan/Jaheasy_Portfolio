import type { MetadataRoute } from "next";
import { getProjectsContent, getSiteContent } from "@/lib/content";
import { SITE_URL, absUrl } from "@/lib/site-url";

function absoluteUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;
  return absUrl(value);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const { site } = getSiteContent();
  const projects = getProjectsContent();

  const posters = [site.showreel.poster, site.heroMedia.poster]
    .map(absoluteUrl)
    .filter((v): v is string => Boolean(v));

  const videos: MetadataRoute.Sitemap[number]["videos"] = [
    ...(absoluteUrl(site.showreel.poster)
      ? [
          {
            title: site.showreel.title || site.name,
            thumbnail_loc: absoluteUrl(site.showreel.poster) as string,
            description: site.showreel.title || site.tagline,
          },
        ]
      : []),
    ...projects
      .filter((p) => p.video && p.poster)
      .map((p) => ({
        title: p.title || p.slug,
        thumbnail_loc: absoluteUrl(p.poster) as string,
        description: p.description || p.title,
      })),
  ];

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      images: posters,
      videos,
    },
  ];
}