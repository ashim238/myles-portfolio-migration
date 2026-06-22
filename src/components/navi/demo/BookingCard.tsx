"use client";

import { useEffect, useState } from "react";
import { Button, ImpactSignal } from "@/components/navi/ui";
import { DateTimeModal } from "@/components/navi/demo/DateTimeModal";
import { formatLongDate } from "@/lib/navi/calendar";
import type { BookingDate } from "@/lib/navi/demo-data";

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

export function BookingCard({
  priceFrom,
  dates,
  impact,
  impactHref,
  spotsLeft,
  onReserve,
}: {
  priceFrom: number;
  dates: BookingDate[];
  impact?: string;
  impactHref?: string;
  spotsLeft?: number;
  onReserve: (d: BookingDate) => void;
}) {
  const [selected, setSelected] = useState<BookingDate>(dates[0]);
  const [reserved, setReserved] = useState(false);
  // Whether the active selection came from the custom picker (vs. a preset slot).
  const [customActive, setCustomActive] = useState(false);
  const [pickedDate, setPickedDate] = useState<Date | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  // Earliest selectable day, set after mount so server and client agree on render.
  const [minDate, setMinDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    setMinDate(new Date());
  }, []);

  // The distinct start times this experience runs, in first-seen order. The
  // picker offers these so a custom date still carries a real time slot.
  const times = Array.from(new Set(dates.map((d) => d.time)));

  function pickPreset(d: BookingDate) {
    setSelected(d);
    setCustomActive(false);
    setPickedDate(null);
    setReserved(false);
  }

  function confirmCustom({ date, time }: { date: Date; time: string }) {
    setPickedDate(date);
    setCustomActive(true);
    setReserved(false);
    setSelected({ date: formatLongDate(date), time });
  }

  return (
    <aside className="nv-booking" aria-label="Book this experience">
      <p className="nv-booking-price">{priceFrom === 0 ? "Free" : `From $${priceFrom}`}</p>
      {!reserved && spotsLeft != null && spotsLeft <= 6 && (
        <p className="nv-booking-spots">Only {spotsLeft} spots left at this time.</p>
      )}
      <fieldset className="nv-booking-dates">
        <legend className="nv-sr-only">Select a date</legend>
        {dates.map((d) => {
          const isActive = !customActive && d.date === selected.date && d.time === selected.time;
          return (
            <label
              key={`${d.date}-${d.time}`}
              className={`nv-booking-date${isActive ? " nv-booking-date--active" : ""}`}
            >
              <input
                type="radio"
                name="booking-date"
                className="nv-sr-only"
                checked={isActive}
                aria-label={`${d.date} at ${d.time}`}
                onChange={() => pickPreset(d)}
              />
              <span className="nv-booking-date-day">{d.date}</span>
              <span className="nv-booking-date-time">{d.time}</span>
            </label>
          );
        })}
      </fieldset>
      <div className="nv-booking-pick">
        <span className="nv-booking-pick-label" aria-hidden="true">
          Or pick another date
        </span>
        <button
          type="button"
          className={`nv-booking-pick-trigger${customActive ? " is-set" : ""}`}
          aria-haspopup="dialog"
          aria-label={
            customActive && pickedDate
              ? `Change picked date, currently ${formatLongDate(pickedDate)}${
                  selected.time ? ` at ${selected.time}` : ""
                }`
              : "Pick another date and time"
          }
          onClick={() => setModalOpen(true)}
        >
          <span className="nv-booking-pick-value">
            {customActive && pickedDate
              ? `${formatLongDate(pickedDate)}${selected.time ? ` at ${selected.time}` : ""}`
              : "Choose a date and time"}
          </span>
          <span className="nv-booking-pick-icon" aria-hidden="true">
            <CalendarIcon />
          </span>
        </button>
      </div>
      {/* The impact is why someone books on Navi, so it sits at the decision
          point, not a tab away. */}
      {impact && (
        <ImpactSignal as="div" href={impactHref}>
          {impact}
        </ImpactSignal>
      )}
      <div className={`nv-booking-state${reserved ? " is-reserved" : ""}`}>
        <div className="nv-booking-state-reserve" inert={reserved}>
          <Button
            variant="primary"
            onClick={() => {
              onReserve(selected);
              setReserved(true);
            }}
          >
            Reserve now
          </Button>
          {priceFrom > 0 && (
            <p className="nv-booking-note">You won&apos;t be charged in this demo.</p>
          )}
        </div>
        <div className="nv-booking-state-confirmed" inert={!reserved}>
          <p className="nv-booking-confirm" role="status">
            {reserved && (
              <>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Reserved for {selected.date}
                {selected.time ? ` at ${selected.time}` : ""}. Nothing was charged in this demo.
              </>
            )}
          </p>
          <Button variant="transparent" onClick={() => setReserved(false)}>
            Change reservation
          </Button>
        </div>
      </div>
      <Button variant="transparent">Contact organizer</Button>
      <DateTimeModal
        open={modalOpen}
        times={times}
        minDate={minDate}
        initialDate={pickedDate}
        initialTime={customActive ? selected.time : null}
        onConfirm={confirmCustom}
        onClose={() => setModalOpen(false)}
      />
    </aside>
  );
}
