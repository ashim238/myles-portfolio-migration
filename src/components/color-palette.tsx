"use client";

import { useState } from "react";

type ColorPaletteProps = {
  colors: string[];
};

type CopyState =
  | { status: "idle" }
  | { status: "copied" | "error"; index: number; value: string };

export function ColorPalette({ colors }: ColorPaletteProps) {
  const [copyState, setCopyState] = useState<CopyState>({ status: "idle" });

  async function handleCopy(hex: string, index: number) {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard unavailable");
      }
      await navigator.clipboard.writeText(hex);
      setCopyState({ status: "copied", index, value: hex });
    } catch {
      setCopyState({ status: "error", index, value: hex });
    }
  }

  const statusMessage =
    copyState.status === "copied"
      ? `Copied ${copyState.value}.`
      : copyState.status === "error"
        ? `Clipboard unavailable. Select ${copyState.value} and copy it manually.`
        : "";

  return (
    <div className="color-palette" data-copy-state={copyState.status}>
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
          <span className="color-swatch-label">{hex}</span>
        </button>
      ))}
      <p
        className={`color-palette-status${
          copyState.status === "error"
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
