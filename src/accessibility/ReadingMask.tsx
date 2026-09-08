import { useEffect, useRef } from "react";
import { useAccessibility } from "./AccessibilityProvider";

const BAND = 110; // px clear reading band

export function ReadingMask() {
  const { prefs } = useAccessibility();
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const lastY = useRef(window.innerHeight / 2);

  const active = prefs.enabled && prefs.readingMask;

  useEffect(() => {
    if (!active) return;

    const el = ref.current;
    if (!el) return;

    const paint = (y: number) => {
      lastY.current = y;
      const top = Math.max(0, y - BAND / 2);
      const bottom = Math.min(window.innerHeight, y + BAND / 2);
      el.style.setProperty("--a11y-mask-top", `${top}px`);
      el.style.setProperty("--a11y-mask-bottom", `${bottom}px`);
    };

    paint(lastY.current);

    const schedule = (y: number) => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => paint(y));
    };

    const onPointer = (e: PointerEvent) => schedule(e.clientY);
    const onFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target?.getBoundingClientRect) return;
      const rect = target.getBoundingClientRect();
      schedule(rect.top + rect.height / 2);
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("focusin", onFocusIn);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("focusin", onFocusIn);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      ref={ref}
      className="a11y-reading-mask"
      aria-hidden="true"
      data-testid="a11y-reading-mask"
    />
  );
}
