"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { puzzles, type Puzzle } from "@/content/puzzles";
import { cx } from "@/lib/utils";
import s from "@/components/portfolio/portfolio.module.css";
import a from "./labs.module.css";

const STORE = "tky-puzzles";

const normalise = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[(),]/g, "")
    .replace(/\s+/g, " ")
    .replace(/\.$/, "");

async function digest(value: string) {
  const bytes = new TextEncoder().encode(normalise(value));
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 32);
}

function Stage({
  stage,
  index,
  solved,
  onSolve,
}: {
  stage: Puzzle["stages"][number];
  index: number;
  solved: boolean;
  onSolve: () => void;
}) {
  const [value, setValue] = useState("");
  const [state, setState] = useState<"idle" | "wrong" | "checking">("idle");

  const check = async (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    setState("checking");
    try {
      const hash = await digest(value);
      if (stage.accept.includes(hash)) {
        onSolve();
        setState("idle");
      } else {
        setState("wrong");
      }
    } catch {
      setState("wrong");
    }
  };

  return (
    <div className={a.stage}>
      <p className={a.stageHead}>
        <span>Step {index + 1}</span>
        {solved && <span className={a.right}>solved</span>}
      </p>
      <p className={a.stageAsk}>{stage.ask}</p>

      {solved ? (
        <p className={a.right}>Correct.</p>
      ) : (
        <form className={a.answer} onSubmit={check}>
          <input
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setState("idle");
            }}
            placeholder={stage.placeholder}
            aria-label={`Answer for step ${index + 1}`}
            autoComplete="off"
            spellCheck={false}
          />
          <button type="submit" className={a.submit}>
            Check
          </button>
          {state === "wrong" && <span className={a.wrong}>Not that. Try the hint.</span>}
        </form>
      )}

      <details className={a.note}>
        <summary>Hint</summary>
        <p>{stage.hint}</p>
      </details>
    </div>
  );
}

function PuzzleCase({
  puzzle,
  solvedCount,
  onSolve,
}: {
  puzzle: Puzzle;
  solvedCount: number;
  onSolve: (id: string, count: number) => void;
}) {
  const done = solvedCount >= puzzle.stages.length;

  return (
    <section className={a.puzzle}>
      <div className={a.puzzleHead}>
        <p className={s.rail}>{puzzle.rail}</p>
        <h2>{puzzle.title}</h2>
        <p className={cx(a.state, done && a.stateSolved)}>
          {solvedCount} / {puzzle.stages.length}
        </p>
      </div>
      <p className={a.brief} style={{ paddingLeft: 0 }}>
        {puzzle.brief}
      </p>

      <div className={a.stages}>
        {puzzle.code && <pre className={a.snippet}>{puzzle.code}</pre>}

        {puzzle.stages.map((stage, i) => {
          if (i > solvedCount) {
            return (
              <div className={a.stage} key={stage.placeholder + i}>
                <p className={a.stageHead}>
                  <span>Step {i + 1}</span>
                  <span>locked</span>
                </p>
                <p className={a.locked}>Answer step {i} first.</p>
              </div>
            );
          }
          return (
            <Stage
              key={stage.placeholder + i}
              stage={stage}
              index={i}
              solved={i < solvedCount}
              onSolve={() => onSolve(puzzle.id, i + 1)}
            />
          );
        })}

        {done && (
          <div className={a.verdict}>
            <h3>Case closed</h3>
            <p>{puzzle.payoff}</p>
          </div>
        )}
      </div>
    </section>
  );
}

export function PuzzleLab() {
  const [progress, setProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORE);
      if (saved) setProgress(JSON.parse(saved));
    } catch {}
  }, []);

  const solve = useCallback((id: string, count: number) => {
    setProgress((current) => {
      if ((current[id] ?? 0) >= count) return current;
      const next = { ...current, [id]: count };
      try {
        localStorage.setItem(STORE, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setProgress({});
    try {
      localStorage.removeItem(STORE);
    } catch {}
  }, []);

  const solved = puzzles.reduce((sum, p) => sum + Math.min(progress[p.id] ?? 0, p.stages.length), 0);
  const total = puzzles.reduce((sum, p) => sum + p.stages.length, 0);

  return (
    <>
      <p className={a.readout}>
        <span>
          Steps solved <b>{solved}</b> of <b>{total}</b>
        </span>
        <span>Progress is kept in this browser only</span>
      </p>

      {puzzles.map((puzzle) => (
        <PuzzleCase
          key={puzzle.id}
          puzzle={puzzle}
          solvedCount={Math.min(progress[puzzle.id] ?? 0, puzzle.stages.length)}
          onSolve={solve}
        />
      ))}

      <button type="button" className={a.reset} onClick={reset}>
        Clear my progress
      </button>
    </>
  );
}
