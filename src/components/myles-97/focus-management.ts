type TabKeyEvent = {
  key: string;
  shiftKey: boolean;
  preventDefault: () => void;
};

const focusableSelector = [
  "button:not([disabled])",
  "a[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export function focusFirstAvailable(container: HTMLElement | null): boolean {
  const first = container?.querySelector<HTMLElement>(focusableSelector);
  if (!first) return false;
  first.focus();
  return true;
}

export function containTabFocus(
  event: TabKeyEvent,
  container: HTMLElement | null,
): void {
  if (event.key !== "Tab" || !container) return;

  const focusable = Array.from(
    container.querySelectorAll<HTMLElement>(focusableSelector),
  );
  if (focusable.length === 0) {
    event.preventDefault();
    container.focus();
    return;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement;
  if (event.shiftKey && (active === first || !container.contains(active))) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && (active === last || !container.contains(active))) {
    event.preventDefault();
    first.focus();
  }
}
