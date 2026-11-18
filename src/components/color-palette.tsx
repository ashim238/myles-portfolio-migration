"use client";

import { useRef, useState } from "react";

type ColorPaletteProps = {
  colors: string[];
};

type CopyState =
  | { status: "idle" }
  | { status: "copied" | "error"; index: number; value: string };

export function ColorPalette({ colors }: ColorPaletteProps) {
  const [copyState, setCopyState] = useState<CopyState>({ status: "idle" });

  const latestRequest = useRef(0);

  async function handleCopy(hex: string, index: number) {
    const request = ++latestRequest.current;
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard unavailable");
      }
      await navigator.clipboard.writeText(hex);
      if (request !== latestRequest.current) return;
      setCopyState({ status: "copied", index, value: hex });
    } catch {
      if (request !== latestRequest.current) return;
      setCopyState({ status: "error", index, value: hex });
    }
  }

  const statusMessage =
    copyState.status === "copied"
      ? `Copied ${copyState.value}.`
      : copyState.status === "error"
        ? `Copy blocked in this browser. Select ${copyState.value} to copy it manually.`
        : "";

  return (
    <div className="color-palette" data-copy-state={copyState.status}>
      <p className="color-palette-hint">Select a color to copy its hex code.</p>
      {colors.map((hex, i) => (
        <button
          key={hex}
          type="button"
          className={`color-swatch${copyState.status !== "idle" && copyState.index === i ? ` color-swatch--${copyState.status}` : ""}`}
          style={{ "--swatch-color": hex } as React.CSSProperties}
          onClick={() => handleCopy(hex, i)}
          aria-label={`Copy color ${hex}`}
        >
          <span className="color-swatch-circle" />
          <span className="color-swatch-label">
            {copyState.status === "copied" && copyState.index === i ? "✓ Copied" : hex}
          </span>
        </button>
      ))}
      <p
        className={`color-palette-status${
          copyState.status !== "idle"
            ? " color-palette-status--visible"
            : " sr-only"
        }`}
        role="status"
        aria-live="polite"
      >
        {statusMessage}
      </p>
    </div>
  );
}
