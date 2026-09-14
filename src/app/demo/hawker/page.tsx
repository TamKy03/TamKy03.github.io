import type { Metadata } from "next";
import { HawkerPage } from "@/components/hawker/HawkerPage";
import { hawker } from "@/content/hawker";

export const metadata: Metadata = {
  title: `${hawker.name} — Demo order page`,
  description: `Demo F&B page with one-tap GrabFood and WhatsApp ordering, using ${hawker.name} as a sample.`,
  // A concept page for a real business: keep it out of search results.
  robots: { index: false, follow: false },
  alternates: { canonical: "/demo/hawker/" },
};

export default function HawkerDemoPage() {
  return <HawkerPage />;
}
