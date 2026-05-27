"use client";

import { useState, useCallback } from "react";

type ColorPaletteProps = {
  colors: string[];
};

export function ColorPalette({ colors }: ColorPaletteProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = useCallback((hex: string, index: number) => {
    navigator.clipboard.writeText(hex).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1400);
    });
  }, []);

  return (
    <div className="color-palette">
      {colors.map((hex, i) => (
        <button
          key={hex}
          className="color-swatch"
          style={{ "--swatch-color": hex } as React.CSSProperties}
          onClick={() => handleCopy(hex, i)}
          aria-label={`Copy color ${hex}`}
        >
          <span className="color-swatch-circle" />
          <span className="color-swatch-label">
            {copiedIndex === i ? "Copied" : hex}
          </span>
        </button>
      ))}
    </div>
  );
}
