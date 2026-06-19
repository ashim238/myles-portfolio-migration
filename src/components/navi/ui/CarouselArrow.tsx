"use client";

export function CarouselArrow({
  direction,
  label,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`nv-carousel-arrow nv-carousel-arrow--${direction}`}
    >
      <span aria-hidden="true">{direction === "next" ? "›" : "‹"}</span>
    </button>
  );
}
