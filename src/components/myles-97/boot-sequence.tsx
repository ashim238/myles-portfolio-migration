"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

export const MYLES97_BOOT_MAX_MS = 1450;
export const MYLES97_BOOT_PROGRESS_SEGMENTS = 16;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

type BootSequenceProps = {
  eligible: boolean;
  reduceMotion?: boolean;
  onComplete: () => void;
  onActiveChange?: (active: boolean) => void;
};

function subscribeReducedMotion(onChange: () => void) {
  const media = window.matchMedia(REDUCED_MOTION_QUERY);

  if (typeof media.addEventListener === "function") {
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }

  if (typeof media.addListener === "function") {
    media.addListener(onChange);
    return () => media.removeListener(onChange);
  }

  return () => undefined;
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export function BootSequence({
  eligible,
  reduceMotion = false,
  onComplete,
  onActiveChange,
}: BootSequenceProps) {
  const [dismissed, setDismissed] = useState(false);
  const completed = useRef(false);
  const dismissBoot = useRef<() => void>(() => undefined);
  const systemReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const shouldBypass = reduceMotion || systemReducedMotion;

  useEffect(() => {
    if (!eligible || dismissed) return;

    if (shouldBypass) {
      onActiveChange?.(false);
      if (!completed.current) {
        completed.current = true;
        onComplete();
      }
      return;
    }

    completed.current = false;
    onActiveChange?.(true);

    const finish = () => {
      if (completed.current) return;
      completed.current = true;
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown, true);
      setDismissed(true);
      onComplete();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish();
    };
    dismissBoot.current = finish;
    const timer = window.setTimeout(finish, MYLES97_BOOT_MAX_MS);
    window.addEventListener("keydown", onKeyDown, true);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown, true);
      onActiveChange?.(false);
    };
  }, [dismissed, eligible, onActiveChange, onComplete, shouldBypass]);

  if (!eligible || dismissed || shouldBypass) return null;

  return (
    <div className="myles97-boot" role="dialog" aria-modal="true" aria-label="Starting Myles 98">
      <div className="myles97-boot-panel">
        <div className="myles97-boot-post" aria-hidden="true">
          <p>MDT BIOS v0.98</p>
          <p>Copyright Myles Ashitey 1998–2026</p>
          <p>Memory test: 640K OK</p>
          <p>Initializing creative tools...</p>
        </div>
        <div className="myles97-boot-identity" aria-hidden="true">
          <span className="myles97-boot-mark">MDT</span>
          <strong className="myles97-boot-name">Myles Designs Things</strong>
        </div>
        <div className="myles97-boot-progress" aria-hidden="true">
          {Array.from({ length: MYLES97_BOOT_PROGRESS_SEGMENTS }, (_, index) => (
            <span
              key={index}
              className="myles97-boot-progress-segment"
              style={{ animationDelay: `${480 + index * 56}ms` }}
            />
          ))}
        </div>
        <p className="myles97-boot-loading">Loading selected work...</p>
        <button
          type="button"
          className="myles97-boot-skip"
          autoFocus
          onPointerDown={(event) => {
            event.preventDefault();
            dismissBoot.current();
          }}
          onClick={() => dismissBoot.current()}
        >
          <span>Skip boot</span>
          <kbd aria-hidden="true">Esc</kbd>
        </button>
      </div>
    </div>
  );
}
