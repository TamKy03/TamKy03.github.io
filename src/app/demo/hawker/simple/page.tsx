import type { Metadata } from "next";
import { HawkerSimple } from "@/components/hawker/HawkerSimple";
import { hawker } from "@/content/hawker";

export const metadata: Metadata = {
  title: `${hawker.name} — Demo order page (Simple)`,
  description: `Demo "link in bio" page with GrabFood, WhatsApp and directions buttons, using ${hawker.name} as a sample.`,
  robots: { index: false, follow: false },
  alternates: { canonical: "/demo/hawker/simple/" },
};

export default function HawkerSimplePage() {
  return <HawkerSimple />;
}
