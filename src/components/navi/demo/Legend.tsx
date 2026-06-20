import { MapPin } from "@/components/navi/ui";

export function Legend() {
  return (
    <div className="nv-legend" role="group" aria-label="Legend">
      <p className="nv-legend-title">Legend</p>
      <ul>
        <li>
          <MapPin kind="place" value="$" />
          <span>Locally-owned price</span>
        </li>
        <li>
          <MapPin kind="location" />
          <span>Current location</span>
        </li>
      </ul>
    </div>
  );
}
