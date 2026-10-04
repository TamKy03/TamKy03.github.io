import type { Metadata } from "next";
import { Redirect } from "@/components/Redirect";

export const metadata: Metadata = {
  title: "Tam Kok Yan",
  robots: { index: false },
  alternates: { canonical: "/" },
};

export default function RedirectPage() {
  return <Redirect to="/" />;
}
