import type { Metadata } from "next";
import { Redirect } from "@/components/Redirect";

export const metadata: Metadata = {
  title: "Tam Kok Yan — Resume",
  robots: { index: false },
  alternates: { canonical: "/lite/" },
};

export default function OldLitePage() {
  return <Redirect to="/lite/" />;
}
