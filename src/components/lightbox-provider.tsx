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

type LightboxState = { src: string; alt: string } | null;

type LightboxCtx = {
  openLightbox: (src: string, alt: string) => void;
};

const LightboxContext = createContext<LightboxCtx>({ openLightbox: () => {} });

export function useLightbox() {
  return useContext(LightboxContext);
}

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LightboxState>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const openLightbox = useCallback((src: string, alt: string) => {
    // Remember what opened the dialog so focus can return there on close.
    triggerRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setState({ src, alt });
  }, []);

  const close = useCallback(() => setState(null), []);

  useEffect(() => {
    if (!state) return;
    const closeBtn = frameRef.current?.querySelector<HTMLButtonElement>(".lb-close");
    closeBtn?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      // The close button is the only focusable control in the dialog; keep
      // focus trapped on it so Tab never lands behind the modal.
      if (e.key === "Tab") {
        e.preventDefault();
        closeBtn?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    document.body.dataset.lightboxOpen = "true";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      delete document.body.dataset.lightboxOpen;
      triggerRef.current?.focus();
      triggerRef.current = null;
    };
  }, [state, close]);

  return (
    <LightboxContext.Provider value={{ openLightbox }}>
      {children}

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
            role="dialog"
            aria-modal="true"
            aria-label={state.alt}
          >
            <button className="lb-close" onClick={close} aria-label="Close">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <Image
              className="lb-image"
              src={state.src}
              alt={state.alt}
              width={1200}
              height={2600}
              unoptimized={state.src.startsWith("/")}
            />
          </div>
        </>
      )}
    </LightboxContext.Provider>
  );
}
