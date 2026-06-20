"use client";

import { useState } from "react";
import { Button } from "@/components/navi/ui";
import type { BookingDate } from "@/lib/navi/demo-data";

export function BookingCard({
  priceFrom,
  dates,
  onReserve,
}: {
  priceFrom: number;
  dates: BookingDate[];
  onReserve: (d: BookingDate) => void;
}) {
  const [selected, setSelected] = useState<BookingDate>(dates[0]);
  const [reserved, setReserved] = useState(false);

  return (
    <aside className="nv-booking" aria-label="Book this experience">
      <p className="nv-booking-price">From ${priceFrom}</p>
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
      {reserved ? (
        <p className="nv-booking-confirm" role="status">
          Reserved for {selected.date} at {selected.time}.
        </p>
      ) : (
        <Button
          variant="primary"
          onClick={() => {
            onReserve(selected);
            setReserved(true);
          }}
        >
          Reserve now
        </Button>
      )}
      <Button variant="transparent">Contact organizer</Button>
    </aside>
  );
}
