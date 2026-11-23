"use client";

import Image from "next/image";
import styles from "./captured-route-comparison.module.css";

const captureDirectory = "/projects/fresh-greens/route-comparison";

// Control centers are measured on the native 430 × 932 point screen.
export const routes = [
  { via: "Rochester Avenue", arrival: "4:34 PM", light: "After dark", minutes: 7, arrow: [142, 646], closeY: 579 },
  { via: "Rochester Avenue", arrival: "4:33 PM", light: "Dusk", minutes: 6, arrow: [46, 646], closeY: 579 },
] as const;

export type RouteIndex = 0 | 1;

type Props = {
  index: RouteIndex;
  driving: boolean;
  onSelect: (index: RouteIndex) => void;
  onToggleTrip: () => void;
  onBrowse: () => void;
  onSearch: () => void;
};

export function CapturedRouteComparison({ index, driving, onSelect, onToggleTrip, onBrowse, onSearch }: Props) {
  const route = routes[index];

  return (
    <div className={styles.phone} role="group" aria-label="Two routes captured in Fresh Greens on iPhone">
      {routes.map((_, position) => (
        <Image
          key={position}
          className={styles.capture}
          aria-hidden={position !== index}
          src={captureDirectory + "/ios-" + (driving ? "drive-" : "route-") + (position + 1) + ".jpg"}
          width={1290}
          height={2796}
          unoptimized
          loading="eager"
          alt={position === index ? (driving ? "Fresh Greens giving the first turn toward Weeksville Heritage Center." : "The blue location dot marks the start on Eastern Parkway Service Road. The checkered pin marks Weeksville Heritage Center.") : ""}
        />
      ))}
      {!driving && <>
        <button
          type="button"
          aria-label={index === 0 ? "Next route" : "Previous route"}
          className={styles.arrow}
          style={{ left: (100 * route.arrow[0] / 430) + "%", top: (100 * route.arrow[1] / 932) + "%" }}
          onClick={() => onSelect(index === 0 ? 1 : 0)}
          onKeyDown={event => {
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
            event.preventDefault();
            onSelect(event.key === "ArrowLeft" ? 0 : 1);
          }}
        />
        <button type="button" className={styles.search} aria-label="Search destinations" onClick={onSearch} />
        <button type="button" className={styles.arrow} style={{ left: "89.2%", top: (100 * route.closeY / 932) + "%" }} aria-label="Close route and browse recommendations" onClick={onBrowse} />
      </>}
      <button type="button" className={styles.trip} data-driving={driving} onClick={onToggleTrip}
        aria-label={driving ? "End trip" : "Go, start route via " + route.via} />
      <span className="sr-only" role="status" aria-atomic="true">
        {driving ? "Driving to Weeksville via " + route.via + ". Head out on Eastern Parkway Service Road." : "Route " + (index + 1) + " of 2. Via " + route.via + ". " + route.minutes + " minutes, 1 mile. One reported road condition. Arrive at " + route.arrival + ", " + route.light + "."}
      </span>
    </div>
  );
}
