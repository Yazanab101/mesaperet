import { useRef, useState } from "react";
import { Lightbox } from "../Lightbox/Lightbox";
import "./Gallery.css";

export type GalleryImage = {
  src: string;
  alt: string;
  objectPosition?: string;
};

type Props = {
  images: GalleryImage[];
  variant?: "grid" | "slider" | "masonry" | "certs";
  className?: string;
};

export function Gallery({ images, variant = "grid", className = "" }: Props) {
  const [index, setIndex] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = Math.min(el.clientWidth * 0.85, 420);
    el.scrollBy({ left: dir * -amount, behavior: "smooth" });
  };

  return (
    <div className={`gallery gallery--${variant} ${className}`.trim()}>
      {variant === "slider" && (
        <div className="gallery__controls">
          <button type="button" onClick={() => scrollBy(-1)} aria-label="הקודם">
            ‹
          </button>
          <button type="button" onClick={() => scrollBy(1)} aria-label="הבא">
            ›
          </button>
        </div>
      )}
      <div className="gallery__track" ref={trackRef}>
        {images.map((img, i) => (
          <button
            type="button"
            key={`${img.src}-${i}`}
            className="gallery__item"
            onClick={() => setIndex(i)}
            aria-label={img.alt || `תמונה ${i + 1}`}
          >
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              style={img.objectPosition ? { objectPosition: img.objectPosition } : undefined}
            />
          </button>
        ))}
      </div>
      <Lightbox
        items={images}
        index={index}
        onClose={() => setIndex(null)}
        onPrev={() => setIndex((i) => (i === null ? i : (i + images.length - 1) % images.length))}
        onNext={() => setIndex((i) => (i === null ? i : (i + 1) % images.length))}
      />
    </div>
  );
}
