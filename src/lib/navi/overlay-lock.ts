/**
 * Refcounted background lock for overlays (the date modal and the mobile booking
 * sheet) that can nest. On the first lock it freezes body scroll and marks the
 * minisite shell (`.nv-ui`) inert, so only the body-portaled overlay stays
 * reachable. On the last unlock it restores both.
 *
 * Refcounting matters because the mobile flow opens the date modal on top of the
 * booking sheet. Without it, closing the modal would unfreeze scroll and clear
 * inert while the sheet underneath is still open.
 */
let count = 0;
let prevOverflow = "";

export function lockBackground() {
  if (count === 0) {
    prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.querySelector(".nv-ui")?.setAttribute("inert", "");
  }
  count += 1;
}

export function unlockBackground() {
  count = Math.max(0, count - 1);
  if (count === 0) {
    document.body.style.overflow = prevOverflow;
    document.querySelector(".nv-ui")?.removeAttribute("inert");
  }
}
