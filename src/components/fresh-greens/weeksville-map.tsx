import { trip } from "@/lib/fresh-greens/weeksville-comparison";
import styles from "./weeksville-map.module.css";

type WeeksvilleMapProps = { routeIndex: 0 | 1 | null };

const mapFrame = {
  x: -86,
  y: -265,
  width: 682,
  height: 1115,
};

// This portrait crop and the saved routes use the same geographic projection.
// Both endpoints sit in the open space between the search field and route card.
const routeCamera = "47 -235 514 1114";
const locationCamera = "-67 -123 430 932";

export function WeeksvilleMap({ routeIndex }: WeeksvilleMapProps) {
  const route = routeIndex === null ? null : trip.routes[routeIndex];
  const alternate = routeIndex === null ? null : trip.routes[routeIndex === 0 ? 1 : 0];
  const [startX, startY] = trip.start;
  const [finishX, finishY] = trip.finish;
  const light = route?.segments.map(segment => segment.light.toLowerCase()).join(", then ");
  return (
    <div className={styles.layer} data-route-open={route !== null}>
      <svg
        className={styles.map}
        viewBox={route ? routeCamera : locationCamera}
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label={route
          ? `From Utica Avenue to Weeksville Heritage Center via ${route.via}. Light along the route: ${light}.`
          : "Street map of Brooklyn showing the starting location on Utica Avenue."}
      >
        <image href="/projects/fresh-greens/route-comparison/weeksville-phone-map.webp" {...mapFrame} />
        {alternate?.segments.map(segment => (
          <path key={segment.light} d={segment.d} className={styles.alternate} />
        ))}
        {route?.segments.map(segment => (
          <path
            key={segment.light}
            d={segment.d}
            fill="none"
            stroke={segment.color}
            strokeWidth={segment.light === "After dark" ? 3.8 : 4.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={segment.light === "After dark" ? "2 9" : "8 5"}
          />
        ))}
        <g transform={`translate(${startX} ${startY})`}>
          <circle r="15.5" fill="#007aff" opacity=".15" />
          <circle r="9" fill="#087fff" stroke="white" strokeWidth="3" />
        </g>
        {route && (
          <g transform={`translate(${finishX} ${finishY})`}>
            <image
              href="/projects/fresh-greens/pocket-map/destination-home.svg"
              x="-28" y="-45" width="56" height="56"
            />
            <circle r="2.4" fill="#111" stroke="white" strokeWidth="1.25" />
          </g>
        )}
      </svg>
      <a className={styles.attribution} href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">
        © OpenStreetMap contributors
      </a>
    </div>
  );
}
