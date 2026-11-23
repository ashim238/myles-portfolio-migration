"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./captured-route-comparison.module.css";

const captureDirectory = "/projects/fresh-greens/route-comparison";

// Control centers are measured on the native 430 × 932 point screen.
const routes = [
  { via: "Utica Avenue", details: "Five minutes, 0.6 miles. Arrive at 8:12 AM, daylight. One road condition.", arrow: [142, 645], closeY: 579 },
  { via: "Saint Johns Place", details: "Five minutes, 0.6 miles. Arrive at 8:13 AM, daylight. All clear.", arrow: [46, 684], closeY: 617 },
] as const;

type Props = { onBrowse: () => void; onSearch: () => void };

export function CapturedRouteComparison({ onBrowse, onSearch }: Props) {
  const [index, setIndex] = useState<0 | 1>(0);
  const [driving, setDriving] = useState(false);
  const route = routes[index];

  return (
    <div className={styles.phone} role="group" aria-label="Two routes captured in Fresh Greens on iPhone">
      {routes.map((capture, position) => (
        <Image
          key={capture.via}
          className={styles.capture}
          aria-hidden={position !== index}
          src={captureDirectory + "/ios-" + (driving ? "drive-" : "route-") + (position + 1) + ".jpg"}
          width={1290}
          height={2796}
          unoptimized
          loading="eager"
          alt={position === index ? (driving ? "Fresh Greens giving the first turn toward Weeksville Heritage Center." : "Fresh Greens showing the selected route to Weeksville Heritage Center on its iPhone map.") : ""}
        />
      ))}
      {!driving && <>
        <button
          type="button"
          aria-label={index === 0 ? "Next route" : "Previous route"}
          className={styles.arrow}
          style={{ left: (100 * route.arrow[0] / 430) + "%", top: (100 * route.arrow[1] / 932) + "%" }}
          onClick={() => setIndex(index === 0 ? 1 : 0)}
          onKeyDown={event => {
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
            event.preventDefault();
            setIndex(event.key === "ArrowLeft" ? 0 : 1);
          }}
        />
        <button type="button" className={styles.search} aria-label="Search destinations" onClick={onSearch} />
        <button type="button" className={styles.arrow} style={{ left: "89.2%", top: (100 * route.closeY / 932) + "%" }} aria-label="Close route and browse recommendations" onClick={onBrowse} />
      </>}
      <button type="button" className={styles.trip} data-driving={driving} onClick={() => setDriving(!driving)}
        aria-label={driving ? "End trip" : "Go, start route via " + route.via} />
      <span className="sr-only" role="status" aria-atomic="true">
        {driving ? "Driving to Weeksville via " + route.via + ". Head out on Utica Avenue." : "Route " + (index + 1) + " of 2. Via " + route.via + ". " + route.details}
      </span>
    </div>
  );
}
