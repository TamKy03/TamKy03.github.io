import { Onward } from "@/components/labs/Onward";
import { PuzzleLab } from "@/components/labs/PuzzleLab";
import { Shell } from "@/components/shell/Shell";
import { pageMetadata } from "@/content/site";
import { cx } from "@/lib/utils";
import s from "@/components/portfolio/portfolio.module.css";
import a from "@/components/labs/labs.module.css";

export const metadata = pageMetadata({
  title: "Puzzles — Tam Kok Yan",
  path: "/lab/",
  description:
    "Three multi-step SuiteScript cases: governance arithmetic, a deployment that never fires, and a Map/Reduce job with 1,200 keys.",
});

export default function LabPage() {
  return (
    <Shell current="/lab/">
      <div className={cx(s.shell, a.page)}>
        <header className={a.head}>
          <p className={s.rail}>§ Puzzles</p>
          <div>
            <h1>Three cases</h1>
            <p>
              Each one is a problem I have actually had to work through, cut down to the steps that matter. They are
              answered in order, and a step stays locked until the one before it is right. Checking is done against a
              hash, so opening the source will not hand you the answers.
            </p>
          </div>
        </header>

        <PuzzleLab />
        <Onward current="/lab/" />
      </div>
    </Shell>
  );
}
