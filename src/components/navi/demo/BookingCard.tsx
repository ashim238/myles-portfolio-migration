"use client";

import { useState } from "react";
import { Button, ImpactSignal } from "@/components/navi/ui";
import type { BookingDate } from "@/lib/navi/demo-data";

export function BookingCard({
  priceFrom,
  dates,
  impact,
  spotsLeft,
  onReserve,
}: {
  priceFrom: number;
  dates: BookingDate[];
  impact?: string;
  spotsLeft?: number;
  onReserve: (d: BookingDate) => void;
}) {
  const [selected, setSelected] = useState<BookingDate>(dates[0]);
  const [reserved, setReserved] = useState(false);

  return (
    <aside className="nv-booking" aria-label="Book this experience">
      <p className="nv-booking-price">{priceFrom === 0 ? "Free" : `From $${priceFrom}`}</p>
      {!reserved && spotsLeft != null && spotsLeft <= 6 && (
        <p className="nv-booking-spots">Only {spotsLeft} spots left at this time.</p>
      )}
      <fieldset className="nv-booking-dates">
        <legend className="nv-sr-only">Select a date</legend>
        {dates.map((d) => {
          const isActive = d.date === selected.date && d.time === selected.time;
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
                onChange={() => {
                  setSelected(d);
                  setReserved(false);
                }}
              />
              <span className="nv-booking-date-day">{d.date}</span>
              <span className="nv-booking-date-time">{d.time}</span>
            </label>
          );
        })}
      </fieldset>
      {/* The impact is why someone books on Navi, so it sits at the decision
          point, not a tab away. */}
      {impact && <ImpactSignal as="div">{impact}</ImpactSignal>}
      {reserved ? (
        <div className="nv-booking-confirm-group">
          <p className="nv-booking-confirm" role="status">
            Reserved for {selected.date} at {selected.time}. Nothing was charged in this demo.
          </p>
          <Button variant="transparent" onClick={() => setReserved(false)}>
            Change reservation
          </Button>
        </div>
      ) : (
        <>
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
        </>
      )}
      <Button variant="transparent">Contact organizer</Button>
    </aside>
  );
}
