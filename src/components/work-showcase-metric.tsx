"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  CURSOR_BLINK_MS,
  DELETE_MS,
  PAUSE_AFTER_CLEAR_MS,
  PAUSE_AFTER_FULL_MS,
  TYPE_MS,
} from "@/lib/motion";

function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot(): boolean {
  return false;
}

type WorkShowcaseMetricProps = {
  phrases: string[];
  isActive: boolean;
};

export function WorkShowcaseMetric({ phrases, isActive }: WorkShowcaseMetricProps) {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getReducedMotionServerSnapshot
  );
  const [animated, setAnimated] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  const staticText = phrases.join(" · ");
  const display = reducedMotion ? staticText : animated;

  useEffect(() => {
    if (!isActive || reducedMotion || phrases.length === 0) {
      setAnimated("");
      return;
    }

    let cancelled = false;
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const step = () => {
      if (cancelled) return;
      const phrase = phrases[phraseIndex % phrases.length];

      if (!deleting) {
        if (charIndex < phrase.length) {
          charIndex += 1;
          setAnimated(phrase.slice(0, charIndex));
          timeoutId = setTimeout(step, TYPE_MS);
        } else {
          timeoutId = setTimeout(() => {
            deleting = true;
            step();
          }, PAUSE_AFTER_FULL_MS);
        }
      } else if (charIndex > 0) {
        charIndex -= 1;
        setAnimated(phrase.slice(0, charIndex));
        timeoutId = setTimeout(step, DELETE_MS);
      } else {
        deleting = false;
        phraseIndex += 1;
        timeoutId = setTimeout(step, PAUSE_AFTER_CLEAR_MS);
      }
    };

    setAnimated("");
    step();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [isActive, phrases, reducedMotion]);

  useEffect(() => {
    if (!isActive || reducedMotion) return;
    const id = setInterval(() => setShowCursor((c) => !c), CURSOR_BLINK_MS);
    return () => clearInterval(id);
  }, [isActive, reducedMotion]);

  if (phrases.length === 0) {
    return null;
  }

  return (
    <p className="work-showcase-metric" aria-live="polite">
      <span className="work-showcase-metric-text" aria-hidden={!reducedMotion}>
        {display}
      </span>
      <span className="sr-only">{staticText}</span>
      {!reducedMotion && isActive ? (
        <span
          className={`work-showcase-metric-cursor${showCursor ? " work-showcase-metric-cursor--on" : ""}`}
          aria-hidden
        >
          |
        </span>
      ) : null}
    </p>
  );
}
