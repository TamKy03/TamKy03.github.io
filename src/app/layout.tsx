import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { siteUrl } from "@/content/site";
import { jetbrainsMono, poppins } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Tints the browser chrome to match the page background
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f6" },
    { media: "(prefers-color-scheme: dark)", color: "#121418" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
