import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { Link } from "react-router-dom";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Aperture,
  Contrast,
  EyeOff,
  FileText,
  Heading,
  ImageOff,
  Link2,
  Minus,
  MoveHorizontal,
  Pause,
  Plus,
  RotateCcw,
  Scan,
  TextCursorInput,
  Type,
  ZoomIn,
} from "lucide-react";
import { useAccessibility } from "./AccessibilityProvider";
import { AccessibilityLanguageSelector } from "./AccessibilityLanguageSelector";
import {
  stepNext,
  stepPrev,
} from "./accessibilityStorage";
import {
  ACCESSIBILITY_STATEMENT_ROUTE,
  CONTENT_SCALE_STEPS,
  FONT_SCALE_STEPS,
  LETTER_SPACING_STEPS,
  LINE_HEIGHT_STEPS,
} from "./accessibilityTypes";

function ToggleCard({
  label,
  pressed,
  onToggle,
  icon,
  disabled,
}: {
  label: string;
  pressed: boolean;
  onToggle: () => void;
  icon: ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className="a11y-card"
      aria-pressed={pressed}
      aria-label={label}
      disabled={disabled}
      onClick={onToggle}
    >
      <span className="a11y-card__icon" aria-hidden>
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
}

function StepperCard({
  label,
  value,
  onDecrease,
  onIncrease,
  decreaseLabel,
  increaseLabel,
  canDecrease,
  canIncrease,
  disabled,
}: {
  label: string;
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
  decreaseLabel: string;
  increaseLabel: string;
  canDecrease: boolean;
  canIncrease: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="a11y-card a11y-card--stepper" role="group" aria-label={label}>
      <span className="a11y-card__icon" aria-hidden>
        <Type size={16} />
      </span>
      <span className="a11y-card__label">{label}</span>
      <div className="a11y-stepper">
        <button
          type="button"
          className="a11y-stepper__btn"
          aria-label={`${decreaseLabel}: ${label}`}
          disabled={disabled || !canDecrease}
          onClick={onDecrease}
        >
          <Minus size={14} aria-hidden />
        </button>
        <span className="a11y-stepper__value" aria-hidden>
          {value}%
        </span>
        <button
          type="button"
          className="a11y-stepper__btn"
          aria-label={`${increaseLabel}: ${label}`}
          disabled={disabled || !canIncrease}
          onClick={onIncrease}
        >
          <Plus size={14} aria-hidden />
        </button>
      </div>
    </div>
  );
}

type Props = {
  panelId: string;
  onRequestClose: () => void;
};

export function AccessibilityPanel({ panelId, onRequestClose }: Props) {
  const {
    prefs,
    t,
    isRtl,
    setEnabled,
    toggle,
    setTextAlign,
    setNumeric,
    reset,
    hideWidget,
    announce,
  } = useAccessibility();

  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const effectsOff = !prefs.enabled;

  useEffect(() => {
    const node = panelRef.current;
    if (!node) return;

    const focusables = () =>
      Array.from(
        node.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);

    const list = focusables();
    (list[0] ?? node).focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onRequestClose();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0]!;
      const last = items[items.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    node.addEventListener("keydown", onKeyDown);
    return () => node.removeEventListener("keydown", onKeyDown);
  }, [onRequestClose]);

  const bumpFont = useCallback(
    (dir: 1 | -1) => {
      const next =
        dir > 0
          ? stepNext(FONT_SCALE_STEPS, prefs.fontScale)
          : stepPrev(FONT_SCALE_STEPS, prefs.fontScale);
      setNumeric("fontScale", next);
      announce(t.fontSizeAnnounced(next));
    },
    [announce, prefs.fontScale, setNumeric, t],
  );

  const bumpLine = useCallback(
    (dir: 1 | -1) => {
      const next =
        dir > 0
          ? stepNext(LINE_HEIGHT_STEPS, prefs.lineHeight)
          : stepPrev(LINE_HEIGHT_STEPS, prefs.lineHeight);
      setNumeric("lineHeight", next);
      announce(t.lineHeightAnnounced(next));
    },
    [announce, prefs.lineHeight, setNumeric, t],
  );

  const bumpContent = useCallback(
    (dir: 1 | -1) => {
      const next =
        dir > 0
          ? stepNext(CONTENT_SCALE_STEPS, prefs.contentScale)
          : stepPrev(CONTENT_SCALE_STEPS, prefs.contentScale);
      setNumeric("contentScale", next);
      announce(t.contentScaleAnnounced(next));
    },
    [announce, prefs.contentScale, setNumeric, t],
  );

  const bumpLetter = useCallback(
    (dir: 1 | -1) => {
      const next =
        dir > 0
          ? stepNext(LETTER_SPACING_STEPS, prefs.letterSpacing)
          : stepPrev(LETTER_SPACING_STEPS, prefs.letterSpacing);
      setNumeric("letterSpacing", next);
      announce(t.letterSpacingAnnounced(next));
    },
    [announce, prefs.letterSpacing, setNumeric, t],
  );

  const onPanelKey = (e: ReactKeyboardEvent) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      onRequestClose();
    }
  };

  return (
    <div
      ref={panelRef}
      id={panelId}
      className="a11y-panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      dir={isRtl ? "rtl" : "ltr"}
      onKeyDown={onPanelKey}
      data-testid="a11y-panel"
    >
      <div className="a11y-panel__scroll">
        <h2 id={titleId} className="sr-only">
          {t.panelTitle}
        </h2>

        <Link
          to={ACCESSIBILITY_STATEMENT_ROUTE}
          className="a11y-statement"
          onClick={onRequestClose}
        >
          <FileText size={16} aria-hidden />
          <span>{t.statement}</span>
        </Link>

        <div className="a11y-panel__toolbar">
          <div className="a11y-master">
            <button
              ref={closeBtnRef}
              type="button"
              className="a11y-switch"
              role="switch"
              aria-checked={prefs.enabled}
              aria-label={t.accessibilityActive}
              onClick={() => setEnabled(!prefs.enabled)}
            >
              <span className="a11y-switch__knob" aria-hidden />
            </button>
            <span>{t.accessibilityActive}</span>
          </div>
          <AccessibilityLanguageSelector />
        </div>

        <div className="a11y-grid">
          <ToggleCard
            label={t.highContrast}
            pressed={prefs.highContrast}
            onToggle={() => toggle("highContrast")}
            icon={<Contrast size={18} />}
            disabled={effectsOff}
          />
          <ToggleCard
            label={t.readingMask}
            pressed={prefs.readingMask}
            onToggle={() => toggle("readingMask")}
            icon={<Scan size={18} />}
            disabled={effectsOff}
          />

          <StepperCard
            label={t.fontSize}
            value={prefs.fontScale}
            onDecrease={() => bumpFont(-1)}
            onIncrease={() => bumpFont(1)}
            decreaseLabel={t.decrease}
            increaseLabel={t.increase}
            canDecrease={prefs.fontScale > FONT_SCALE_STEPS[0]!}
            canIncrease={
              prefs.fontScale < FONT_SCALE_STEPS[FONT_SCALE_STEPS.length - 1]!
            }
            disabled={effectsOff}
          />
          <StepperCard
            label={t.lineHeight}
            value={prefs.lineHeight}
            onDecrease={() => bumpLine(-1)}
            onIncrease={() => bumpLine(1)}
            decreaseLabel={t.decrease}
            increaseLabel={t.increase}
            canDecrease={prefs.lineHeight > LINE_HEIGHT_STEPS[0]!}
            canIncrease={
              prefs.lineHeight < LINE_HEIGHT_STEPS[LINE_HEIGHT_STEPS.length - 1]!
            }
            disabled={effectsOff}
          />

          <StepperCard
            label={t.contentScale}
            value={prefs.contentScale}
            onDecrease={() => bumpContent(-1)}
            onIncrease={() => bumpContent(1)}
            decreaseLabel={t.decrease}
            increaseLabel={t.increase}
            canDecrease={prefs.contentScale > CONTENT_SCALE_STEPS[0]!}
            canIncrease={
              prefs.contentScale <
              CONTENT_SCALE_STEPS[CONTENT_SCALE_STEPS.length - 1]!
            }
            disabled={effectsOff}
          />
          <StepperCard
            label={t.letterSpacing}
            value={prefs.letterSpacing}
            onDecrease={() => bumpLetter(-1)}
            onIncrease={() => bumpLetter(1)}
            decreaseLabel={t.decrease}
            increaseLabel={t.increase}
            canDecrease={prefs.letterSpacing > LETTER_SPACING_STEPS[0]!}
            canIncrease={
              prefs.letterSpacing <
              LETTER_SPACING_STEPS[LETTER_SPACING_STEPS.length - 1]!
            }
            disabled={effectsOff}
          />

          <ToggleCard
            label={t.readableFont}
            pressed={prefs.readableFont}
            onToggle={() => toggle("readableFont")}
            icon={<TextCursorInput size={18} />}
            disabled={effectsOff}
          />
          <ToggleCard
            label={t.alignLeft}
            pressed={prefs.textAlign === "left"}
            onToggle={() => setTextAlign("left")}
            icon={<AlignLeft size={18} />}
            disabled={effectsOff}
          />
          <ToggleCard
            label={t.alignCenter}
            pressed={prefs.textAlign === "center"}
            onToggle={() => setTextAlign("center")}
            icon={<AlignCenter size={18} />}
            disabled={effectsOff}
          />
          <ToggleCard
            label={t.alignRight}
            pressed={prefs.textAlign === "right"}
            onToggle={() => setTextAlign("right")}
            icon={<AlignRight size={18} />}
            disabled={effectsOff}
          />

          <ToggleCard
            label={t.textMagnifier}
            pressed={prefs.textMagnifier}
            onToggle={() => toggle("textMagnifier")}
            icon={<ZoomIn size={18} />}
            disabled={effectsOff}
          />
          <ToggleCard
            label={t.hideImages}
            pressed={prefs.hideImages}
            onToggle={() => toggle("hideImages")}
            icon={<ImageOff size={18} />}
            disabled={effectsOff}
          />
          <ToggleCard
            label={t.highlightHeadings}
            pressed={prefs.highlightHeadings}
            onToggle={() => toggle("highlightHeadings")}
            icon={<Heading size={18} />}
            disabled={effectsOff}
          />
          <ToggleCard
            label={t.highlightLinks}
            pressed={prefs.highlightLinks}
            onToggle={() => toggle("highlightLinks")}
            icon={<Link2 size={18} />}
            disabled={effectsOff}
          />
          <ToggleCard
            label={t.grayscale}
            pressed={prefs.grayscale}
            onToggle={() => toggle("grayscale")}
            icon={<Aperture size={18} />}
            disabled={effectsOff}
          />
          <ToggleCard
            label={t.stopAnimations}
            pressed={prefs.stopAnimations}
            onToggle={() => toggle("stopAnimations")}
            icon={<Pause size={18} />}
            disabled={effectsOff}
          />
          <ToggleCard
            label={t.largeCursor}
            pressed={prefs.largeCursor}
            onToggle={() => toggle("largeCursor")}
            icon={<MoveHorizontal size={18} />}
            disabled={effectsOff}
          />
        </div>

        <div className="a11y-actions">
          <button type="button" className="a11y-action" onClick={hideWidget}>
            <EyeOff size={16} aria-hidden />
            <span>{t.hideWidget}</span>
          </button>
          <button type="button" className="a11y-action" onClick={reset}>
            <RotateCcw size={16} aria-hidden />
            <span>{t.reset}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
