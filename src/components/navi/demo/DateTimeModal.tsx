"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Calendar } from "@/components/navi/ui";
import { formatLongDate } from "@/lib/navi/calendar";

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
  const onCloseRef = useRef(onClose);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Reset the draft to the incoming values each time the dialog opens.
  useEffect(() => {
    if (open && !wasOpenRef.current) {
      setDay(initialDate);
      setTime(initialTime ?? times[0] ?? "");
    }
    wasOpenRef.current = open;
  }, [open, initialDate, initialTime, times]);

  useEffect(() => {
    if (!open) return;
    const trigger = document.activeElement as HTMLElement | null;
    closeBtnRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          "button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])",
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      trigger?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
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
          {times.length > 0 && (
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
    </>
  );
}
