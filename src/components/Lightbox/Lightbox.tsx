import { useEffect } from "react";
import "./Lightbox.css";

type Item = { src: string; alt: string; video?: string };

type Props = {
  items: Item[];
  index: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export function Lightbox({ items, index, onClose, onPrev, onNext }: Props) {
  const open = index !== null && items[index];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNext();
      if (e.key === "ArrowRight") onPrev();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, onPrev, onNext]);

  if (!open || index === null) return null;
  const item = items[index];

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label="תצוגה מוגדלת">
      <button type="button" className="lightbox__backdrop" aria-label="סגירה" onClick={onClose} />
      <div className="lightbox__panel">
        <button type="button" className="lightbox__close" onClick={onClose} aria-label="סגור">
          ×
        </button>
        <button type="button" className="lightbox__nav lightbox__nav--prev" onClick={onPrev} aria-label="הקודם">
          ‹
        </button>
        {item.video ? (
          <video
            key={item.video}
            className="lightbox__video"
            src={item.video}
            poster={item.src}
            controls
            autoPlay
            playsInline
          />
        ) : (
          <img src={item.src} alt={item.alt} />
        )}
        <button type="button" className="lightbox__nav lightbox__nav--next" onClick={onNext} aria-label="הבא">
          ›
        </button>
      </div>
    </div>
  );
}
