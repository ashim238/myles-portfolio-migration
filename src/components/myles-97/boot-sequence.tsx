"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

export const MYLES97_BOOT_MAX_MS = 1450;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

type BootSequenceProps = {
  eligible: boolean;
  reduceMotion?: boolean;
  onComplete: () => void;
};

function subscribeReducedMotion(onChange: () => void) {
  const media = window.matchMedia(REDUCED_MOTION_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
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
}: BootSequenceProps) {
  const [dismissed, setDismissed] = useState(false);
  const completed = useRef(false);
  const systemReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const shouldBypass = reduceMotion || systemReducedMotion;

  useEffect(() => {
    if (!eligible || dismissed) return;

    if (shouldBypass) {
      if (!completed.current) {
        completed.current = true;
        onComplete();
      }
      return;
    }

    completed.current = false;

    const finish = () => {
      if (completed.current) return;
      completed.current = true;
      window.clearTimeout(timer);
      window.removeEventListener("pointerdown", finish, true);
      window.removeEventListener("keydown", finish, true);
      setDismissed(true);
      onComplete();
    };
    const timer = window.setTimeout(finish, MYLES97_BOOT_MAX_MS);

    window.addEventListener("pointerdown", finish, {
      once: true,
      capture: true,
    });
    window.addEventListener("keydown", finish, {
      once: true,
      capture: true,
    });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointerdown", finish, true);
      window.removeEventListener("keydown", finish, true);
    };
  }, [dismissed, eligible, onComplete, shouldBypass]);

  if (!eligible || dismissed || shouldBypass) return null;

  return (
    <div className="myles97-boot" role="status" aria-label="Starting Myles 98">
      <div className="myles97-boot-panel">
        <div className="myles97-boot-mark" aria-hidden="true">
          <span className="myles97-boot-pixels" />
          <Image
            className="myles97-boot-logo"
            src="/logomark.svg"
            alt=""
            width={96}
            height={96}
            priority
          />
        </div>
        <strong className="myles97-boot-name">Myles 98</strong>
        <div className="myles97-boot-progress" aria-hidden="true">
          <span />
        </div>
        <p>Loading selected work...</p>
        <span className="myles97-boot-skip">Press any key or click to skip</span>
      </div>
    </div>
  );
}