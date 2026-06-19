"use client";

export function PaginationDots({
  count,
  active,
  onSelect,
}: {
  count: number;
  active: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="nv-dots" role="tablist" aria-label="Slides">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          role="tab"
          type="button"
          aria-selected={i === active}
          aria-label={`Slide ${i + 1}`}
          className={`nv-dot${i === active ? " nv-dot--active" : ""}`}
          onClick={() => onSelect(i)}
        />
      ))}
    </div>
  );
}
