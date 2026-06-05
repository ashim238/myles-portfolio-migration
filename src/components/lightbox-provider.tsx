"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
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

  const openLightbox = useCallback((src: string, alt: string) => {
    setState({ src, alt });
  }, []);

  const close = useCallback(() => setState(null), []);

  useEffect(() => {
    if (!state) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
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
              src={state.src}
              alt={state.alt}
              width={1200}
              height={2600}
              style={{
                width: "auto",
                height: "auto",
                maxHeight: "92vh",
                maxWidth: "92vw",
                objectFit: "contain",
                borderRadius: "0.75rem",
                boxShadow: "0 32px 80px rgba(0,0,0,0.65)",
              }}
            />
          </div>
        </>
      )}
    </LightboxContext.Provider>
  );
}
