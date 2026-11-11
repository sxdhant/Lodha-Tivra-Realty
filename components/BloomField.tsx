'use client';

import { useEffect, useRef } from 'react';

interface Blob {
  x: number;
  y: number;
  /** radius as a percentage of the box */
  r: number;
  rgb: string;
  /** static per-blob phases */
  p: number;
  p2: number;
}

const BLOBS: Blob[] = [
  { x: 65.34, y: 44.62, r: 34.1, rgb: '52, 52, 50', p: 0.9, p2: 2.3 },
  { x: 28.07, y: 74.48, r: 44.6, rgb: '18, 18, 17', p: 2.1, p2: 4.0 },
  { x: 52.42, y: 19.94, r: 56.5, rgb: '52, 52, 50', p: 3.7, p2: 0.4 },
  { x: 80.31, y: 84.47, r: 69.1, rgb: '0, 0, 0', p: 5.2, p2: 1.6 },
];

const SPEED = 0.77;
const AMOUNT = 1;
const SWAY = 14;
const LEAN = 9; // how far blobs lean toward the cursor

interface Pointer {
  x: number;
  y: number;
  on: number;
}

function blobGradient(b: Blob, x: number, y: number) {
  const c = b.rgb;
  return (
    `radial-gradient(circle at ${x}% ${y}%, rgba(${c}, 1) 0%, rgba(${c}, 0.844) ${b.r * 0.25}%, ` +
    `rgba(${c}, 0.5) ${b.r * 0.5}%, rgba(${c}, 0.156) ${b.r * 0.75}%, rgba(${c}, 0) ${b.r}%)`
  );
}

function paint(el: HTMLElement, t: number, ptr: Pointer) {
  const ph = t * SPEED;
  const layers = BLOBS.map((b) => {
    const lean = LEAN * (b.r / 50) * ptr.on;
    const x = b.x + (Math.sin(ph * 0.55 + b.p) - Math.sin(b.p)) * SWAY * AMOUNT + (ptr.x - 0.5) * 2 * lean;
    const y = b.y + (Math.sin(ph * 0.43 + b.p2) - Math.sin(b.p2)) * SWAY * AMOUNT + (ptr.y - 0.5) * 2 * lean;
    return blobGradient(b, x, y);
  });
  const a = 0.5 * ptr.on; // soft light that follows the cursor
  const glow = `radial-gradient(circle at ${ptr.x * 100}% ${ptr.y * 100}%, rgba(120, 112, 96, ${a}) 0%, rgba(120, 112, 96, ${a * 0.45}) 12%, rgba(120, 112, 96, 0) 30%)`;
  el.style.backgroundImage = [glow, ...layers].join(', ');
}

/**
 * Slowly drifting dark blobs that lean toward the cursor. Fills its nearest positioned
 * ancestor and sits behind that section's content, so the section needs `isolation: isolate`.
 */
export function BloomField({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!el || !host) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let visible = true;
    let start = 0;
    const ptr: Pointer = { x: 0.5, y: 0.5, on: 0 };
    const target: Pointer = { x: 0.5, y: 0.5, on: 0 };

    const move = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      target.x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      target.y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
      target.on = 1;
    };
    const leave = () => {
      target.on = 0;
    };
    host.addEventListener('pointermove', move);
    host.addEventListener('pointerleave', leave);
    host.addEventListener('pointercancel', leave);

    const tick = (now: number) => {
      if (!start) start = now;
      ptr.x += (target.x - ptr.x) * 0.08;
      ptr.y += (target.y - ptr.y) * 0.08;
      ptr.on += (target.on - ptr.on) * 0.06;
      paint(el, (now - start) / 1000, ptr);
      raf = visible ? requestAnimationFrame(tick) : 0;
    };
    raf = requestAnimationFrame(tick);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      host.removeEventListener('pointermove', move);
      host.removeEventListener('pointerleave', leave);
      host.removeEventListener('pointercancel', leave);
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const initial = BLOBS.map((b) => blobGradient(b, b.x, b.y)).join(', ');

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={className}
      // Below the section's grain overlay (z-index -1), above its background.
      style={{ position: 'absolute', inset: 0, zIndex: -2, pointerEvents: 'none', backgroundColor: '#000', backgroundImage: initial }}
    />
  );
}
