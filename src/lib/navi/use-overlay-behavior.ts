import { useEffect, useRef, type RefObject } from "react";
import { lockBackground, unlockBackground } from "@/lib/navi/overlay-lock";

/**
 * Shared overlay behavior for the booking modals: focus trap, Escape to close,
 * body scroll lock with the minisite shell inert, and focus returned to the
 * trigger on close. The date picker modal and the mobile booking sheet both use
 * it so the two stay identical instead of drifting apart.
 */
export function useOverlayBehavior({
  open,
  onClose,
  containerRef,
  initialFocusRef,
}: {
  open: boolean;
  onClose: () => void;
  containerRef: RefObject<HTMLElement | null>;
  initialFocusRef?: RefObject<HTMLElement | null>;
}) {
  // Hold onClose in a ref so the keydown listener always calls the latest one
  // without re-binding (and tearing down the scroll lock) on every render.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const trigger = document.activeElement as HTMLElement | null;
    initialFocusRef?.current?.focus();
    lockBackground();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
      }
      if (e.key === "Tab" && containerRef.current) {
        const focusables = containerRef.current.querySelectorAll<HTMLElement>(
          "button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])",
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      unlockBackground();
      trigger?.focus?.();
    };
  }, [open, containerRef, initialFocusRef]);
}
