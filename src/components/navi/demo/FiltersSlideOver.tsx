"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  type Filters,
  type PriceBand,
  type DurationBand,
  type GroupBand,
  DEFAULT_FILTERS,
  activeCount,
} from "@/components/navi/demo/filters";
import { OverlayRoot } from "@/components/navi/demo/OverlayRoot";
import { useOverlayBehavior } from "@/lib/navi/use-overlay-behavior";

const PRICE_OPTIONS: { id: PriceBand; label: string }[] = [
  { id: "any", label: "Any" },
  { id: "under30", label: "Under $30" },
  { id: "30to60", label: "$30 to $60" },
  { id: "over60", label: "Over $60" },
];

const DURATION_OPTIONS: { id: DurationBand; label: string }[] = [
  { id: "any", label: "Any" },
  { id: "under2h", label: "Under 2h" },
  { id: "halfDay", label: "Half day" },
  { id: "fullDay", label: "Full day" },
];

const GROUP_OPTIONS: { id: GroupBand; label: string }[] = [
  { id: "any", label: "Any" },
  { id: "small", label: "Small (up to 8)" },
  { id: "large", label: "Large (9+)" },
];

function PillToggleGroup<T extends string>({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset className="nv-slide-over-group">
      <legend className="nv-slide-over-legend">{legend}</legend>
      <div className="nv-slide-over-pills">
        {options.map((o) => {
          const active = o.id === value;
          return (
            <button
              key={o.id}
              type="button"
              aria-pressed={active}
              className={`nv-slide-over-pill${active ? " is-active" : ""}`}
              onClick={() => onChange(o.id)}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function MultiChipGroup({
  legend,
  options,
  values,
  onToggle,
}: {
  legend: string;
  options: string[];
  values: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <fieldset className="nv-slide-over-group">
      <legend className="nv-slide-over-legend">{legend}</legend>
      <div className="nv-slide-over-pills">
        {options.map((o) => {
          const active = values.includes(o);
          return (
            <button
              key={o}
              type="button"
              aria-pressed={active}
              className={`nv-slide-over-pill${active ? " is-active" : ""}`}
              onClick={() => onToggle(o)}
            >
              {o}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function FiltersSlideOver({
  open,
  initial,
  languageOptions,
  neighborhoodOptions,
  matchCountFor,
  onApply,
  onClose,
}: {
  open: boolean;
  initial: Filters;
  languageOptions: string[];
  neighborhoodOptions: string[];
  matchCountFor: (draft: Filters) => number;
  onApply: (next: Filters) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<Filters>(initial);
  const headingId = useId();
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (open && !wasOpenRef.current) setDraft(initial);
    wasOpenRef.current = open;
  }, [open, initial]);

  useOverlayBehavior({
    open,
    onClose,
    containerRef: dialogRef,
    initialFocusRef: closeBtnRef,
  });

  if (!open) return null;

  const count = matchCountFor(draft);

  return createPortal(
    <OverlayRoot>
      <div className="nv-slide-over-backdrop" onClick={onClose} aria-hidden="true" />
      <div
        ref={dialogRef}
        className="nv-slide-over"
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
      >
        <header className="nv-slide-over-head">
          <h2 id={headingId}>Filters</h2>
          <button
            type="button"
            ref={closeBtnRef}
            className="nv-slide-over-close"
            aria-label="Close filters"
            onClick={onClose}
          >
            ✕
          </button>
        </header>
        <div className="nv-slide-over-body">
          <PillToggleGroup
            legend="Price"
            options={PRICE_OPTIONS}
            value={draft.price}
            onChange={(price) => setDraft((d) => ({ ...d, price }))}
          />
          <PillToggleGroup
            legend="Duration"
            options={DURATION_OPTIONS}
            value={draft.duration}
            onChange={(duration) => setDraft((d) => ({ ...d, duration }))}
          />
          <PillToggleGroup
            legend="Group size"
            options={GROUP_OPTIONS}
            value={draft.group}
            onChange={(group) => setDraft((d) => ({ ...d, group }))}
          />
          <MultiChipGroup
            legend="Language"
            options={languageOptions}
            values={draft.languages}
            onToggle={(v) =>
              setDraft((d) => ({
                ...d,
                languages: d.languages.includes(v)
                  ? d.languages.filter((x) => x !== v)
                  : [...d.languages, v],
              }))
            }
          />
          <MultiChipGroup
            legend="Neighborhood"
            options={neighborhoodOptions}
            values={draft.neighborhoods}
            onToggle={(v) =>
              setDraft((d) => ({
                ...d,
                neighborhoods: d.neighborhoods.includes(v)
                  ? d.neighborhoods.filter((x) => x !== v)
                  : [...d.neighborhoods, v],
              }))
            }
          />
        </div>
        <footer className="nv-slide-over-foot">
          <button
            type="button"
            className="nv-slide-over-clear"
            onClick={() => setDraft(DEFAULT_FILTERS)}
          >
            Clear all
          </button>
          <button
            type="button"
            className="nv-slide-over-apply"
            onClick={() => {
              onApply(draft);
              onClose();
            }}
          >
            Show {count} {count === 1 ? "experience" : "experiences"}
            {activeCount(draft) > 0 ? ` (${activeCount(draft)} filters)` : ""}
          </button>
        </footer>
      </div>
    </OverlayRoot>,
    document.body,
  );
}
