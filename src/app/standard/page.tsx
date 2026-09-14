import { StandardSite } from "@/components/standard/StandardSite";
import { pageMetadata } from "@/content/site";

export const metadata = pageMetadata({
  title: "Tam Kok Yan — NetSuite Technical Consultant",
  path: "/standard/",
});

export default function StandardPage() {
  return <StandardSite />;
}
