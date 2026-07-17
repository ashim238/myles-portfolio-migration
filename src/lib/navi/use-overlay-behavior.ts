import { useEffect, useRef, type RefObject } from "react";
import { lockBackground, unlockBackground } from "@/lib/navi/overlay-lock";

type ActiveOverlay = {
  root: HTMLElement | null;
  hadInert: boolean;
  ariaHidden: string | null;
};

const activeOverlays: ActiveOverlay[] = [];

function restoreOverlayRoot(overlay: ActiveOverlay) {
  if (overlay.hadInert) {
    overlay.root?.setAttribute("inert", "");
  } else {
    overlay.root?.removeAttribute("inert");
  }
  if (overlay.ariaHidden === null) {
    overlay.root?.removeAttribute("aria-hidden");
  } else {
    overlay.root?.setAttribute("aria-hidden", overlay.ariaHidden);
  }
}

function syncOverlayRoots() {
  activeOverlays.forEach((overlay, index) => {
    if (index === activeOverlays.length - 1) {
      restoreOverlayRoot(overlay);
      return;
    }
    overlay.root?.setAttribute("inert", "");
    overlay.root?.setAttribute("aria-hidden", "true");
  });
}

function registerOverlay(root: HTMLElement | null) {
  const overlay: ActiveOverlay = {
    root,
    hadInert: root?.hasAttribute("inert") ?? false,
    ariaHidden: root?.getAttribute("aria-hidden") ?? null,
  };
  activeOverlays.push(overlay);
  syncOverlayRoots();
  lockBackground();
  return overlay;
}

function isTopOverlay(overlay: ActiveOverlay) {
  return activeOverlays.at(-1) === overlay;
}

function unregisterOverlay(overlay: ActiveOverlay) {
  const wasTop = isTopOverlay(overlay);
  const index = activeOverlays.indexOf(overlay);
  if (index !== -1) activeOverlays.splice(index, 1);
  restoreOverlayRoot(overlay);
  syncOverlayRoots();
  unlockBackground();
  return wasTop;
}

/**
 * Shared Navi overlay behavior: the topmost overlay owns Escape and the focus
 * trap, underlying overlays are isolated, the minisite stays locked, and focus
 * returns to the trigger as each layer closes.
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
    const overlay = registerOverlay(
      containerRef.current?.closest<HTMLElement>(".nv-overlay-root") ?? null,
    );
    initialFocusRef?.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.defaultPrevented || !isTopOverlay(overlay)) return;
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
      const wasTop = unregisterOverlay(overlay);
      if (wasTop) trigger?.focus?.();
    };
  }, [open, containerRef, initialFocusRef]);
}
