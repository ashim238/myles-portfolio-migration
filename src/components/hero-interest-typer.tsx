"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { CURSOR_BLINK_MS, PAUSE_AFTER_FULL_MS } from "@/lib/motion";
import { HOME_ENTRANCE_COMPLETE } from "@/lib/home-intro";

const PHRASES = [
  "sweats the empty states and the error copy.",
  "is Auto Layout's biggest fan.",
  "makes his own roti from scratch.",
  "counts down to each Absolute Batman drop.",
  "adores the MTA map redesign.",
];

const STATIC_INTERESTS = PHRASES.join(" · ");

// Decode/scramble timing. Each tick re-randomizes the still-encrypted glyphs;
// a resolve wave sweeps left→right locking real characters into place.
const SCRAMBLE_FRAME_MS = 42; // flicker refresh + reveal cadence
const SCRAMBLE_LEAD = 8; // ticks the whole line shimmers before the wave starts
const SCRAMBLE_OUT_TICKS = 5; // ticks the settled line re-encrypts on exit
const PAUSE_AFTER_CLEAR_TICKS = 3; // beat of empty space between phrases

// Curated glyph pool — mostly latin + symbols, a little katakana and block
// texture so it reads as "decoding" without becoming visual noise.
const GLYPHS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#%&*/<>+=~ｱｶｻﾀﾅﾊﾏﾖ█▓▒░".split(
    "",
  );

function randomGlyph(): string {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

/**
 * Render a phrase mid-decode: characters before `resolved` are locked to their
 * real value, everything after flickers as a random glyph. Spaces never
 * scramble so word shapes stay legible while the line resolves.
 */
function decodeFrame(phrase: string, resolved: number): string {
  let out = "";
  for (let i = 0; i < phrase.length; i += 1) {
    const ch = phrase[i];
    out += i < resolved || ch === " " ? ch : randomGlyph();
  }
  return out;
}

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
    // Start behind zero so the whole line shimmers as noise before resolving.
    let resolved = -SCRAMBLE_LEAD;
    let mode: "in" | "hold" | "out" | "clear" = "in";
    let holdTicks = 0;
    let modeTicks = 0;
    const holdTarget = Math.max(1, Math.round(PAUSE_AFTER_FULL_MS / SCRAMBLE_FRAME_MS));

    const tick = () => {
      if (cancelled) return;
      const phrase = PHRASES[phraseIndex % PHRASES.length];

      if (mode === "in") {
        if (resolved >= phrase.length) {
          setAnimated(phrase); // fully decoded — lock the clean line
          mode = "hold";
          holdTicks = holdTarget;
        } else {
          setAnimated(decodeFrame(phrase, resolved));
          resolved += 1;
        }
      } else if (mode === "hold") {
        holdTicks -= 1;
        if (holdTicks <= 0) {
          mode = "out";
          modeTicks = SCRAMBLE_OUT_TICKS;
        }
      } else if (mode === "out") {
        // Re-encrypt the settled line into noise before clearing it.
        setAnimated(decodeFrame(phrase, 0));
        modeTicks -= 1;
        if (modeTicks <= 0) {
          mode = "clear";
          modeTicks = PAUSE_AFTER_CLEAR_TICKS;
          setAnimated("");
        }
      } else {
        modeTicks -= 1;
        if (modeTicks <= 0) {
          phraseIndex += 1;
          resolved = -SCRAMBLE_LEAD;
          mode = "in";
        }
      }
    };

    tick();
    const id = setInterval(tick, SCRAMBLE_FRAME_MS);

    return () => {
      cancelled = true;
      clearInterval(id);
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
