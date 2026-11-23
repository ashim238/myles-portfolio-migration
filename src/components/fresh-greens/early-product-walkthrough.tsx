"use client";

import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { CapturedRouteComparison, routes, type RouteIndex } from "./captured-route-comparison";
import { CapturedHomeSheet } from "./captured-home-sheet";
import styles from "./early-product-walkthrough.module.css";

export function EarlyProductWalkthrough() {
  const [expanded, setExpanded] = useState(false);
  const [screen, setScreen] = useState<"routes" | "browse" | "search">("routes");
  const [routeIndex, setRouteIndex] = useState<RouteIndex>(1);
  const [driving, setDriving] = useState(false);
  function selectRoute(index: RouteIndex) {
    setRouteIndex(index);
    setDriving(false);
  }

  const phone = useRef<HTMLDivElement>(null);
  const browsing = screen !== "routes";
  function switchScreen(next: typeof screen) {
    setScreen(next);
    setDriving(false);
    if (next === "search") return;
    requestAnimationFrame(() => phone.current?.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true }));
  }

  function browseControl() {
    return <button type="button" className={styles.control} onClick={() => switchScreen(browsing ? "routes" : "browse")}>
      {browsing ? "Compare routes to Weeksville" : "Browse recommendations"}
    </button>;
  }

  const dialog = useRef<HTMLDialogElement>(null);
  const expandButton = useRef<HTMLButtonElement>(null);
  const returnButton = useRef<HTMLButtonElement>(null);

  function expand() {
    if (!dialog.current) return;
    dialog.current.close();
    flushSync(() => setExpanded(true));
    dialog.current.showModal();
    returnButton.current?.focus({ preventScroll: true });
  }

  function returnToArticle() {
    if (!dialog.current) return;
    dialog.current.close();
    dialog.current.show();
    setExpanded(false);
    requestAnimationFrame(() => expandButton.current?.focus({ preventScroll: true }));
  }

  return (
    <section id="fg-app-walkthrough" tabIndex={-1} className={`${styles.walkthrough} project-proof-target`} aria-labelledby="fg-route-screen-title">
      <header className={styles.header}>
        <p className={styles.kicker}>From the iOS app</p>
        <h3 id="fg-route-screen-title">{browsing ? "Browse recommendations" : "Compare two routes to Weeksville"}</h3>
        <p>{browsing ? "Open the home sheet and choose a category to see the app’s sample places. Search for Weeksville to compare routes." : "Leave Crown Heights at 4:27 PM. Both routes reach Weeksville via Rochester Avenue. Compare the light on arrival, then select Go to see the first turn."}</p>
        {!browsing && <div className={styles.choices} role="group" aria-label="Choose a route to Weeksville">
          {([1, 0] as const).map(index => (
            <button key={index} type="button" aria-pressed={routeIndex === index}
              onClick={() => selectRoute(index)}>
              <span>{routes[index].light}</span>
              <span>{routes[index].arrival}</span>
              <small>Route {index + 1} · {routes[index].minutes} min</small>
            </button>
          ))}
        </div>}
        <div className={styles.actions}>
          <button type="button" ref={expandButton} className={styles.control} onClick={expand} aria-haspopup="dialog">{browsing ? "Enlarge home sheet" : "Enlarge route comparison"}</button>
          {browseControl()}
        </div>
        <noscript><a href="/projects/fresh-greens/daylight-key/weeksville-drive.mp4">Watch the iOS recording</a></noscript>
      </header>
      <div className={styles.stage}>
        <dialog open ref={dialog} tabIndex={-1} className={styles.viewer} role={expanded ? "dialog" : "region"} aria-label={browsing ? "Fresh Greens recommendations" : "Weeksville route comparison"}
          onCancel={event => { event.preventDefault(); returnToArticle(); }}>
          {expanded && <div className={styles.actions}><button type="button" ref={returnButton} className={styles.control} onClick={returnToArticle}>Return to case study</button>{browseControl()}</div>}
          <div ref={phone} className={styles.capture}>
            {browsing
              ? <CapturedHomeSheet initialSearch={screen === "search"} onCompareWeeksville={() => switchScreen("routes")} />
              : <CapturedRouteComparison index={routeIndex} driving={driving} onSelect={selectRoute} onToggleTrip={() => setDriving(value => !value)} onBrowse={() => switchScreen("browse")} onSearch={() => switchScreen("search")} />}
          </div>
        </dialog>
      </div>
    </section>
  );
}
