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
};

export function TransitOptions({ options }: { options: TransitOption[] }) {
  return (
    <ul className="nv-transit">
      {options.map((o) => (
        <li key={o.mode} className="nv-transit-item">
          <span className="nv-transit-icon" aria-hidden="true">
            {ICONS[o.mode]}
          </span>
          <span className="nv-transit-label">{o.label}</span>
          <span className="nv-transit-detail">{o.detail}</span>
        </li>
      ))}
    </ul>
  );
}
