import { NetSuiteLab } from "@/components/labs/NetSuiteLab";
import { Onward } from "@/components/labs/Onward";
import { Shell } from "@/components/shell/Shell";
import { pageMetadata } from "@/content/site";
import { cx } from "@/lib/utils";
import s from "@/components/portfolio/portfolio.module.css";
import a from "@/components/labs/labs.module.css";

export const metadata = pageMetadata({
  title: "NetSuite — Tam Kok Yan",
  path: "/netsuite/",
  description:
    "Two working tools for NetSuite decisions: a SuiteScript governance budget with Oracle's published unit costs, and a script type chooser.",
});

export default function NetSuitePage() {
  return (
    <Shell current="/netsuite/">
      <div className={cx(s.shell, a.page)}>
        <header className={a.head}>
          <p className={s.rail}>§ NetSuite</p>
          <div>
            <h1>What the platform charges you</h1>
            <p>
              Most of what I get handed comes down to a budget. A script asked for more units than it was given, or
              the work sat in the wrong kind of script from the start. Both tools below run on Oracle&rsquo;s
              published figures, so you can plan a script against them before writing it.
            </p>
          </div>
        </header>

        <NetSuiteLab />
        <Onward current="/netsuite/" />
      </div>
    </Shell>
  );
}
