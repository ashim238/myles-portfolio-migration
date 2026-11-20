"use client";

import { useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce)";

function subscribe(update: () => void) {
  const media = window.matchMedia?.(query);
  media?.addEventListener("change", update);
  return () => media?.removeEventListener("change", update);
}

export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => Boolean(window.matchMedia?.(query)?.matches),
    () => false,
  );
}
