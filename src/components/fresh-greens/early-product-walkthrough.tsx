"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties } from "react";
import styles from "./early-product-walkthrough.module.css";

type Screen = "plan" | "drive" | "key" | "toolkit" | "question";
type Action = {
  label: string;
  next: Screen | "back";
  /** Bounds of the control in the original 430 × 932 pt iOS viewport. */
  bounds: readonly [left: number, top: number, width: number, height: number];
  shape?: "tile" | "round";
};

const drivingCaptures = "/projects/fresh-greens/daylight-key";
const safetyCaptures = "/projects/fresh-greens/v2";
const openToolkit: Action = {
  label: "Open safety toolkit",
  next: "toolkit",
  bounds: [358, 451, 56, 56],
  shape: "round",
};

const screens: Record<Screen, {
  file: string;
  alt: string;
  title: string;
  instruction: string;
  actions: readonly Action[];
}> = {
  plan: {
    file: drivingCaptures + "/03-brixton-evening-preview.png",
    alt: "Route preview for Windrush Square via Brixton Hill. The seven-minute drive arrives at 9:52 PM, after dark. The route is drawn as purple dots.",
    title: "Before the drive",
    instruction: "The route takes seven minutes and arrives after dark. Select Go on the phone to start driving.",
    actions: [{ label: "Go, start the drive", next: "drive", bounds: [24, 846, 382, 46] }],
  },
  drive: {
    file: drivingCaptures + "/04-brixton-evening-navigation.png",
    alt: "Driving view on Sudbourne Road. The map key is in the lower left. The safety shield is on the right. The after-dark label stays beside the 9:52 arrival time.",
    title: "On the road",
    instruction: "Open the map key to read the dotted route, or select the shield to open the safety toolkit.",
    actions: [
      { label: "Open map key", next: "key", bounds: [16, 606, 105, 46] },
      openToolkit,
    ],
  },
  key: {
    file: drivingCaptures + "/05-brixton-navigation-key-reopened.png",
    alt: "The same driving screen with the map key open. A solid line means daylight, dashes mean dusk, and dots mean after dark.",
    title: "Reading the route",
    instruction: "The dots mark the part of the drive after dark. Close the key to see the map again, or select the shield for support.",
    actions: [
      { label: "Close map key", next: "back", bounds: [107, 524, 36, 36], shape: "round" },
      openToolkit,
    ],
  },
  toolkit: {
    file: safetyCaptures + "/safety-toolkit.png",
    alt: "Safety toolkit with four options. Pulled-over is the upper-left tile.",
    title: "The safety toolkit",
    instruction: "The shield opens four ways to get support. Select Pulled-over to see the first question.",
    actions: [{ label: "Open Pulled-over", next: "question", bounds: [23, 217, 180, 127], shape: "tile" }],
  },
  question: {
    file: safetyCaptures + "/pulled-over-armed-organic.png",
    alt: "The first pulled-over question reads Are you armed? The three options are Yes, No, and Prefer not to answer.",
    title: "The first question",
    instruction: "This is where the app asks which guidance applies. You can return to the toolkit or restart the drive.",
    actions: [],
  },
};

function controlPosition([left, top, width, height]: Action["bounds"]): CSSProperties {
  return {
    left: `${((left + width / 2) / 430) * 100}%`,
    top: `${((top + height / 2) / 932) * 100}%`,
    "--control-width": `${(width / 430) * 100}cqw`,
    "--control-height": `${(height / 430) * 100}cqw`,
  } as CSSProperties;
}

export function EarlyProductWalkthrough() {
  const [path, setPath] = useState<Screen[]>(["plan"]);
  const screen = screens[path[path.length - 1]];
  const titleRef = useRef<HTMLHeadingElement>(null);

  function navigate(next: Screen | "back" | "restart", keyboard: boolean) {
    setPath(current => {
      if (next === "restart") return ["plan"];
      if (next === "back") return current.length > 1 ? current.slice(0, -1) : current;
      return [...current, next];
    });

    if (keyboard) {
      requestAnimationFrame(() => titleRef.current?.focus({ preventScroll: true }));
    }
  }

  return (
    <section className={`${styles.walkthrough} project-proof-target`} id="fg-app-walkthrough" aria-labelledby="fg-walkthrough-title">
      <header className={styles.header}>
        <p className={styles.kicker}>Interactive walkthrough</p>
        <h3 id="fg-walkthrough-title">Drive to Windrush Square</h3>
        <p>Use the outlined controls to explore these screens from the iOS prototype.</p>
      </header>
      <div className={styles.instructions}>
        <div aria-live="polite" aria-atomic="true">
          <h4 ref={titleRef} tabIndex={-1} aria-describedby="fg-walkthrough-instruction">{screen.title}</h4>
          <p id="fg-walkthrough-instruction">{screen.instruction}</p>
        </div>
      </div>
      <div className={styles.stage}>
        <div className={styles.phone}>
          <Image
            className={styles.capture}
            src={screen.file}
            alt={screen.alt}
            width={1290}
            height={2796}
            sizes="(max-width: 360px) 78vw, 296px"
          />
          {screen.actions.map(action => (
            <button
              type="button"
              key={action.label}
              aria-label={action.label}
              className={styles.hotspot}
              data-shape={action.shape}
              style={controlPosition(action.bounds)}
              onClick={event => navigate(action.next, event.detail === 0)}
            />
          ))}
        </div>
      </div>
      <nav className={styles.controls} aria-label="Walkthrough controls" hidden={path.length === 1}>
        <button type="button" className="reader-control" onClick={event => navigate("back", event.detail === 0)}>← Back</button>
        {path.length > 2 && <button type="button" className="reader-control" onClick={event => navigate("restart", event.detail === 0)}>Start over</button>}
      </nav>
      <noscript>
        <p>Open the original captures to follow the trip.</p>
        <ul>
          {Object.entries(screens).map(([key, state]) => <li key={key}><a href={state.file}>{state.title}</a></li>)}
        </ul>
      </noscript>
    </section>
  );
}
