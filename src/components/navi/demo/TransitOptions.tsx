import type { ReactNode } from "react";
import type { TransitOption } from "@/lib/navi/demo-data";

const svgProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

// Mode-derived labels used when the data carries the generic "Take the"
// verb. Without this, an experience with both subway and LIRR (or subway and
// bus) renders two adjacent "Take the" rows, which reads as a duplicate
// header. Per-item custom labels in the data still win.
const MODE_LABEL: Record<TransitOption["mode"], string> = {
  subway: "Subway",
  citibike: "Citibike",
  walk: "Walk",
  bus: "Bus",
  ferry: "Ferry",
  lirr: "LIRR",
};

const ICONS: Record<TransitOption["mode"], ReactNode> = {
  subway: (
    <svg {...svgProps}>
      <rect x="5" y="3" width="14" height="13" rx="3" />
      <line x1="5" y1="11" x2="19" y2="11" />
      <line x1="8" y1="20" x2="6" y2="22" />
      <line x1="16" y1="20" x2="18" y2="22" />
    </svg>
  ),
  citibike: (
    <svg {...svgProps}>
      <circle cx="6" cy="17" r="3.5" />
      <circle cx="18" cy="17" r="3.5" />
      <path d="M6 17l5-8h5l-4 8M9 9h4" />
    </svg>
  ),
  walk: (
    <svg {...svgProps}>
      <circle cx="13" cy="4" r="1.6" />
      <path d="M13 7l-2 4 3 2 1 5M11 11l-3 2-1 4M14 13l3 1" />
    </svg>
  ),
  bus: (
    <svg {...svgProps}>
      <rect x="4" y="4" width="16" height="13" rx="2" />
      <line x1="4" y1="11" x2="20" y2="11" />
      <line x1="8" y1="17" x2="8" y2="20" />
      <line x1="16" y1="17" x2="16" y2="20" />
    </svg>
  ),
  ferry: (
    <svg {...svgProps}>
      <path d="M3 16h18l-2.2 5H5.2L3 16z" />
      <path d="M5.5 16V9h8l4 4v3" />
      <line x1="9.5" y1="9" x2="9.5" y2="5.5" />
    </svg>
  ),
  lirr: (
    <svg {...svgProps}>
      <path d="M7 4h10v9a5 5 0 0 1-5 5 5 5 0 0 1-5-5V4z" />
      <line x1="7" y1="9.5" x2="17" y2="9.5" />
      <line x1="9.5" y1="18" x2="8" y2="21" />
      <line x1="14.5" y1="18" x2="16" y2="21" />
    </svg>
  ),
};

export function TransitOptions({ options }: { options: TransitOption[] }) {
  return (
    <ul className="nv-transit">
      {options.map((o, i) => (
        <li key={`${o.mode}-${i}`} className="nv-transit-item">
          <span className="nv-transit-icon" aria-hidden="true">
            {ICONS[o.mode]}
          </span>
          <span className="nv-transit-label">
            {o.label === "Take the" ? MODE_LABEL[o.mode] : o.label}
          </span>
          <span className="nv-transit-detail">{o.detail}</span>
        </li>
      ))}
    </ul>
  );
}
