import { Onward } from "@/components/labs/Onward";
import { ScienceLab } from "@/components/labs/ScienceLab";
import { Shell } from "@/components/shell/Shell";
import { pageMetadata } from "@/content/site";
import { cx } from "@/lib/utils";
import s from "@/components/portfolio/portfolio.module.css";
import a from "@/components/labs/labs.module.css";

export const metadata = pageMetadata({
  title: "Computer science — Tam Kok Yan",
  path: "/cs/",
  description:
    "Two interactive pieces from a data science degree: a precision and recall threshold explorer, and a batch chunking planner for a million rows.",
});

export default function SciencePage() {
  return (
    <Shell current="/cs/">
      <div className={cx(s.shell, a.page)}>
        <header className={a.head}>
          <p className={s.rail}>§ Computer science</p>
          <div>
            <h1>Numbers, and what they cost</h1>
            <p>
              My degree was in data science. The part I use most is the habit of asking what a wrong answer costs
              before trusting a number. Both pieces below are live, so move the controls and watch the figures move
              with them.
            </p>
          </div>
        </header>

        <ScienceLab />
        <Onward current="/cs/" />
      </div>
    </Shell>
  );
}
