import type { Metadata } from "next";
import { HawkerPage } from "@/components/hawker/HawkerPage";
import { hawker } from "@/content/hawker";

export const metadata: Metadata = {
  title: `${hawker.name} — Demo order page (Intermediate)`,
  description: `Demo F&B page with one-tap GrabFood and WhatsApp ordering, using ${hawker.name} as a sample.`,
  robots: { index: false, follow: false },
  alternates: { canonical: "/demo/hawker/intermediate/" },
};

export default function HawkerIntermediatePage() {
  return <HawkerPage />;
}
