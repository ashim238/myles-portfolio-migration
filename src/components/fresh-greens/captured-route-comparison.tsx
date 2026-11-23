"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./captured-route-comparison.module.css";

const captureDirectory = "/projects/fresh-greens/route-comparison";

// Centers of the active chevrons on the 430 × 932 point iPhone capture.
const routes = [
  { image: "ios-route-1.jpg", details: "Via Utica Avenue. Four minutes, 0.6 miles. Arrive at 11:34 PM, after dark. All clear.", arrow: [142, 684] },
  { image: "ios-route-2.jpg", details: "Via Saint Johns Place. Four minutes, 0.6 miles. Arrive at 11:35 PM, after dark. All clear.", arrow: [46, 684] },
] as const;

export const capturedRoutePoster = `${captureDirectory}/${routes[0].image}`;

export function CapturedRouteComparison() {
  const [index, setIndex] = useState<0 | 1>(0);
  const route = routes[index];
  const other = index === 0 ? 1 : 0;

  return (
    <div className={styles.phone} role="group" aria-label="Two routes captured in Fresh Greens on iPhone">
      {routes.map((capture, position) => (
        <Image
          key={capture.image}
          className={styles.capture}
          aria-hidden={position !== index}
          src={`${captureDirectory}/${capture.image}`}
          width={1290}
          height={2796}
          unoptimized
          loading="eager"
          alt={position === index ? "Fresh Greens showing the selected route to Weeksville Heritage Center on its iPhone map." : ""}
        />
      ))}
      <button
        type="button"
        aria-label={index === 0 ? "Next route" : "Previous route"}
        className={styles.arrow}
        style={{ left: `${100 * route.arrow[0] / 430}%`, top: `${100 * route.arrow[1] / 932}%` }}
        onClick={() => setIndex(other)}
        onKeyDown={event => {
          if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
          event.preventDefault();
          setIndex(event.key === "ArrowLeft" ? 0 : 1);
        }}
      />
      <span className="sr-only" role="status" aria-atomic="true">
        Route {index + 1} of 2. {route.details}
      </span>
    </div>
  );
}
