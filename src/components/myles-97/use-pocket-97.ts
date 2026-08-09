"use client";

import { useSyncExternalStore } from "react";

export const POCKET_97_QUERY = "(max-width: 1023px), (pointer: coarse)";

function getMediaQuery() {
  return window.matchMedia(POCKET_97_QUERY);
}

function subscribe(onStoreChange: () => void) {
  const media = getMediaQuery();
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function getSnapshot() {
  return getMediaQuery().matches;
}

function getServerSnapshot() {
  return false;
}

export function usePocket97() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
