type Kind = "place" | "location";

export function MapPin({
  kind = "place",
  value,
  selected,
  filled = true,
}: {
  kind?: Kind;
  value?: string;
  selected?: boolean;
  filled?: boolean;
}) {
  if (kind === "location") {
    // Current location uses the universal blue dot, not a place pin.
    return <span className="nv-loc-dot" role="img" aria-label="Current location" />;
  }

  return (
    <span
      className={`nv-pin nv-pin--place${selected ? " nv-pin--selected" : ""}${
        filled ? "" : " nv-pin--hollow"
      }`}
    >
      {value && <span className="nv-pin-value">{value}</span>}
    </span>
  );
}
