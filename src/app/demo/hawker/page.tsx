import type { Metadata } from "next";
import { HawkerAdvanced } from "@/components/hawker/advanced/HawkerAdvanced";
import { hawker } from "@/content/hawker";

export const metadata: Metadata = {
  title: `${hawker.name} — Demo order page (Advanced)`,
  description: `Demo F&B page with a WhatsApp order builder, live opening status and GrabFood ordering, using ${hawker.name} as a sample.`,
  // A concept page for a real business: keep it out of search results.
  robots: { index: false, follow: false },
  alternates: { canonical: "/demo/hawker/" },
};

export default function HawkerAdvancedPage() {
  return <HawkerAdvanced />;
}
