"use client";

import { useId, useRef, useState } from "react";
import { trip } from "@/lib/fresh-greens/weeksville-comparison";
import { WeeksvilleMap } from "./weeksville-map";
import styles from "./weeksville-phone.module.css";

const icons = {
  search: <><circle cx="10.5" cy="10.5" r="6.8" /><path d="m16 16 5 5" /></>,
  back: <path d="m14.5 5-7 7 7 7" />,
  next: <path d="m9.5 5 7 7-7 7" />,
  close: <path d="m6.5 6.5 11 11m0-11-11 11" />,
  pin: <><path d="M19 9.5c0 5.2-7 11-7 11s-7-5.8-7-11a7 7 0 1 1 14 0Z" /><circle cx="12" cy="9.5" r="2.1" /></>,
  book: <path d="M6 3.5h12v17l-6-4-6 4Z" />,
  key: <><path d="m2 5 6-2 8 3 6-2v15l-6 2-8-3-6 2Zm6-2v15m8-12v15" /></>,
  go: <path d="M3 12h17m-7-7 7 7-7 7" />,
  moon: <path d="M20.5 15a8.8 8.8 0 0 1-11.6-11A9 9 0 1 0 20.5 15Z" />,
  dusk: <><path d="M2.5 16h19M5 20h14M7 16a5 5 0 1 1 10 0M12 3v2M4 8l1.5 1.2M20 8l-1.5 1.2" /></>,
  navigate: <path d="M3 3.7 21 11l-8 2.1-2.4 7.9Z" />,
};

function Icon({ name }: { name: keyof typeof icons }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[name]}</svg>;
}

