import { useEffect, useId, useRef } from "react";
import { Accessibility } from "lucide-react";
import { useAccessibility } from "./AccessibilityProvider";
import { AccessibilityPanel } from "./AccessibilityPanel";
import { ReadingMask } from "./ReadingMask";
import { TextMagnifier } from "./TextMagnifier";

export function AccessibilityWidget() {
  const {
    panelOpen,
    setPanelOpen,
    widgetHidden,
    showWidget,
    t,
    isRtl,
    announcement,
  } = useAccessibility();

  const fabRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  const panelId = useId();

  useEffect(() => {
    if (wasOpen.current && !panelOpen) {
      fabRef.current?.focus();
    }
    wasOpen.current = panelOpen;
  }, [panelOpen]);

  useEffect(() => {
    if (!panelOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setPanelOpen(false);
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [panelOpen, setPanelOpen]);

  const openPanel = () => setPanelOpen(true);
  const closePanel = () => setPanelOpen(false);

  return (
    <div className="a11y-widget" dir={isRtl ? "rtl" : "ltr"} data-testid="a11y-widget">
      <ReadingMask />
      <TextMagnifier />

      <div className="a11y-live" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      {widgetHidden ? (
        <button
          type="button"
          className="a11y-restore-tab"
          onClick={showWidget}
          aria-label={t.restoreWidget}
          data-testid="a11y-restore-tab"
        >
          {t.restoreWidget}
        </button>
      ) : (
        <>
          <button
            ref={fabRef}
            type="button"
            className="a11y-fab"
            aria-label={t.openWidget}
            aria-expanded={panelOpen}
            aria-controls={panelId}
            data-testid="a11y-fab"
            onClick={() => (panelOpen ? closePanel() : openPanel())}
          >
            <Accessibility size={28} aria-hidden strokeWidth={2.25} />
          </button>

          {panelOpen && (
            <>
              <button
                type="button"
                className="a11y-backdrop"
                aria-label={t.closePanel}
                data-testid="a11y-backdrop"
                onClick={closePanel}
              />
              <AccessibilityPanel panelId={panelId} onRequestClose={closePanel} />
            </>
          )}
        </>
      )}
    </div>
  );
}
