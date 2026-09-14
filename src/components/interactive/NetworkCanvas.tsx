"use client";

import { useEffect, useRef, type RefObject } from "react";

type Dot = { x: number; y: number; vx: number; vy: number; r: number };

// Animated "data network" background for the hero. Pauses when off-screen or the tab is hidden,
// and draws a single static frame for visitors who prefer reduced motion.
export function NetworkCanvas({
  className,
  themeRoot,
  reduced,
}: {
  className: string;
  themeRoot: RefObject<HTMLElement | null>;
  reduced: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !hero || !ctx) return;

    let width = 0;
    let height = 0;
    let dots: Dot[] = [];
    let running = false;
    let frame = 0;
    let resizeTimer: number | undefined;
    const pointer = { x: -9999, y: -9999 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(Math.round((width * height) / 16000), 110);
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.8,
      }));
    };

    const draw = () => {
      const rgb = getComputedStyle(themeRoot.current ?? document.documentElement)
        .getPropertyValue("--net")
        .trim();
      const linkDistance = 130;
      ctx.clearRect(0, 0, width, height);

      for (const dot of dots) {
        dot.x += dot.vx;
        dot.y += dot.vy;
        if (dot.x < 0 || dot.x > width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > height) dot.vy *= -1;
        const dx = dot.x - pointer.x;
        const dy = dot.y - pointer.y;
        if (dx * dx + dy * dy < 14400) {
          dot.x += dx * 0.012;
          dot.y += dy * 0.012;
        }
      }

      for (let i = 0; i < dots.length; i++) {
        const a = dots[i];
        for (let j = i + 1; j < dots.length; j++) {
          const b = dots[j];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance < linkDistance) {
            ctx.strokeStyle = `rgba(${rgb}, ${(1 - distance / linkDistance) * 0.28})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        ctx.fillStyle = `rgba(${rgb}, 0.7)`;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      draw();
      if (running) frame = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!running && !reduced && !document.hidden) {
        running = true;
        loop();
      }
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resize();
        draw();
      }, 150);
    };
    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    const onPointerLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    resize();
    draw();
    window.addEventListener("resize", onResize);
    hero.addEventListener("pointermove", onPointerMove);
    hero.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);
    const observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    observer.observe(hero);

    return () => {
      stop();
      observer.disconnect();
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      hero.removeEventListener("pointermove", onPointerMove);
      hero.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced, themeRoot]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
