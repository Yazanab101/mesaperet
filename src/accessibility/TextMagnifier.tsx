import { useEffect, useRef, useState } from "react";
import { useAccessibility } from "./AccessibilityProvider";

function isReadableTarget(el: Element | null): el is HTMLElement {
  if (!el || !(el instanceof HTMLElement)) return false;
  if (el.closest(".a11y-widget")) return false;
  if (el.closest("script, style, svg, noscript")) return false;
  const tag = el.tagName.toLowerCase();
  if (["img", "video", "canvas", "iframe", "input", "textarea", "select", "button"].includes(tag)) {
    return false;
  }
  const text = (el.innerText || el.textContent || "").trim();
  return text.length > 0 && text.length < 400;
}

function sanitizeText(raw: string): string {
  return raw.replace(/\s+/g, " ").trim().slice(0, 280);
}

export function TextMagnifier() {
  const { prefs } = useAccessibility();
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState("");
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const raf = useRef(0);

  const active = prefs.enabled && prefs.textMagnifier;

  useEffect(() => {
    if (!active) return;

    const update = (clientX: number, clientY: number, target: Element | null) => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        let node: Element | null = target;
        while (node && !isReadableTarget(node)) {
          node = node.parentElement;
        }
        if (!node) {
          setVisible(false);
          return;
        }
        const content = sanitizeText(node.innerText || node.textContent || "");
        if (!content) {
          setVisible(false);
          return;
        }
        setText(content);
        setPos({
          x: Math.min(window.innerWidth - 40, clientX + 16),
          y: Math.min(window.innerHeight - 40, clientY + 16),
        });
        setVisible(true);
      });
    };

    const onMove = (e: PointerEvent) => {
      update(e.clientX, e.clientY, e.target as Element | null);
    };

    const onFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      update(rect.left + 8, rect.bottom + 4, target);
    };

    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("pointerleave", onLeave);
      setVisible(false);
    };
  }, [active]);

  if (!active || !visible || !text) return null;

  return (
    <div
      className="a11y-text-magnifier"
      style={{ left: pos.x, top: pos.y }}
      aria-hidden="true"
      data-testid="a11y-text-magnifier"
    >
      {text}
    </div>
  );
}
