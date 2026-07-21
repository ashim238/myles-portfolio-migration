"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  NAVI_PRIMITIVES,
  NAVI_SEMANTIC,
  NAVI_SPACING,
  NAVI_TYPE,
} from "@/lib/navi/tokens";

/* ── Copy-to-clipboard helper ─────────────────────────── */

function useCopyToClipboard() {
  const [copied, setCopied] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [failure, setFailure] = useState<{ value: string } | null>(null);
  const copy = useCallback(async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      setFailure(null);
      setFeedback(`Copied ${value}.`);
      setTimeout(() => setCopied(null), 1400);
    } catch {
      setCopied(null);
      setFailure({ value });
      setFeedback(`Could not copy ${value}. The hex value is selected for manual copy.`);
    }
  }, []);
  return { copied, failure, feedback, copy };
}

/* ── Color specimen ───────────────────────────────────── */

export function NaviColorSpecimen() {
  const { copied, failure, feedback, copy } = useCopyToClipboard();
  const fallbackRef = useRef<HTMLInputElement>(null);
  const feedbackId = useId();

  useEffect(() => {
    if (!failure) return;
    fallbackRef.current?.focus();
    fallbackRef.current?.select();
  }, [failure]);

  const primitives = Object.entries(NAVI_PRIMITIVES) as [string, string][];
  const semantic = Object.entries(NAVI_SEMANTIC) as [string, string][];

  return (
    <div style={{ display: "grid", gap: "var(--nv-sp-lg)", width: "100%" }}>
      <div>
        <p className="nv-type-label" style={{ marginBottom: "var(--nv-sp-xs)" }}>
          Brand primitives
        </p>
        <ul className="nv-swatches" role="list" data-testid="nv-color-primitives">
          {primitives.map(([name, hex]) => (
            <li key={name}>
              <button
                type="button"
                className={`nv-swatch${copied === hex ? " nv-swatch--copied" : ""}`}
                onClick={() => copy(hex)}
                aria-label={`Copy ${name} ${hex}`}
              >
                <span
                  className="nv-swatch-chip"
                  style={{ background: hex }}
                />
                <span className="nv-swatch-meta">
                  <span className="nv-swatch-name">{name}</span>
                  <span className="nv-swatch-hex">
                    {copied === hex ? "Copied" : hex}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="nv-type-label" style={{ marginBottom: "var(--nv-sp-xs)" }}>
          Semantic aliases
        </p>
        <ul
          className="nv-swatches"
          role="list"
          data-testid="nv-color-semantic"
          style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}
        >
          {semantic.map(([name, hex]) => (
            <li key={name}>
              <button
                type="button"
                className={`nv-swatch${copied === hex ? " nv-swatch--copied" : ""}`}
                onClick={() => copy(hex)}
                aria-label={`Copy ${name} ${hex}`}
              >
                <span
                  className="nv-swatch-chip"
                  style={{ background: hex }}
                />
                <span className="nv-swatch-meta">
                  <span className="nv-swatch-name">{name}</span>
                  <span className="nv-swatch-hex">
                    {copied === hex ? "Copied" : hex}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div
        className="nv-copy-recovery"
        data-active={feedback ? "true" : undefined}
      >
        <p
          className={`nv-specimen-note nv-copy-feedback${feedback ? "" : " nv-sr-only"}`}
          id={feedbackId}
          role="status"
          aria-live="polite"
          aria-atomic="true"
          aria-label="Clipboard feedback"
        >
          {feedback}
        </p>
        {failure ? (
          <input
            ref={fallbackRef}
            type="text"
            className="nv-copy-fallback"
            aria-describedby={feedbackId}
            aria-label="Manual hex value"
            readOnly
            value={failure.value}
          />
        ) : null}
      </div>
    </div>
  );
}

/* ── Type specimen ────────────────────────────────────── */

const TYPE_SAMPLES: Record<keyof typeof NAVI_TYPE, string> = {
  display: "Neighborhood-led travel",
  title: "Welcome to Manhattan",
  body: "Curated for your mood today",
  caption: "Supporting copy at 0.85 rem",
};

export function NaviTypeSpecimen() {
  const entries = Object.entries(NAVI_TYPE) as [keyof typeof NAVI_TYPE, (typeof NAVI_TYPE)[keyof typeof NAVI_TYPE]][];

  return (
    <div className="nv-type-grid" data-testid="nv-type-grid" style={{ width: "100%" }}>
      {entries.map(([role, spec]) => (
        <div key={role} className="nv-type-cell">
          <span className="nv-type-label">
            {role} · {spec.family.split(",")[0]} · {spec.weight} · {spec.size}
          </span>
          <p
            className="nv-type-sample"
            style={{
              fontFamily: spec.family,
              fontWeight: spec.weight,
              fontSize: spec.size,
              lineHeight: spec.line,
            }}
          >
            {TYPE_SAMPLES[role]}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ── Spacing specimen ─────────────────────────────────── */

export function NaviSpacingSpecimen() {
  const max = NAVI_SPACING[NAVI_SPACING.length - 1].px;

  return (
    <div
      className="nv-spacing-table"
      role="table"
      aria-label="4px spacing scale"
      data-testid="nv-spacing-table"
      style={{ width: "100%" }}
    >
      {NAVI_SPACING.map((row) => (
        <div key={row.token} className="nv-spacing-row" role="row">
          <span className="nv-spacing-token" role="cell">
            {row.token}
          </span>
          <span className="nv-spacing-px" role="cell">
            {row.px}px
          </span>
          <span className="nv-spacing-bar-wrap" role="cell">
            <span
              className="nv-spacing-bar"
              style={{ width: `${(row.px / max) * 100}%` }}
            />
          </span>
        </div>
      ))}
    </div>
  );
}
