"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/navi/ui";
import { DateTimeModal } from "@/components/navi/demo/DateTimeModal";
import { BookingPanel } from "@/components/navi/demo/BookingPanel";
import { BookingReassurance } from "@/components/navi/demo/BookingReassurance";
import { BookingSheet } from "@/components/navi/demo/BookingSheet";
import { formatLongDate } from "@/lib/navi/calendar";
import type { BookingDate } from "@/lib/navi/demo-data";

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function BookingCard({
  priceFrom,
  dates,
  impact,
  impactHref,
  spotsLeft,
  host,
  rating,
  reviews,
  onReserve,
}: {
  priceFrom: number;
  dates: BookingDate[];
  impact?: string;
  impactHref?: string;
  spotsLeft?: number;
  host?: { name: string; slug: string };
  rating?: number;
  reviews?: number;
  onReserve: (d: BookingDate) => void;
}) {
  const [selected, setSelected] = useState<BookingDate>(dates[0]);
  const [reserved, setReserved] = useState(false);
  // Whether the active selection came from the custom picker (vs. a preset slot).
  const [customActive, setCustomActive] = useState(false);
  const [pickedDate, setPickedDate] = useState<Date | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  // Earliest selectable day, set after mount so server and client agree on render.
  const [minDate, setMinDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    // Deliberate set-on-mount: both server and client first render with
    // minDate=undefined, then the client fills today's date. Reading the clock
    // during render would mismatch server and client HTML, so it must be an
    // effect. This is the documented React pattern for a client-only value.
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

  function reserveNow() {
    onReserve(selected);
    setReserved(true);
  }

  // One source of truth, rendered in the desktop sidebar today and the mobile
  // sheet in the next step. idPrefix keeps the two radio groups independent.
  const panelProps = {
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
    onPickPreset: pickPreset,
    onOpenModal: () => setModalOpen(true),
    onReserveNow: reserveNow,
    onChangeReservation: () => setReserved(false),
  };

  return (
    <>
      <aside className="nv-booking" aria-label="Book this experience">
        <BookingPanel idPrefix="desktop" {...panelProps} />
        {host && <BookingReassurance host={host} rating={rating} reviews={reviews} />}
      </aside>

      {/* Mobile-only persistent CTA. The sidebar sits far below the fold on a
          phone, so the booking action follows the reader at the thumb line and
          opens the full form as a bottom sheet. */}
      <div className="nv-mobilebar">
        <div className="nv-mobilebar-info">
          {reserved ? (
            <span className="nv-mobilebar-status">
              <CheckIcon /> Reserved
            </span>
          ) : (
            <span className="nv-mobilebar-price">
              {priceFrom === 0 ? "Free" : `From $${priceFrom}`}
            </span>
          )}
        </div>
        <Button
          variant="primary"
          aria-haspopup="dialog"
          aria-expanded={sheetOpen}
          onClick={() => setSheetOpen(true)}
        >
          {reserved ? "View booking" : "Reserve"}
        </Button>
      </div>

      <BookingSheet
        open={sheetOpen}
        title="Book this experience"
        onClose={() => setSheetOpen(false)}
      >
        <BookingPanel idPrefix="sheet" {...panelProps} />
      </BookingSheet>

      <DateTimeModal
        open={modalOpen}
        times={times}
        minDate={minDate}
        initialDate={pickedDate}
        initialTime={customActive ? selected.time : null}
        onConfirm={confirmCustom}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
