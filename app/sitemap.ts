import type { MetadataRoute } from "next";
import { getProjectsContent, getSiteContent } from "@/lib/content";
import { SITE_URL, absUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const { site } = getSiteContent();
  const projects = getProjectsContent();

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      images: [site.showreel.poster, site.heroMedia.poster, site.aboutFrame.poster]
        .filter(Boolean)
        .map((img) => absUrl(img)),
      videos: [
        ...(site.showreel.video
          ? [
              {
                title: site.showreel.title || site.name,
                thumbnail_loc: absUrl(site.showreel.poster),
                description: site.showreel.title || site.tagline,
              },
            ]
          : []),
        ...projects
          .filter((p) => p.video && p.poster)
          .map((p) => ({
            title: p.title,
            thumbnail_loc: absUrl(p.poster),
            description: p.description || p.title,
          })),
      ],
    },
  ];
}
