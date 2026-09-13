import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import { getSiteContent } from "@/lib/content";
import { SiteShell } from "@/components/site-shell";
import { SITE_URL, absUrl } from "@/lib/site-url";
import "./globals.css";

export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

export async function generateMetadata(): Promise<Metadata> {
  const { site } = getSiteContent();
  const title = `${site.name} — ${site.roles.join(" · ")}`;
  const description = site.tagline;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s — ${site.name}` },
    description,
    alternates: { canonical: "/" },
    keywords: [
      "filmmaker",
      "cinematographer",
      "video editor",
      "color grading",
      "sound design",
      "AI video",
      "YouTube editor",
    ],
    openGraph: {
      type: "website",
      siteName: site.name,
      title,
      description,
      images: [
        {
          url: absUrl(site.heroMedia.poster),
          alt: `${site.name} — portfolio`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absUrl(site.heroMedia.poster)],
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#070707",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { site, navLinks, socials } = getSiteContent();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} scroll-smooth`}
    >
      <body className="min-h-svh bg-cine-black font-sans text-paper antialiased">
        <SiteShell site={site} navLinks={navLinks} socials={socials}>
          {children}
        </SiteShell>
      </body>
    </html>
  );
}