import type { SampleTrip } from "./sample-trips";
import styles from "./trip-map.module.css";

const assets = "/projects/fresh-greens/pocket-map";

export function TripMap({
  trip, option, driving = false,
}: {
  trip: SampleTrip;
  option: number;
  driving?: boolean;
}) {
  const { start, end, paths, driver, driveScale } = trip.geometry;
  const height = driving ? 685 : trip.id === "brixton" ? 585 : 550;
  const daylight = trip.light === "Daylight";
  // Project the same selected route onto either the full-width overview or
  // the close driving map. The iOS camera holds the driver below center.
  const routeTransform = driving
    ? `translate(${driver[0]} ${driver[1]}) scale(${driveScale}) translate(${-start[0]} ${-start[1]})`
    : undefined;
  const strokeScale = driving ? driveScale : 1;
  // The 3× simulator overview measures 7.9 pt across each navy dash. The
  // closer driving camera measures 5.4 pt. Apply those final screen widths.
  const nightStroke = driving ? 5.4 : 7.9;
  const nightDash = driving ? [4, 15] : [5.3, 22];
  const heading = trip.id === "weeksville" ? 4 : option === 1 ? -90 : 174;

  return (
    <div className={styles.map}>
      <svg viewBox={`0 0 430 ${height}`} role="img" aria-label={
        `Sample current location on ${trip.street} and finish at ${trip.name}. Route ${option + 1} via ${trip.options[option].via}, ${trip.light.toLowerCase()}.`
      }>
        <image href={`${assets}/${trip.id}${driving ? "-drive" : ""}.webp`} width="430" height={height} />
        <path d={paths[option]} transform={routeTransform} fill="none" stroke={daylight ? "#ffb044" : "#2c2443"}
          strokeWidth={(daylight ? 5 : nightStroke) / strokeScale}
          strokeDasharray={daylight ? undefined : `${nightDash[0] / strokeScale} ${nightDash[1] / strokeScale}`}
          strokeLinecap="round" strokeLinejoin="round" />
        {driving ? (
          <g transform={`translate(${driver[0]} ${driver[1]})`}>
            <title>Current location</title>
            <circle r="19" fill="#44ac50" stroke="#1c5228" strokeWidth="1.8" />
            <path d="M0-10.5c.9 0 1.5.6 2 1.6l6.5 14.2c.8 1.7-.6 3.1-2.2 2.3L0 4.4l-6.3 3.2c-1.6.8-3-.6-2.2-2.3L-2-8.9c.5-1 1.1-1.6 2-1.6Z" transform={`rotate(${heading})`} fill="white" />
          </g>
        ) : (
          <>
            <g transform={`translate(${start[0]} ${start[1]})`}>
              <title>Current location</title>
              <circle r="16" fill="#007aff" opacity=".2" />
              <circle r="10.5" fill="#007aff" stroke="white" strokeWidth="2.8" />
            </g>
            <g transform={`translate(${end[0]} ${end[1]})`}>
              <title>{`Finish at ${trip.name}`}</title>
              <circle r="2.8" fill="#141414" stroke="white" strokeWidth="1" />
              <image href={`${assets}/destination-home.svg`} x="-34" y="-65" width="68" height="68" />
            </g>
          </>
        )}
      </svg>
      <a href="https://www.openstreetmap.org/copyright" className={styles.credit}>© OpenStreetMap contributors</a>
    </div>
  );
}
