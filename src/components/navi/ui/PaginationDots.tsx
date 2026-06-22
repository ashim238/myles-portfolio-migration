"use client";

import { useRef } from "react";

type Props = {
  count: number;
  active?: number;
  activeIndex?: number;
  onSelect: (i: number) => void;
  label?: string;
};

export function PaginationDots({ count, active, activeIndex, onSelect, label }: Props) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = activeIndex ?? active ?? 0;
  // Without a `label`, the dots act as a roving-tabindex tablist (legacy
  // carousel callers depend on `role="tab"`). With a `label`, dots render as
  // plain buttons whose accessible name is "Go to {label} N", which is what
  // surfaces like GalleryCarousel query against.
  const isTablist = !label;

  function handleKeyDown(e: React.KeyboardEvent, i: number) {
    let next = i;
    if (e.key === "ArrowRight") next = (i + 1) % count;
    else if (e.key === "ArrowLeft") next = (i - 1 + count) % count;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = count - 1;
    else return;
    e.preventDefault();
    onSelect(next);
    refs.current[next]?.focus();
  }

  if (isTablist) {
    return (
      <div className="nv-dots" role="tablist" aria-label="Slides">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            type="button"
            aria-selected={i === current}
            aria-label={`Slide ${i + 1}`}
            tabIndex={i === current ? 0 : -1}
            className={`nv-dot${i === current ? " nv-dot--active" : ""}`}
            onClick={() => onSelect(i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="nv-dots" role="group" aria-label={`${label} pagination`}>
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="button"
          aria-current={i === current ? "true" : undefined}
          aria-label={`Go to ${label} ${i + 1}`}
          className={`nv-dot${i === current ? " nv-dot--active" : ""}`}
          onClick={() => onSelect(i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
        />
      ))}
    </div>
  );
}
