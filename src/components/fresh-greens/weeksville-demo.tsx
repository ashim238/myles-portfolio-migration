"use client";

import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { trip } from "@/lib/fresh-greens/weeksville-comparison";
import { WeeksvillePhone } from "./weeksville-phone";
import styles from "./weeksville-demo.module.css";

export function WeeksvilleDemo() {
  const dialog = useRef<HTMLDialogElement>(null);
  const expandButton = useRef<HTMLButtonElement>(null);
  const [expanded, setExpanded] = useState(false);

  function expand() {
    if (!dialog.current) return;
    dialog.current.close();
    flushSync(() => setExpanded(true));
    dialog.current.showModal();
  }

  function returnToArticle() {
    if (!dialog.current) return;
    dialog.current.close();
    dialog.current.show();
    setExpanded(false);
    requestAnimationFrame(() => expandButton.current?.focus({ preventScroll: true }));
  }

  return (
    <section className={`${styles.demo} project-proof-target`} id="fg-app-walkthrough" tabIndex={-1} aria-labelledby="weeksville-demo-title">
      <header className={styles.intro}>
        <p className={styles.eyebrow}>Interactive prototype</p>
        <h3 id="weeksville-demo-title">Drive to Weeksville</h3>
        <p className={styles.instructions}>Search for “Weeksville” or use the arrows on the route card to see where each drive falls around sunset.</p>
        <div className={styles.tripInfo}>
          <p className={styles.smallHeading}>Example trip</p>
          <p>{trip.origin} to {trip.destination}, Brooklyn</p>
          <p className={styles.departure}>Leaving at {trip.departure} · {trip.date}</p>
        </div>
        <button type="button" ref={expandButton} className={styles.expand} onClick={expand} aria-haspopup="dialog">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 6V2h4m8 8v4h-4M2 2l4 4m8 8-4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
          </svg>
          Expand demo
        </button>
      </header>
      <div className={styles.stage}>
        <dialog open ref={dialog} className={styles.deviceArea} role={expanded ? "dialog" : "region"} aria-label="Fresh Greens route demo" onCancel={e => { e.preventDefault(); returnToArticle(); }}>
          {expanded && <button type="button" onClick={returnToArticle} className={styles.return}>Return to case study</button>}
          <WeeksvillePhone />
        </dialog>
      </div>
    </section>
  );
}
