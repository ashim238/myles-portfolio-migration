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

type LightboxOptions = { unoptimized?: boolean; overlay?: ReactNode; initialView?: "read" };

type LightboxState = LightboxOptions & {
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
    options?: LightboxOptions,
  ) => void;
};

const LightboxContext = createContext<LightboxCtx>({ openLightbox: () => {} });

export function useLightbox() {
  return useContext(LightboxContext);
}

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LightboxState>(null);
  const [viewMode, setViewMode] = useState<"fit" | "actual" | "read">("fit");
  const [zoom, setZoom] = useState(1);
  const [fitScale, setFitScale] = useState(1);
  const imageRef = useRef<HTMLImageElement>(null);
  const visibleScale = viewMode === "fit" ? fitScale : zoom;
  const minimumScale = Math.min(MIN_ZOOM, fitScale);
  const contentRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const openLightbox = useCallback((
    src: string,
    alt: string,
    width: number,
    height: number,
    options?: LightboxOptions,
  ) => {
    // Remember what opened the dialog so focus can return there on close.
    triggerRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setViewMode(options?.initialView ?? "fit");
    setZoom(1);
    setFitScale(1);
    setState({ src, alt, width, height, ...options });
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

  function adjustZoom(amount: number) {
    // Step from the visible size. Large originals often fit at less than 25%.
    const next = Math.min(MAX_ZOOM, Math.max(minimumScale, visibleScale + amount));
    if (next === fitScale && amount < 0) {
      setFit();
      return;
    }
    setZoom(next);
    setViewMode("actual");
  }

  useEffect(() => {
    const image = imageRef.current;
    if (!image || !state || viewMode === "actual") return;
    const measure = () => {
      const width = image.offsetWidth;
      if (!width) return;
      if (viewMode === "read") {
        setZoom(width / state.width);
        const viewport = image.closest(".lb-viewport");
        if (viewport) setFitScale(Math.min(width / state.width, viewport.clientHeight / state.height));
      } else {
        setFitScale(width / state.width);
      }
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(image);
    return () => observer.disconnect();
  }, [state, viewMode]);

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
            data-lb-long-capture={state.initialView === "read" || undefined}
            role="dialog"
            aria-modal="true"
            aria-label={state.alt}
          >
            <button className="lb-close reader-control" onClick={close} aria-label="Close">
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
              <div className="lb-artwork">
                <Image
                  ref={imageRef}
                  className="lb-image"
                  src={state.src}
                  alt={state.alt}
                  width={state.width}
                  height={state.height}
                  unoptimized={viewMode === "actual" || state.unoptimized}
                  sizes={viewMode === "fit" ? "92vw" : undefined}
                  style={
                    viewMode === "actual"
                      ? { width: `${state.width * zoom}px`, height: `${state.height * zoom}px` }
                      : viewMode === "read"
                        ? { width: `min(92vw, 42rem, ${state.width}px)`, height: "auto" }
                        : undefined
                  }
                />
                {state.overlay}
              </div>
            </div>
            <div className="lb-toolbar" aria-label="Image viewing controls">
              {state.initialView === "read" && (
                <button
                  className="lb-control"
                  type="button"
                  onClick={() => setViewMode("read")}
                  aria-pressed={viewMode === "read"}
                >
                  Read
                </button>
              )}
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
                  disabled={visibleScale <= minimumScale}
                  aria-label="Zoom out"
                >
                  −
                </button>
                <span className="lb-zoom-readout" aria-live="polite">
                  {Math.round(visibleScale * 100)}%
                </span>
                <button
                  className="lb-control lb-zoom-button"
                  type="button"
                  onClick={() => adjustZoom(ZOOM_STEP)}
                  disabled={visibleScale >= MAX_ZOOM}
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
