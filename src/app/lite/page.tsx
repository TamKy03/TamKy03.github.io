import { LiteSite } from "@/components/lite/LiteSite";
import { pageMetadata } from "@/content/site";

export const metadata = pageMetadata({
  title: "Tam Kok Yan — Resume",
  path: "/lite/",
});

export default function LitePage() {
  return <LiteSite />;
}
