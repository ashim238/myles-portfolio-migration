"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  WEEKDAYS,
  buildMonthGrid,
  formatLongDate,
  formatMonthYear,
  isBeforeDay,
  isSameDay,
  startOfMonth,
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

function dayKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function addDays(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

function dateInShiftedMonth(date: Date, amount: number): Date {
  const first = new Date(date.getFullYear(), date.getMonth() + amount, 1);
  const lastDay = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  return new Date(first.getFullYear(), first.getMonth(), Math.min(date.getDate(), lastDay));
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
  const [fallbackDate] = useState(() => new Date());
  const today = fallbackDate;
  const controlledDate = value ?? minDate ?? fallbackDate;
  const controlledDay = dayKey(controlledDate);
  const [view, setView] = useState<Date>(() => startOfMonth(controlledDate));
  const [focusedDate, setFocusedDate] = useState<Date>(() => controlledDate);
  const [lastControlledDay, setLastControlledDay] = useState(controlledDay);
  const dateRefs = useRef(new Map<string, HTMLButtonElement>());
  const focusRequested = useRef(false);

  // Reset internal navigation before rendering children when the controlled
  // selection changes. React permits this guarded same-component adjustment;
  // it avoids a stale-month frame and a cascading setState effect.
  if (controlledDay !== lastControlledDay) {
    setLastControlledDay(controlledDay);
    setFocusedDate(controlledDate);
    setView(startOfMonth(controlledDate));
  }

  const weeks = buildMonthGrid(view.getFullYear(), view.getMonth());
  // Don't let the user page back into fully-past months.
  const canGoPrev = !minDate || startOfMonth(view).getTime() > startOfMonth(minDate).getTime();

  useEffect(() => {
    if (!focusRequested.current) return;
    focusRequested.current = false;
    dateRefs.current.get(dayKey(focusedDate))?.focus();
  }, [focusedDate, view]);

  const moveFocus = (candidate: Date) => {
    const target = minDate && isBeforeDay(candidate, minDate) ? minDate : candidate;
    focusRequested.current = true;
    setFocusedDate(target);
    if (
      target.getFullYear() !== view.getFullYear() ||
      target.getMonth() !== view.getMonth()
    ) {
      setView(startOfMonth(target));
    }
  };

  const changeMonth = (amount: number, requestFocus: boolean) => {
    const candidate = dateInShiftedMonth(focusedDate, amount);
    const target = minDate && isBeforeDay(candidate, minDate) ? minDate : candidate;
    focusRequested.current = requestFocus;
    setFocusedDate(target);
    setView(startOfMonth(target));
  };

  const onDateKeyDown = (event: KeyboardEvent<HTMLButtonElement>, date: Date) => {
    let target: Date | null = null;
    if (event.key === "ArrowLeft") target = addDays(date, -1);
    else if (event.key === "ArrowRight") target = addDays(date, 1);
    else if (event.key === "ArrowUp") target = addDays(date, -7);
    else if (event.key === "ArrowDown") target = addDays(date, 7);
    else if (event.key === "Home") target = addDays(date, -date.getDay());
    else if (event.key === "End") target = addDays(date, 6 - date.getDay());
    else if (event.key === "PageUp") target = dateInShiftedMonth(date, -1);
    else if (event.key === "PageDown") target = dateInShiftedMonth(date, 1);
    if (!target) return;
    event.preventDefault();
    moveFocus(target);
  };

  return (
    <div className="nv-cal">
      <div className="nv-cal-head">
        <button
          type="button"
          className="nv-cal-nav"
          onClick={() => changeMonth(-1, false)}
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
          onClick={() => changeMonth(1, false)}
          aria-label="Next month"
        >
          <ChevronRight />
        </button>
      </div>
      <div className="nv-cal-divider" aria-hidden="true" />
      <div
        className="nv-cal-grid"
        role="grid"
        aria-labelledby={labelledBy}
        aria-label={labelledBy ? undefined : "Choose a date"}
      >
        <div className="nv-cal-weekdays" role="row">
          {WEEKDAYS.map((w, i) => (
            <span key={i} className="nv-cal-weekday" role="columnheader">
              <span aria-hidden="true">{w}</span>
              <span className="nv-sr-only">
                {[
                  "Sunday",
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ][i]}
              </span>
            </span>
          ))}
        </div>
        {weeks.map((week, wi) => (
          <div className="nv-cal-week" key={wi} role="row">
            {week.map((cell, ci) => {
              if (!cell) {
                return <span key={ci} className="nv-cal-cell nv-cal-cell--empty" role="gridcell" aria-hidden="true" />;
              }
              const selected = isSameDay(cell.date, value);
              const disabled = minDate ? isBeforeDay(cell.date, minDate) : false;
              return (
                <button
                  key={ci}
                  type="button"
                  role="gridcell"
                  className={`nv-cal-cell${selected ? " nv-cal-cell--selected" : ""}`}
                  aria-selected={selected}
                  aria-current={isSameDay(cell.date, today) ? "date" : undefined}
                  aria-label={formatLongDate(cell.date)}
                  tabIndex={isSameDay(cell.date, focusedDate) && !disabled ? 0 : -1}
                  disabled={disabled}
                  ref={(node) => {
                    if (node) dateRefs.current.set(dayKey(cell.date), node);
                    else dateRefs.current.delete(dayKey(cell.date));
                  }}
                  onFocus={() => setFocusedDate(cell.date)}
                  onKeyDown={(event) => onDateKeyDown(event, cell.date)}
                  onClick={() => {
                    setFocusedDate(cell.date);
                    onChange(cell.date);
                  }}
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
