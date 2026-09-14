"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import s from "./interactive.module.css";

export type Command = { label: string; hint: string; run: () => void };

export function CommandPalette({
  open,
  onClose,
  commands,
}: {
  open: boolean;
  onClose: () => void;
  commands: Command[];
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return commands.filter((command) => command.label.toLowerCase().includes(q));
  }, [commands, query]);

  // Reset and focus on open; hand focus back to where it was on close.
  useEffect(() => {
    if (!open) return;
    const lastFocus = document.activeElement as HTMLElement | null;
    setQuery("");
    setSelected(0);
    requestAnimationFrame(() => inputRef.current?.focus());
    return () => lastFocus?.focus?.();
  }, [open]);

  useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
  }, [selected, filtered]);

  if (!open) return null;

  const run = (index: number) => {
    const command = filtered[index];
    if (!command) return;
    onClose();
    command.run();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const count = Math.max(filtered.length, 1);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((i) => (i + 1) % count);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((i) => (i - 1 + count) % count);
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(selected);
    }
  };

  return (
    <div
      className={s.palette}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={s.paletteBox} role="dialog" aria-modal="true" aria-label="Command palette">
        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder="Type a command…"
          autoComplete="off"
          aria-controls="palette-list"
          onChange={(e) => {
            setQuery(e.target.value);
            setSelected(0);
          }}
          onKeyDown={onKeyDown}
        />
        <ul ref={listRef} id="palette-list" role="listbox">
          {filtered.length ? (
            filtered.map((command, i) => (
              <li
                key={command.label}
                role="option"
                aria-selected={i === selected}
                onClick={() => run(i)}
                onMouseMove={() => setSelected(i)}
              >
                <span>{command.label}</span>
                <span>{command.hint}</span>
              </li>
            ))
          ) : (
            <li className={s.empty}>No matching commands</li>
          )}
        </ul>
      </div>
    </div>
  );
}
