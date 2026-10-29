'use client';

import { useEffect, useRef, useState } from 'react';

export type Fact = { value: number; suffix?: string; label: string };

const DURATION = 1800;
const STAGGER = 140;
const easeOutQuart = (t: number) => 1 - (1 - t) ** 4;

// The About Lodha figures count up from zero the first time they come into view. The server
// renders the real figures, and they stay put for reduced motion or if they are already on screen.
export function BuilderFacts({ facts }: { facts: Fact[] }) {
  const listRef = useRef<HTMLDListElement>(null);
  // Milliseconds into the count, or null to show the final figures.
  const [elapsed, setElapsed] = useState<number | null>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    let armed = false;
    const total = DURATION + STAGGER * (facts.length - 1);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!armed) {
          armed = true;
          // Already visible when the page loaded: leave the figures as they are.
          if (entry.isIntersecting) {
            observer.disconnect();
            return;
          }
          // Out of sight, so drop them to zero without anyone seeing it.
          setElapsed(0);
          return;
        }
        if (entry.intersectionRatio < 0.35) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = now - start;
          if (t >= total) {
            setElapsed(null);
            return;
          }
          setElapsed(t);
          frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: [0, 0.35] },
    );
    observer.observe(list);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [facts.length]);

  return (
    <dl className="builder__facts" ref={listRef}>
      {facts.map((fact, index) => {
        const progress =
          elapsed === null ? 1 : easeOutQuart(Math.min(1, Math.max(0, (elapsed - index * STAGGER) / DURATION)));
        return (
          <div className="builder__fact" key={fact.label} style={{ '--p': progress } as React.CSSProperties}>
            <dt>{fact.label}</dt>
            <dd>
              <span aria-hidden="true">
                {Math.round(fact.value * progress)}
                {fact.suffix}
              </span>
              <span className="visually-hidden">
                {fact.value}
                {fact.suffix}
              </span>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
