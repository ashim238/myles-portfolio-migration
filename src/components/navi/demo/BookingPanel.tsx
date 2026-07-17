"use client";

import { Button, ImpactSignal } from "@/components/navi/ui";
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

/**
 * Presentational booking form. BookingCard owns all state and renders this in
 * two places that share it: the desktop sidebar and the mobile bottom sheet.
 * `idPrefix` namespaces the radio group so the two instances never collide.
 */
export function BookingPanel({
  idPrefix,
  priceFrom,
  dates,
  selected,
  reserved,
  customActive,
  pickedDate,
  modalOpen,
  spotsLeft,
  impact,
  impactHref,
  onPickPreset,
  onOpenModal,
  onReserveNow,
  onChangeReservation,
  contacted,
  onContactOrganizer,
}: {
  idPrefix: string;
  priceFrom: number;
  dates: BookingDate[];
  selected: BookingDate;
  reserved: boolean;
  customActive: boolean;
  pickedDate: Date | null;
  modalOpen: boolean;
  spotsLeft?: number;
  impact?: string;
  impactHref?: string;
  onPickPreset: (d: BookingDate) => void;
  onOpenModal: () => void;
  onReserveNow: () => void;
  onChangeReservation: () => void;
  contacted: boolean;
  onContactOrganizer: () => void;
}) {
  return (
    <>
      <p className="nv-booking-price">{priceFrom === 0 ? "Free" : `From $${priceFrom}`}</p>
      {!reserved && spotsLeft != null && spotsLeft <= 6 && (
        <p className="nv-booking-spots">Only {spotsLeft} spots left at this time.</p>
      )}
      <fieldset className="nv-booking-dates">
        {/* Visible label so a first-timer reads the presets as the next bookable
            slots, not examples. Doubles as the radio group's accessible name. */}
        <legend className="nv-booking-dates-legend">Next available</legend>
        {dates.map((d) => {
          const isActive = !customActive && d.date === selected.date && d.time === selected.time;
          return (
            <label
              key={`${d.date}-${d.time}`}
              className={`nv-booking-date${isActive ? " nv-booking-date--active" : ""}`}
            >
              <input
                type="radio"
                name={`${idPrefix}-booking-date`}
                className="nv-sr-only"
                checked={isActive}
                aria-label={`${d.date} at ${d.time}`}
                onChange={() => onPickPreset(d)}
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
          aria-expanded={modalOpen}
          aria-label={
            customActive && pickedDate
              ? `Change picked date, currently ${formatLongDate(pickedDate)}${
                  selected.time ? ` at ${selected.time}` : ""
                }`
              : "Pick another date and time"
          }
          onClick={onOpenModal}
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
          <Button variant="primary" onClick={onReserveNow}>
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
                {selected.time ? ` at ${selected.time}` : ""}.
                {priceFrom > 0 ? " Nothing was charged in this demo." : ""}
              </>
            )}
          </p>
          <Button variant="transparent" onClick={onChangeReservation}>
            Change reservation
          </Button>
        </div>
      </div>
      <Button variant="transparent" onClick={onContactOrganizer}>
        Contact organizer
      </Button>
      <p className="nv-booking-note" aria-live="polite" aria-atomic="true">
        {contacted ? "Demo only. No message was sent." : ""}
      </p>
    </>
  );
}
