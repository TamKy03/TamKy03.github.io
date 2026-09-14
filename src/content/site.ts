import type { Metadata } from "next";

export const siteUrl = "https://tamky03.github.io";

export const siteDescription =
  "Tam Kok Yan — NetSuite Technical Consultant at BlackOak Consulting, building customisation, automation and integration solutions. Data Science graduate of TARUMT.";

const shareDescription =
  "NetSuite Technical Consultant @ BlackOak Consulting — customisation, automation and integrations. Data Science graduate of TARUMT.";

// Page metadata with absolute Open Graph tags so shared links show the preview card.
export function pageMetadata({
  title,
  path,
  description,
}: {
  title: string;
  path: string;
  description?: string;
}): Metadata {
  return {
    title,
    description: description ?? siteDescription,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: "Tam Kok Yan",
      url: path,
      title,
      description: description ?? shareDescription,
      images: [
        {
          url: "/assets/og-image.png?v=2",
          width: 1200,
          height: 630,
          alt: "Tam Kok Yan — NetSuite Technical Consultant at BlackOak Consulting",
        },
      ],
    },
    twitter: { card: "summary_large_image" },
  };
}
