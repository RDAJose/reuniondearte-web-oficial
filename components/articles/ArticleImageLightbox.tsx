"use client";

import {
  type MouseEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

export type ArticleLightboxImage = {
  alt: string;
  credit?: string;
  src: string;
  title?: string;
};

type ArticleImageLightboxProps = {
  children: ReactNode;
  images: ArticleLightboxImage[];
};

function getWrappedIndex(index: number, length: number) {
  if (length === 0) {
    return 0;
  }

  return (index + length) % length;
}

export function ArticleImageLightbox({
  children,
  images,
}: ArticleImageLightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const activeImage = activeIndex === null ? null : images[activeIndex];
  const hasMultipleImages = images.length > 1;

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setActiveIndex(null);
      }

      if (event.key === "ArrowLeft" && hasMultipleImages) {
        event.preventDefault();
        setActiveIndex((currentIndex) =>
          currentIndex === null
            ? currentIndex
            : getWrappedIndex(currentIndex - 1, images.length),
        );
      }

      if (event.key === "ArrowRight" && hasMultipleImages) {
        event.preventDefault();
        setActiveIndex((currentIndex) =>
          currentIndex === null
            ? currentIndex
            : getWrappedIndex(currentIndex + 1, images.length),
        );
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, hasMultipleImages, images.length]);

  useEffect(() => {
    if (activeIndex === null) {
      previousFocusRef.current?.focus();
      previousFocusRef.current = null;
    }
  }, [activeIndex]);

  function openLightbox(index: number) {
    if (!images[index]) {
      return;
    }

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setActiveIndex(index);
  }

  function onWrapperClick(event: MouseEvent<HTMLDivElement>) {
    const trigger = (event.target as HTMLElement).closest<HTMLElement>(
      "[data-lightbox-index]",
    );

    if (!trigger) {
      return;
    }

    const index = Number.parseInt(trigger.dataset.lightboxIndex ?? "", 10);

    if (!Number.isFinite(index)) {
      return;
    }

    event.preventDefault();
    openLightbox(index);
  }

  return (
    <div onClick={onWrapperClick}>
      {children}

      {activeImage ? (
        <div
          aria-label="Imagen ampliada"
          aria-modal="true"
          className="article-lightbox"
          role="dialog"
        >
          <button
            ref={closeButtonRef}
            aria-label="Cerrar imagen ampliada"
            className="article-lightbox__close"
            type="button"
            onClick={() => setActiveIndex(null)}
          >
            X
          </button>

          <button
            aria-label="Cerrar lightbox"
            className="article-lightbox__backdrop"
            type="button"
            onClick={() => setActiveIndex(null)}
          />

          {hasMultipleImages ? (
            <button
              aria-label="Imagen anterior"
              className="article-lightbox__nav article-lightbox__nav--previous"
              type="button"
              onClick={() =>
                setActiveIndex((currentIndex) =>
                  currentIndex === null
                    ? currentIndex
                    : getWrappedIndex(currentIndex - 1, images.length),
                )
              }
            >
              Anterior
            </button>
          ) : null}

          <figure className="article-lightbox__figure">
            {/* eslint-disable-next-line @next/next/no-img-element -- Lightbox uses editor-provided article images and must keep static export compatibility. */}
            <img alt={activeImage.alt} src={activeImage.src} />
            {(activeImage.title || activeImage.credit) && (
              <figcaption>
                {activeImage.title && <strong>{activeImage.title}</strong>}
                {activeImage.credit && <cite>{activeImage.credit}</cite>}
              </figcaption>
            )}
          </figure>

          {hasMultipleImages ? (
            <button
              aria-label="Imagen siguiente"
              className="article-lightbox__nav article-lightbox__nav--next"
              type="button"
              onClick={() =>
                setActiveIndex((currentIndex) =>
                  currentIndex === null
                    ? currentIndex
                    : getWrappedIndex(currentIndex + 1, images.length),
                )
              }
            >
              Siguiente
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
