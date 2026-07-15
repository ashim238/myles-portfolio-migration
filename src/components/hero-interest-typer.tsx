"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const PHRASES = [
  "sweats the empty states and the error copy.",
  "makes his own roti from scratch.",
  "counts down to each Absolute Batman drop.",
];

const GLYPHS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#%&*/<>+=~";
const FRAME_MS = 38;
const LEAD_TICKS = 6;
const HOLD_TICKS = 24;
const CLEAR_TICKS = 4;

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

function decodeFrame(phrase: string, resolved: number) {
  return [...phrase]
    .map((character, index) =>
      index < resolved || character === " " ? character : randomGlyph(),
    )
    .join("");
}

function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function HeroInterestTyper() {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false,
  );
  const [display, setDisplay] = useState("");
  const [complete, setComplete] = useState(false);
  const visibleDisplay = reducedMotion ? PHRASES[0] : display;
  const visibleComplete = reducedMotion || complete;

  useEffect(() => {
    if (reducedMotion) return;

    let phraseIndex = 0;
    let resolved = -LEAD_TICKS;
    let holdTicks = 0;
    let clearTicks = 0;
    let mode: "decode" | "hold" | "clear" = "decode";

    const tick = () => {
      const phrase = PHRASES[phraseIndex];

      if (mode === "decode") {
        if (resolved >= phrase.length) {
          setDisplay(phrase);
          mode = "hold";
          holdTicks = HOLD_TICKS;
        } else {
          setDisplay(decodeFrame(phrase, resolved));
          resolved += 1;
        }
        return;
      }

      if (mode === "hold") {
        holdTicks -= 1;
        if (holdTicks > 0) return;

        if (phraseIndex === PHRASES.length - 1) {
          setComplete(true);
          window.clearInterval(interval);
          return;
        }

        mode = "clear";
        clearTicks = CLEAR_TICKS;
        setDisplay(decodeFrame(phrase, 0));
        return;
      }

      clearTicks -= 1;
      if (clearTicks <= 0) {
        phraseIndex += 1;
        resolved = -LEAD_TICKS;
        mode = "decode";
        setDisplay("");
      } else {
        setDisplay(decodeFrame(phrase, 0));
      }
    };

    tick();
    const interval = window.setInterval(tick, FRAME_MS);
    return () => window.clearInterval(interval);
  }, [reducedMotion]);

  return (
    <p className="hero-typer" aria-live="off">
      <span className="hero-typer-prefix" aria-hidden="true">
        Also: {visibleDisplay}
      </span>
      <span className="sr-only">Also {PHRASES.join(" ")}</span>
      {!visibleComplete ? (
        <span className="hero-typer-cursor" aria-hidden="true">
          |
        </span>
      ) : null}
    </p>
  );
}