export function WeeksvillePhone() {
  const [routeIndex, setRouteIndex] = useState<0 | 1 | null>(0);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");
  const [keyOpen, setKeyOpen] = useState(true);
  const [saved, setSaved] = useState(false);
  const [driving, setDriving] = useState(false);
  const uid = useId();
  const searchButton = useRef<HTMLButtonElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const searchResult = useRef<HTMLButtonElement>(null);
  const choiceControls = useRef<HTMLDivElement>(null);
  const keyControls = useRef<HTMLDivElement>(null);
  const driveEnd = useRef<HTMLButtonElement>(null);
  const startDrive = useRef<HTMLButtonElement>(null);
  const route = routeIndex === null ? null : trip.routes[routeIndex];
  const words = query.trim().toLowerCase().split(/\s+/);
  const match = words.every(word => (trip.destination + " Brooklyn, New York").toLowerCase().includes(word));
  const arrivalIcon = route?.light === "After dark" ? "moon" : "dusk";

  function openSearch() {
    setQuery("");
    setSearching(true);
    requestAnimationFrame(() => searchInput.current?.focus({preventScroll:true}));
  }

  function returnToMap() {
    setSearching(false);
    requestAnimationFrame(() => searchButton.current?.focus({preventScroll:true}));
  }

  function selectPlace() {
    setRouteIndex(0);
    setKeyOpen(true);
    returnToMap();
  }

  function switchRoute(index: 0 | 1, keyboard: boolean) {
    setRouteIndex(index);
    if (keyboard) requestAnimationFrame(() => choiceControls.current?.querySelector<HTMLButtonElement>("button:not(:disabled)")?.focus({preventScroll:true}));
  }

  function toggleKey(keyboard: boolean) {
    setKeyOpen(!keyOpen);
    if (keyboard) requestAnimationFrame(() => keyControls.current?.querySelector("button")?.focus({preventScroll:true}));
  }

  function changeDrive(next: boolean) {
    setDriving(next);
    setKeyOpen(!next);
    requestAnimationFrame(() => (next ? driveEnd : startDrive).current?.focus({preventScroll:true}));
  }

  return (
    <div className={styles.phone} role="group" aria-label="Fresh Greens mobile route preview">
      <div className={styles.screen} data-driving={driving} data-searching={searching}>
        {!searching && <WeeksvilleMap routeIndex={routeIndex} />}
        <div className={styles.status} aria-hidden="true">
          <span>4:32</span><i />
          <svg viewBox="0 0 54 14" fill="currentColor">
            <path d="M0 10h2v3H0zm3-2h2v5H3zm3-2h2v7H6zm3-2h2v9H9z" />
            <path d="M16 5a11 11 0 0 1 15 0l-2 2a8 8 0 0 0-11 0zm3 3a6.8 6.8 0 0 1 9 0l-2 2a3.8 3.8 0 0 0-5 0zm3 3a2.3 2.3 0 0 1 3 0l-1.5 1.5z" />
            <rect x="34" y="3.5" width="17" height="9" rx="2.5" fill="none" stroke="currentColor" /><rect x="36" y="5.2" width="13" height="5.6" rx="1.2" /><rect x="52" y="6" width="1.5" height="4" rx=".75" />
          </svg>
        </div>

        {searching ? (
          <div className={styles.searchPage} onKeyDown={e => {
            if (e.key === "Escape") {
              e.preventDefault();
              e.stopPropagation();
              returnToMap();
            }
          }}>
            <form className={styles.searchForm} onSubmit={e => { e.preventDefault(); if (match) selectPlace(); }}>
              <button type="button" className={styles.iconButton} aria-label="Back to map" onClick={returnToMap}><Icon name="back" /></button>
              <input ref={searchInput} type="text" aria-label="Search for a destination" placeholder="Where are you headed?" value={query} onChange={e => setQuery(e.target.value)} autoComplete="off" spellCheck={false} enterKeyHint="search" onKeyDown={e => { if (e.key === "ArrowDown" && match) { e.preventDefault(); searchResult.current?.focus(); } }} />
              {query && <button type="button" className={styles.iconButton} aria-label="Clear search" onClick={() => {setQuery(""); searchInput.current?.focus();}}><Icon name="close" /></button>}
            </form>
            <div className={styles.results}>
              <p className={styles.resultHeading}>{query.trim() ? "Search results" : saved ? "Saved places" : "Recent searches"}</p>
              {match ? <button ref={searchResult} type="button" className={styles.place} onClick={selectPlace}>
                <span className={styles.placeIcon}><Icon name="pin" /></span><span><strong>{trip.destination}</strong><small>Brooklyn, NY</small></span><Icon name="next" />
              </button> : <p className={styles.empty} role="status">No matches. Try “Weeksville.”</p>}
            </div>
          </div>
        ) : (
          <>
            {driving ? <div className={styles.direction}><Icon name="navigate" /><div><strong>Head north on Utica Avenue</strong><small>now</small></div></div> :
              <button type="button" ref={searchButton} className={styles.searchTrigger} aria-label="Search for a destination" onClick={openSearch}><Icon name="search" />Where are you headed?</button>}

            {route && routeIndex !== null && <div className={styles.bottom}>
              <div className={styles.keyControl} ref={keyControls}>
                {keyOpen ? <div className={styles.key} id={uid+"-key"} aria-label="Map key">
                  <span><i className={styles.dayLine} />Daylight</span><span><i className={styles.duskLine} />Dusk</span><span><i className={styles.nightLine} />After dark</span>
                  <button type="button" aria-label="Close map key" aria-expanded={true} onClick={e => toggleKey(e.detail === 0)}><Icon name="close" /></button>
                </div> : <button type="button" className={styles.keyToggle} aria-label="Open map key" aria-expanded={false} onClick={e => toggleKey(e.detail === 0)}><Icon name="key" />Map key</button>}
              </div>
              <div className={styles.sheet}>
                <div className={styles.grabber} aria-hidden="true" />
                {driving ? <div className={styles.driveSheet}>
                  <strong>{route.arrival} <span><Icon name={arrivalIcon} />{route.light}</span></strong>
                  <p>{route.miles} mi. · {route.minutes} min</p>
                  <button type="button" ref={driveEnd} className={styles.end} onClick={() => changeDrive(false)}>End trip</button>
                </div> : <>
                  <div className={styles.titleRow}>
                    <strong className={styles.destination}>{trip.destination}</strong>
                    <button type="button" className={styles.round} aria-label="Save destination" aria-pressed={saved} onClick={() => setSaved(!saved)}><Icon name="book" /></button>
                    <button type="button" className={styles.round} aria-label="Clear destination" onClick={() => { setRouteIndex(null); searchButton.current?.focus(); }}><Icon name="close" /></button>
                  </div>
                  <div className={styles.routes} ref={choiceControls}>
                    <button className={styles.round} type="button" aria-label="Previous route" disabled={routeIndex === 0} onClick={e => switchRoute(0, e.detail === 0)}><Icon name="back" /></button>
                    <b>{routeIndex + 1} of 2</b>
                    <button className={styles.round} type="button" aria-label="Next route" disabled={routeIndex === 1} onClick={e => switchRoute(1, e.detail === 0)}><Icon name="next" /></button>
                    <span>Via {route.via}</span>
                  </div>
                  <div className={styles.facts} aria-live="polite" aria-atomic="true">
                    <span><strong>{route.minutes} min</strong> · {route.miles} mi.</span>
                    <span>Arrive {route.arrival} · <b><Icon name={arrivalIcon} />{route.light}</b></span>
                  </div>
                  <button ref={startDrive} type="button" className={styles.go} aria-label="Start drive preview" onClick={() => changeDrive(true)}><Icon name="go" />Go</button>
                </>}
              </div>
            </div>}
          </>
        )}
      </div>
    </div>
  );
}
