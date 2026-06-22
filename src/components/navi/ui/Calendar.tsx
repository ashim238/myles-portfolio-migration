"use client";

import { useState } from "react";
import {
  WEEKDAYS,
  buildMonthGrid,
  formatLongDate,
  formatMonthYear,
  isBeforeDay,
  isSameDay,
  startOfMonth,
  addMonths,
} from "@/lib/navi/calendar";

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

/**
 * Month calendar matching the Navi Figma calendar (node 553-6053). Selection is
 * controlled via `value`/`onChange`; the displayed month is internal state.
 * Days before `minDate` are disabled so a picker can enforce "today onward".
 */
export function Calendar({
  value,
  onChange,
  minDate,
  labelledBy,
}: {
  value: Date | null;
  onChange: (d: Date) => void;
  minDate?: Date;
  labelledBy?: string;
}) {
  const [view, setView] = useState<Date>(() =>
    startOfMonth(value ?? minDate ?? new Date()),
  );

  const weeks = buildMonthGrid(view.getFullYear(), view.getMonth());
  // Don't let the user page back into fully-past months.
  const canGoPrev = !minDate || startOfMonth(view).getTime() > startOfMonth(minDate).getTime();

  return (
    <div className="nv-cal" role="group" aria-labelledby={labelledBy}>
      <div className="nv-cal-head">
        <button
          type="button"
          className="nv-cal-nav"
          onClick={() => setView(addMonths(view, -1))}
          disabled={!canGoPrev}
          aria-label="Previous month"
        >
          <ChevronLeft />
        </button>
        <p className="nv-cal-title" aria-live="polite">
          {formatMonthYear(view)}
        </p>
        <button
          type="button"
          className="nv-cal-nav"
          onClick={() => setView(addMonths(view, 1))}
          aria-label="Next month"
        >
          <ChevronRight />
        </button>
      </div>
      <div className="nv-cal-divider" aria-hidden="true" />
      <div className="nv-cal-weekdays" aria-hidden="true">
        {WEEKDAYS.map((w, i) => (
          <span key={i} className="nv-cal-weekday">
            {w}
          </span>
        ))}
      </div>
      <div className="nv-cal-grid">
        {weeks.map((week, wi) => (
          <div className="nv-cal-week" key={wi}>
            {week.map((cell, ci) => {
              if (!cell) {
                return <span key={ci} className="nv-cal-cell nv-cal-cell--empty" aria-hidden="true" />;
              }
              const selected = isSameDay(cell.date, value);
              const disabled = minDate ? isBeforeDay(cell.date, minDate) : false;
              return (
                <button
                  key={ci}
                  type="button"
                  className={`nv-cal-cell${selected ? " nv-cal-cell--selected" : ""}`}
                  aria-pressed={selected}
                  aria-label={formatLongDate(cell.date)}
                  disabled={disabled}
                  onClick={() => onChange(cell.date)}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
