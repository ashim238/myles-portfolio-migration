"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const STATEMENTS = [
  "I design digital products and stay close through the build.",
  "I sweat the empty states and the error copy.",
  "I make my own roti from scratch.",
  "I count down to each Absolute Batman drop.",
] as const;

const GLYPHS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#%&*/<>+=~";
const FRAME_MS = 38;
const INITIAL_HOLD_TICKS = 30;
const HOLD_TICKS = 24;
const SCRAMBLE_TICKS = 4;
const DECODE_TICKS = 12;

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

export function HeroStatementDecoder() {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false,
  );
  const [display, setDisplay] = useState<string>(STATEMENTS[0]);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;

    let statementIndex = 0;
    let resolved = 0;
    let holdTicks = INITIAL_HOLD_TICKS;
    let scrambleTicks = 0;
    let mode: "hold" | "scramble" | "decode" = "hold";

    const interval = window.setInterval(() => {
      const statement = STATEMENTS[statementIndex];

      if (mode === "hold") {
        holdTicks -= 1;
        if (holdTicks > 0) return;

        if (statementIndex === STATEMENTS.length - 1) {
          setComplete(true);
          window.clearInterval(interval);
          return;
        }

        mode = "scramble";
        scrambleTicks = SCRAMBLE_TICKS;
        setDisplay(decodeFrame(statement, 0));
        return;
      }

      if (mode === "scramble") {
        scrambleTicks -= 1;
        if (scrambleTicks > 0) {
          setDisplay(decodeFrame(statement, 0));
          return;
        }

        statementIndex += 1;
        resolved = 0;
        mode = "decode";
        setDisplay(decodeFrame(STATEMENTS[statementIndex], resolved));
        return;
      }

      const nextStatement = STATEMENTS[statementIndex];
      resolved += Math.ceil(nextStatement.length / DECODE_TICKS);
      setDisplay(decodeFrame(nextStatement, resolved));

      if (resolved >= nextStatement.length) {
        setDisplay(nextStatement);
        mode = "hold";
        holdTicks = HOLD_TICKS;
      }
    }, FRAME_MS);

    return () => window.clearInterval(interval);
  }, [reducedMotion]);

  const visibleDisplay = reducedMotion ? STATEMENTS[0] : display;
  const visibleComplete = reducedMotion || complete;

  return (
    <p
      className="hero-statement-decoder"
      data-testid="hero-statement-decoder"
      aria-live="off"
    >
      {STATEMENTS.map((statement) => (
        <span
          key={statement}
          className="hero-statement-decoder-sizer"
          aria-hidden="true"
        >
          {statement}
        </span>
      ))}
      <span className="hero-statement-decoder-visible" aria-hidden="true">
        {visibleDisplay}
        {!visibleComplete ? (
          <span className="hero-statement-decoder-cursor">|</span>
        ) : null}
      </span>
      <span className="sr-only">{STATEMENTS.join(" ")}</span>
    </p>
  );
}
