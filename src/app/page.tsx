import { InteractiveSite } from "@/components/interactive/InteractiveSite";
import { pageMetadata } from "@/content/site";

export const metadata = pageMetadata({
  title: "Tam Kok Yan — NetSuite Technical Consultant",
  path: "/",
});

export default function HomePage() {
  return <InteractiveSite />;
}
