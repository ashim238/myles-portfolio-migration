"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import Image from "next/image";

const MIN_ZOOM = 0.75;
const MAX_ZOOM = 2.5;
const ZOOM_STEP = 0.25;

type LightboxState = {
  src: string;
  alt: string;
  width: number;
  height: number;
} | null;

type LightboxCtx = {
  openLightbox: (
    src: string,
    alt: string,
    width: number,
    height: number,
  ) => void;
};

const LightboxContext = createContext<LightboxCtx>({ openLightbox: () => {} });

export function useLightbox() {
  return useContext(LightboxContext);
}

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LightboxState>(null);
  const [viewMode, setViewMode] = useState<"fit" | "actual">("fit");
  const [zoom, setZoom] = useState(1);
  const contentRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const openLightbox = useCallback((
    src: string,
    alt: string,
    width: number,
    height: number,
  ) => {
    // Remember what opened the dialog so focus can return there on close.
    triggerRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setViewMode("fit");
    setZoom(1);
    setState({ src, alt, width, height });
  }, []);

  const close = useCallback(() => setState(null), []);

  const setFit = useCallback(() => {
    setViewMode("fit");
    setZoom(1);
  }, []);

  const setActual = useCallback(() => {
    setViewMode("actual");
    setZoom(1);
  }, []);

  const adjustZoom = useCallback((amount: number) => {
    setViewMode("actual");
    setZoom((current) =>
      Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Number((current + amount).toFixed(2)))),
    );
  }, []);

  useEffect(() => {
    if (!state) return;
    const content = contentRef.current;
    const closeBtn = frameRef.current?.querySelector<HTMLButtonElement>(".lb-close");
    closeBtn?.focus();
    content?.setAttribute("inert", "");
    content?.setAttribute("aria-hidden", "true");

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      // Keep focus within the dialog, while allowing keyboard users to reach
      // the image viewport and each viewing control.
      if (e.key === "Tab") {
        const focusable = Array.from(
          frameRef.current?.querySelectorAll<HTMLElement>(
            "button:not([disabled]), [tabindex=\"0\"]",
          ) ?? [],
        );
        if (focusable.length === 0) return;
        const currentIndex = focusable.indexOf(document.activeElement as HTMLElement);
        const nextIndex = e.shiftKey
          ? (currentIndex <= 0 ? focusable.length - 1 : currentIndex - 1)
          : (currentIndex + 1) % focusable.length;
        e.preventDefault();
        focusable[nextIndex]?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    document.body.dataset.lightboxOpen = "true";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      delete document.body.dataset.lightboxOpen;
      content?.removeAttribute("inert");
      content?.removeAttribute("aria-hidden");
      triggerRef.current?.focus();
      triggerRef.current = null;
    };
  }, [state, close]);

  return (
    <LightboxContext.Provider value={{ openLightbox }}>
      <div
        ref={contentRef}
        className="lb-content"
      >
        {children}
      </div>

      {state && (
        <>
          {/* Backdrop — dedicated click target, covers the whole viewport */}
          <div
            className="lb-backdrop"
            onClick={close}
            aria-hidden="true"
          />

          {/* Content — sits above the backdrop, does NOT stop propagation */}
          <div
            ref={frameRef}
            className="lb-frame"
            data-lb-view={viewMode}
            role="dialog"
            aria-modal="true"
            aria-label={state.alt}
          >
            <button className="lb-close" onClick={close} aria-label="Close">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <div
              className="lb-viewport"
              tabIndex={0}
              role="region"
              aria-label="Image viewing area. Use arrow keys or scroll to inspect the image."
            >
              <Image
                className="lb-image"
                src={state.src}
                alt={state.alt}
                width={state.width}
                height={state.height}
                sizes={viewMode === "fit" ? "92vw" : `${Math.round(zoom * 100)}vw`}
                style={
                  viewMode === "actual"
                    ? { width: `${state.width * zoom}px`, height: `${state.height * zoom}px` }
                    : undefined
                }
              />
            </div>
            <div className="lb-toolbar" aria-label="Image viewing controls">
              <button
                className="lb-control"
                type="button"
                onClick={setFit}
                aria-pressed={viewMode === "fit"}
              >
                Fit
              </button>
              <button
                className="lb-control"
                type="button"
                onClick={setActual}
                aria-pressed={viewMode === "actual" && zoom === 1}
              >
                Actual size
              </button>
              <span className="lb-zoom-group">
                <button
                  className="lb-control lb-zoom-button"
                  type="button"
                  onClick={() => adjustZoom(-ZOOM_STEP)}
                  disabled={zoom <= MIN_ZOOM}
                  aria-label="Zoom out"
                >
                  −
                </button>
                <span className="lb-zoom-readout" aria-live="polite">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  className="lb-control lb-zoom-button"
                  type="button"
                  onClick={() => adjustZoom(ZOOM_STEP)}
                  disabled={zoom >= MAX_ZOOM}
                  aria-label="Zoom in"
                >
                  +
                </button>
              </span>
            </div>
          </div>
        </>
      )}
    </LightboxContext.Provider>
  );
}
