"use client";

import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { CapturedRouteComparison } from "./captured-route-comparison";
import styles from "./early-product-walkthrough.module.css";

export function EarlyProductWalkthrough() {
  const [expanded, setExpanded] = useState(false);
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
        <h3 id="fg-route-screen-title">Compare two routes to Weeksville</h3>
        <p>Use the arrows beside the route count to see how the path and arrival time change.</p>
        <button type="button" ref={expandButton} className={styles.control} onClick={expand} aria-haspopup="dialog">Enlarge route comparison</button>
        <noscript><a href="/projects/fresh-greens/daylight-key/weeksville-drive.mp4">Watch the iOS recording</a></noscript>
      </header>
      <div className={styles.stage}>
        <dialog open ref={dialog} tabIndex={-1} className={styles.viewer} role={expanded ? "dialog" : "region"} aria-label="Weeksville route comparison"
          onCancel={event => { event.preventDefault(); returnToArticle(); }}>
          {expanded && <button type="button" ref={returnButton} className={styles.control} onClick={returnToArticle}>Return to case study</button>}
          <div className={styles.capture}><CapturedRouteComparison /></div>
        </dialog>
      </div>
    </section>
  );
}
