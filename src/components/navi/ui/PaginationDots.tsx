"use client";

import { useRef } from "react";

export function PaginationDots({
  count,
  active,
  onSelect,
}: {
  count: number;
  active: number;
  onSelect: (i: number) => void;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

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
          aria-selected={i === active}
          aria-label={`Slide ${i + 1}`}
          tabIndex={i === active ? 0 : -1}
          className={`nv-dot${i === active ? " nv-dot--active" : ""}`}
          onClick={() => onSelect(i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
        />
      ))}
    </div>
  );
}
