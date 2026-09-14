"use client";

import type { ElementType, ReactNode } from "react";
import { cx } from "@/lib/utils";
import { useInView } from "./hooks";

type RevealProps = {
  as?: ElementType;
  className?: string;
  classes: { reveal: string; visible: string };
  children?: ReactNode;
  [prop: string]: unknown;
};

// Fades its content in the first time it scrolls into view.
export function Reveal({ as: Tag = "div", className, classes, children, ...rest }: RevealProps) {
  const [ref, inView] = useInView<HTMLElement>();
  return (
    <Tag ref={ref} className={cx(className, classes.reveal, inView && classes.visible)} {...rest}>
      {children}
    </Tag>
  );
}
