/**
 * Refcounted background lock for Navi overlays that can nest. On the first lock
 * it freezes body scroll and marks the minisite shell (`.nv-ui`) inert and
 * hidden from assistive technology, so only body-portaled overlays stay
 * reachable. On the last unlock it restores the previous state.
 *
 * Refcounting matters because the mobile flow opens the date modal on top of the
 * booking sheet. Without it, closing the modal would unfreeze scroll and clear
 * inert while the sheet underneath is still open.
 */
let count = 0;
let prevOverflow = "";
let background: Element | null = null;
let prevAriaHidden: string | null = null;

export function lockBackground() {
  if (count === 0) {
    prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    background = document.querySelector(".nv-ui");
    prevAriaHidden = background?.getAttribute("aria-hidden") ?? null;
    background?.setAttribute("inert", "");
    background?.setAttribute("aria-hidden", "true");
  }
  count += 1;
}

export function unlockBackground() {
  count = Math.max(0, count - 1);
  if (count === 0) {
    document.body.style.overflow = prevOverflow;
    background?.removeAttribute("inert");
    if (prevAriaHidden === null) {
      background?.removeAttribute("aria-hidden");
    } else {
      background?.setAttribute("aria-hidden", prevAriaHidden);
    }
    background = null;
    prevAriaHidden = null;
  }
}
