"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  CURSOR_BLINK_MS,
  DELETE_MS,
  PAUSE_AFTER_CLEAR_MS,
  PAUSE_AFTER_FULL_MS,
  TYPE_MS,
} from "@/lib/motion";
import { HOME_ENTRANCE_COMPLETE } from "@/lib/home-intro";

const PHRASES = [
  "sweats the empty states and the error copy.",
  "is an avid comic reader.",
  "talks to people before opening Figma.",
  "loves to cook Jamaican cuisine.",
];

const STATIC_INTERESTS = PHRASES.join(" · ");

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

type HeroInterestTyperProps = {
  /** On homepage, wait for entrance timeline before typing */
  awaitHomeEntrance?: boolean;
};

export function HeroInterestTyper({ awaitHomeEntrance = false }: HeroInterestTyperProps) {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getReducedMotionServerSnapshot
  );
  const [animated, setAnimated] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [entranceReady, setEntranceReady] = useState(!awaitHomeEntrance);

  const display = reducedMotion ? STATIC_INTERESTS : animated;

  useEffect(() => {
    if (!awaitHomeEntrance || reducedMotion) {
      setEntranceReady(true);
      return;
    }

    const onReady = () => setEntranceReady(true);
    if (document.querySelector(".home-page.home-entrance-done")) {
      onReady();
      return;
    }

    window.addEventListener(HOME_ENTRANCE_COMPLETE, onReady, { once: true });
    return () => window.removeEventListener(HOME_ENTRANCE_COMPLETE, onReady);
  }, [awaitHomeEntrance, reducedMotion]);

  useEffect(() => {
    if (reducedMotion || !entranceReady) return;

    let cancelled = false;
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const step = () => {
      if (cancelled) return;
      const phrase = PHRASES[phraseIndex % PHRASES.length];

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

    step();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [reducedMotion, entranceReady]);

  useEffect(() => {
    if (reducedMotion || !entranceReady) return;
    const id = setInterval(() => setShowCursor((c) => !c), CURSOR_BLINK_MS);
    return () => clearInterval(id);
  }, [reducedMotion, entranceReady]);

  return (
    <p className="hero-typer" suppressHydrationWarning>
      <span className="hero-typer-text" aria-hidden="true">
        {display}
      </span>
      <span className="sr-only">{`Myles Ashitey ${STATIC_INTERESTS}`}</span>
      {!reducedMotion ? (
        <span
          className={`hero-typer-cursor${showCursor ? " hero-typer-cursor--on" : ""}`}
          aria-hidden
        >
          |
        </span>
      ) : null}
    </p>
  );
}
