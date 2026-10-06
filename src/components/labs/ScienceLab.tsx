"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { cx } from "@/lib/utils";
import s from "@/components/portfolio/portfolio.module.css";
import a from "./labs.module.css";

/* ------------------------------------------------------------------ *
 * A fixed sample, generated once from a fixed seed so the page shows
 * the same numbers to everyone.
 * ------------------------------------------------------------------ */

function seeded(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Each item is one invoice the model scored 0–100 for "this will fail approval".
const sample = (() => {
  const rand = seeded(20260115);
  const items: { score: number; fails: boolean }[] = [];
  for (let i = 0; i < 400; i++) {
    const fails = rand() < 0.18;
    // Two overlapping distributions: the model is useful, not perfect.
    const base = fails ? 62 : 32;
    const spread = (rand() + rand() + rand() - 1.5) * 26;
    items.push({ score: Math.max(0, Math.min(100, Math.round(base + spread))), fails });
  }
  return items;
})();

const bins = (() => {
  const counts = Array.from({ length: 20 }, () => ({ fails: 0, clean: 0 }));
  for (const item of sample) {
    const bin = counts[Math.min(19, Math.floor(item.score / 5))];
    if (item.fails) bin.fails++;
    else bin.clean++;
  }
  const tallest = Math.max(...counts.map((c) => c.fails + c.clean));
  return counts.map((c) => ({ ...c, height: Math.round(((c.fails + c.clean) / tallest) * 100) }));
})();

function score(threshold: number) {
  let tp = 0;
  let fp = 0;
  let fn = 0;
  let tn = 0;
  for (const item of sample) {
    const flagged = item.score >= threshold;
    if (flagged && item.fails) tp++;
    else if (flagged) fp++;
    else if (item.fails) fn++;
    else tn++;
  }
  const precision = tp + fp === 0 ? 0 : tp / (tp + fp);
  const recall = tp + fn === 0 ? 0 : tp / (tp + fn);
  const f1 = precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);
  return { tp, fp, fn, tn, precision, recall, f1 };
}

const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

