import type { Metadata } from "next";
import { Redirect } from "@/components/Redirect";

export const metadata: Metadata = {
  title: "Tam Kok Yan — NetSuite Technical Consultant",
  robots: { index: false },
  alternates: { canonical: "/" },
};

export default function OldInteractivePage() {
  return <Redirect to="/" />;
}
