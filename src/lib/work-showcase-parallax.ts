/** Copy drifts opposite media for split-depth scroll parallax on the active card. */
export const WORK_SHOWCASE_COPY_PARALLAX_PX = 7;
export const WORK_SHOWCASE_MEDIA_PARALLAX_PX = 14;

/** Normalized offset in [-1, 1] from viewport center. 0 = card centered. */
export function getActiveParallaxOffset(item: HTMLElement): number {
  const rect = item.getBoundingClientRect();
  const viewportCenter = window.innerHeight * 0.5;
  const itemCenter = rect.top + rect.height * 0.5;
  const normalized = (itemCenter - viewportCenter) / (window.innerHeight * 0.45);
  return Math.max(-1, Math.min(1, normalized));
}

export function applyActiveParallax(item: HTMLElement | null, enabled: boolean): void {
  if (!item) return;

  if (!enabled) {
    item.style.removeProperty("--parallax-copy");
    item.style.removeProperty("--parallax-media");
    return;
  }

  const offset = getActiveParallaxOffset(item);
  item.style.setProperty(
    "--parallax-copy",
    `${(offset * -WORK_SHOWCASE_COPY_PARALLAX_PX).toFixed(2)}px`,
  );
  item.style.setProperty(
    "--parallax-media",
    `${(offset * WORK_SHOWCASE_MEDIA_PARALLAX_PX).toFixed(2)}px`,
  );
}

export function clearParallax(items: NodeListOf<HTMLElement>): void {
  items.forEach((item) => {
    item.style.removeProperty("--parallax-copy");
    item.style.removeProperty("--parallax-media");
  });
}
