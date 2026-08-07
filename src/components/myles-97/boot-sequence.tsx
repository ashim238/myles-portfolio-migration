"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export const MYLES97_BOOT_MAX_MS = 1450;

type BootSequenceProps = {
  eligible: boolean;
  reduceMotion?: boolean;
  onComplete: () => void;
};

export function BootSequence({
  eligible,
  reduceMotion = false,
  onComplete,
}: BootSequenceProps) {
  const [visible, setVisible] = useState(eligible);
  const completed = useRef(false);

  useEffect(() => {
    if (!eligible) {
      completed.current = false;
      setVisible(false);
      return;
    }

    completed.current = false;
    setVisible(true);
    let timer: number | undefined;

    const finish = () => {
      if (completed.current) return;
      completed.current = true;
      if (timer !== undefined) window.clearTimeout(timer);
      window.removeEventListener("pointerdown", finish, true);
      window.removeEventListener("keydown", finish, true);
      setVisible(false);
      onComplete();
    };

    if (
      reduceMotion ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      finish();
      return;
    }

    window.addEventListener("pointerdown", finish, {
      once: true,
      capture: true,
    });
    window.addEventListener("keydown", finish, {
      once: true,
      capture: true,
    });
    timer = window.setTimeout(finish, MYLES97_BOOT_MAX_MS);

    return () => {
      if (timer !== undefined) window.clearTimeout(timer);
      window.removeEventListener("pointerdown", finish, true);
      window.removeEventListener("keydown", finish, true);
    };
  }, [eligible, onComplete, reduceMotion]);

  if (!eligible || !visible) return null;

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