function ThresholdExplorer() {
  const [threshold, setThreshold] = useState(50);
  const [missCost, setMissCost] = useState(45);
  const reviewCost = 2;

  const result = useMemo(() => score(threshold), [threshold]);
  const minutes = result.fp * reviewCost + result.fn * missCost;

  const best = useMemo(() => {
    let bestAt = 0;
    let bestCost = Infinity;
    for (let t = 0; t <= 100; t++) {
      const r = score(t);
      const cost = r.fp * reviewCost + r.fn * missCost;
      if (cost < bestCost) {
        bestCost = cost;
        bestAt = t;
      }
    }
    return { at: bestAt, cost: bestCost };
  }, [missCost]);

  return (
    <section className={a.app}>
      <p className={s.rail}>App 01 / Thresholds</p>
      <div>
        <h2>Where do you draw the line?</h2>
        <p>
          A model scores 400 invoices from 0 to 100 for &ldquo;this one will fail approval&rdquo;. Flagging everything
          wastes people&rsquo;s time. Flagging nothing lets the bad ones post. Accuracy will not tell you where to
          stand, because the two mistakes do not cost the same.
        </p>

        <div className={a.histogram} aria-hidden="true">
          {bins.map((bin, i) => (
            <span
              key={i}
              className={cx(a.bin, i * 5 + 5 > threshold && a.binFlagged)}
              style={{ "--h": bin.height, "--fail": Math.round((bin.fails / Math.max(1, bin.fails + bin.clean)) * 100) } as CSSProperties}
            />
          ))}
        </div>
        <p className={a.axis} aria-hidden="true">
          <span>0</span>
          <span>model score</span>
          <span>100</span>
        </p>

        <div className={a.controls}>
          <div className={a.row}>
            <span className={a.label}>Flag at or above</span>
            <input
              type="range"
              min={0}
              max={100}
              value={threshold}
              className={a.slider}
              onChange={(e) => setThreshold(Number(e.target.value))}
              aria-label="Score threshold"
            />
            <span className={a.count}>{threshold}</span>
          </div>
          <div className={a.row}>
            <span className={a.label}>A miss costs</span>
            <input
              type="range"
              min={5}
              max={120}
              step={5}
              value={missCost}
              className={a.slider}
              onChange={(e) => setMissCost(Number(e.target.value))}
              aria-label="Minutes lost to one missed failure"
            />
            <span className={a.count}>{missCost}m</span>
          </div>
        </div>

        <div className={a.table}>
          <div className={cx(a.tableRow, a.tableHead)}>
            <span>Outcome</span>
            <span>Count</span>
            <span>Minutes</span>
          </div>
          <div className={a.tableRow}>
            <span>Caught a real failure</span>
            <span>{result.tp}</span>
            <span>0</span>
          </div>
          <div className={a.tableRow}>
            <span>Flagged a clean invoice</span>
            <span>{result.fp}</span>
            <span>{result.fp * reviewCost}</span>
          </div>
          <div className={a.tableRow}>
            <span>Missed a failure</span>
            <span>{result.fn}</span>
            <span>{result.fn * missCost}</span>
          </div>
          <div className={a.tableRow}>
            <span>Left a clean invoice alone</span>
            <span>{result.tn}</span>
            <span>0</span>
          </div>
        </div>

        <p className={a.readout} style={{ marginTop: "18px" }}>
          <span>
            Precision <b>{pct(result.precision)}</b>
          </span>
          <span>
            Recall <b>{pct(result.recall)}</b>
          </span>
          <span>
            F1 <b>{result.f1.toFixed(2)}</b>
          </span>
          <span className={minutes <= best.cost * 1.1 ? a.under : a.over}>
            Cost <b>{minutes.toLocaleString()} minutes</b>
          </span>
        </p>

        <div className={a.verdict} key={best.at === threshold ? "at" : "off"}>
          <h3>
            {best.at === threshold ? "That is the cheapest line" : `The cheapest line is ${best.at}`}
          </h3>
          <p>
            At {missCost} minutes a miss, flagging from {best.at} up costs {best.cost.toLocaleString()} minutes of
            work. Raise what a miss costs and the line moves down: the model has not changed, only what you lose by
            being wrong in each direction. This is the argument I make before quoting a model&rsquo;s accuracy.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Chunking a million rows into a nine-hour window
 * ------------------------------------------------------------------ */

const TOTAL = 1_000_000;
const WINDOW_MINUTES = 9 * 60; // 17:00 to 02:00

function ChunkPlanner() {
  const [chunk, setChunk] = useState(5000);
  const [processors, setProcessors] = useState(4);
  const [rowsPerSecond, setRowsPerSecond] = useState(90);

  const jobs = Math.ceil(TOTAL / chunk);
  const secondsPerJob = chunk / rowsPerSecond + 6; // six seconds of setup per key
  const minutes = Math.round((jobs * secondsPerJob) / processors / 60);
  const fits = minutes <= WINDOW_MINUTES;
  const used = Math.min(100, Math.round((minutes / WINDOW_MINUTES) * 100));
  const finish = (() => {
    const end = new Date(2026, 0, 1, 17, 0);
    end.setMinutes(end.getMinutes() + minutes);
    return `${String(end.getHours()).padStart(2, "0")}:${String(end.getMinutes()).padStart(2, "0")}`;
  })();

  return (
    <section className={a.app}>
      <p className={s.rail}>App 02 / Batch</p>
      <div>
        <h2>A million rows, nine hours</h2>
        <p>
          The export window opens at 17:00 and closes at 02:00. A Map/Reduce script splits the work by key, and each
          key is metered on its own. The size of a chunk decides how many jobs you queue, and how much setup you pay
          for.
        </p>

        <div className={a.controls}>
          <div className={a.row}>
            <span className={a.label}>Rows per key</span>
            <input
              type="range"
              min={500}
              max={50000}
              step={500}
              value={chunk}
              className={a.slider}
              onChange={(e) => setChunk(Number(e.target.value))}
              aria-label="Rows per key"
            />
            <span className={a.count}>{chunk.toLocaleString()}</span>
          </div>
          <div className={a.row}>
            <span className={a.label}>Processors</span>
            <input
              type="range"
              min={1}
              max={8}
              value={processors}
              className={a.slider}
              onChange={(e) => setProcessors(Number(e.target.value))}
              aria-label="Concurrent processors"
            />
            <span className={a.count}>{processors}</span>
          </div>
          <div className={a.row}>
            <span className={a.label}>Rows a second</span>
            <input
              type="range"
              min={20}
              max={300}
              step={10}
              value={rowsPerSecond}
              className={a.slider}
              onChange={(e) => setRowsPerSecond(Number(e.target.value))}
              aria-label="Rows processed per second"
            />
            <span className={a.count}>{rowsPerSecond}</span>
          </div>
        </div>

        <p className={a.readout}>
          <span>
            Jobs queued <b>{jobs.toLocaleString()}</b>
          </span>
          <span>
            Run time <b>{Math.floor(minutes / 60)}h {minutes % 60}m</b>
          </span>
          <span>
            Finishes <b>{finish}</b>
          </span>
          <span className={fits ? a.under : a.over}>{fits ? "Inside the window" : "Past 02:00"}</span>
        </p>

        <div className={cx(a.meter, !fits && a.meterOver)}>
          <span className={a.meterFill} style={{ "--pct": used } as CSSProperties} />
        </div>
        <p className={a.meterNote}>
          {fits
            ? `${WINDOW_MINUTES - minutes} minutes spare before the window closes.`
            : `${minutes - WINDOW_MINUTES} minutes past the close. Fewer, larger keys cut the setup cost; more processors cut the clock.`}
        </p>

        <details className={a.note}>
          <summary>Why small chunks get slower</summary>
          <p>
            Every key pays a fixed setup cost before it does any work. Halve the chunk size and you double the
            number of jobs, so you pay that cost twice as often. Push the chunk too high and one invocation starts
            running into its own governance limit. The useful size sits between the two, and one real run tells you
            where.
          </p>
        </details>
      </div>
    </section>
  );
}

export function ScienceLab() {
  return (
    <>
      <ThresholdExplorer />
      <ChunkPlanner />
    </>
  );
}
