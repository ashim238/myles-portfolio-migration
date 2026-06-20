import type { TransitOption } from "@/lib/navi/demo-data";

const ICONS: Record<TransitOption["mode"], string> = {
  subway: "🚇",
  citibike: "🚲",
  walk: "🚶",
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
