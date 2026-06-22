"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Calendar } from "@/components/navi/ui";
import { formatLongDate } from "@/lib/navi/calendar";
import { useOverlayBehavior } from "@/lib/navi/use-overlay-behavior";
import { OverlayRoot } from "@/components/navi/demo/OverlayRoot";

/**
 * Booking date + time picker. Wraps the Calendar primitive with a start-time
 * selector in an accessible modal dialog (focus trap, scroll lock, Escape to
 * close, focus returned to the trigger). Time options are passed in from the
 * experience's real schedule so a confirmed pick always carries a real time.
 */
export function DateTimeModal({
  open,
  times,
  initialDate,
  initialTime,
  minDate,
  onConfirm,
  onClose,
}: {
  open: boolean;
  times: string[];
  initialDate: Date | null;
  initialTime: string | null;
  minDate?: Date;
  onConfirm: (sel: { date: Date; time: string }) => void;
  onClose: () => void;
}) {
  const [day, setDay] = useState<Date | null>(initialDate);
  const [time, setTime] = useState<string>(initialTime ?? times[0] ?? "");
  const headingId = useId();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const wasOpenRef = useRef(false);

  // Reset the draft to the incoming values each time the dialog opens.
  useEffect(() => {
    if (open && !wasOpenRef.current) {
      setDay(initialDate);
      setTime(initialTime ?? times[0] ?? "");
    }
    wasOpenRef.current = open;
  }, [open, initialDate, initialTime, times]);

  useOverlayBehavior({
    open,
    onClose,
    containerRef: dialogRef,
    initialFocusRef: closeBtnRef,
  });

  if (!open) return null;

  // Portal out of the sticky .nv-booking container: a position:sticky ancestor
  // creates a stacking context that would trap the dialog below the fixed tab
  // bar. At document.body it sits above everything and escapes .nv-ui's inert.
  return createPortal(
    <OverlayRoot>
      <div className="nv-dtmodal-backdrop" onClick={onClose} aria-hidden="true" />
      <div
        ref={dialogRef}
        className="nv-dtmodal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
      >
        <header className="nv-dtmodal-head">
          <h2 id={headingId}>Choose a date and time</h2>
          <button
            type="button"
            ref={closeBtnRef}
            className="nv-dtmodal-close"
            aria-label="Close date picker"
            onClick={onClose}
          >
            ✕
          </button>
        </header>
        <div className="nv-dtmodal-body">
          <Calendar value={day} onChange={setDay} minDate={minDate} labelledBy={headingId} />
          {/* A single time is not a choice, so the picker only appears when there
              is more than one slot. The lone time still rides through on confirm
              via the `time` state default. */}
          {times.length > 1 && (
            <fieldset className="nv-dtmodal-times">
              <legend className="nv-dtmodal-times-legend">Start time</legend>
              <div className="nv-dtmodal-times-pills">
                {times.map((t) => (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={t === time}
                    className={`nv-dtmodal-time${t === time ? " is-active" : ""}`}
                    onClick={() => setTime(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </fieldset>
          )}
        </div>
        <footer className="nv-dtmodal-foot">
          <p className="nv-dtmodal-summary" aria-live="polite">
            {day ? `${formatLongDate(day)}${time ? ` at ${time}` : ""}` : "Pick a day to continue."}
          </p>
          <div className="nv-dtmodal-actions">
            <button type="button" className="nv-dtmodal-cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="nv-dtmodal-confirm"
              disabled={!day}
              onClick={() => {
                if (!day) return;
                onConfirm({ date: day, time });
                onClose();
              }}
            >
              Confirm date
            </button>
          </div>
        </footer>
      </div>
    </OverlayRoot>,
    document.body,
  );
}
