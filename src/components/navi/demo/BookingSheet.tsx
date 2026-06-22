"use client";

import { useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useOverlayBehavior } from "@/lib/navi/use-overlay-behavior";
import { OverlayRoot } from "@/components/navi/demo/OverlayRoot";

/**
 * Mobile bottom sheet for the booking form. Portals to document.body so it sits
 * above the fixed tab bar and outside .nv-ui's inert background. Mirrors the
 * date modal's overlay mechanics: focus trap, Escape, scroll lock, focus return.
 */
export function BookingSheet({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const headingId = useId();
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useOverlayBehavior({
    open,
    onClose,
    containerRef: sheetRef,
    initialFocusRef: closeBtnRef,
  });

  if (!open) return null;

  return createPortal(
    <OverlayRoot>
      <div className="nv-sheet-backdrop" onClick={onClose} aria-hidden="true" />
      <div
        ref={sheetRef}
        className="nv-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
      >
        <header className="nv-sheet-head">
          <h2 id={headingId} className="nv-sheet-title">
            {title}
          </h2>
          <button
            type="button"
            ref={closeBtnRef}
            className="nv-sheet-close"
            aria-label="Close booking"
            onClick={onClose}
          >
            ✕
          </button>
        </header>
        <div className="nv-sheet-body">{children}</div>
      </div>
    </OverlayRoot>,
    document.body,
  );
}
