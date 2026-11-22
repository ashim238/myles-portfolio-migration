"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { arrivalTime, sampleTrips, type SampleTrip } from "./sample-trips";
import styles from "./early-product-walkthrough.module.css";

const assets = "/projects/fresh-greens/pocket-map";
const captures = "/projects/fresh-greens/v2";
const tools = [
  { name: "Pulled-over", icon: "safety-pulled-over", capture: "pulled-over-armed-organic", detail: "The first question narrows down which guidance applies." },
  { name: "Roadside assistance", icon: "safety-car-troubles", capture: "roadside", detail: "The iOS app asks what happened and lets you look up nearby tow services." },
  { name: "Unfamiliar area", icon: "safety-lost", capture: "unfamiliar", detail: "A driver can look for a well-lit place, a gas station, or a nearby on-ramp." },
  { name: "Share location", icon: "safety-share-location", capture: "share-location", detail: "In the iOS app, the driver picks a reason to share the trip with a trusted contact." },
] as const;

function TripMap({ trip, option }: { trip: SampleTrip; option: number }) {
  const { start, end, paths } = trip.geometry;
  return (
    <div className={styles.map}>
      <svg viewBox="0 0 400 268" role="img" aria-label={`Sample current location on ${trip.street} and finish at ${trip.name}. Route ${option + 1} via ${trip.options[option].via}, ${trip.light.toLowerCase()}.`}>
        <image href={`${assets}/${trip.id}.webp`} width="400" height="268" />
        <path d={paths[option]} fill="none" stroke={trip.light === "Daylight" ? "#b97612" : "#30284c"} strokeWidth="4" strokeDasharray={trip.light === "After dark" ? "1 7" : undefined} strokeLinecap="round" strokeLinejoin="round" />
        <g transform={`translate(${start[0]} ${start[1]})`}>
          <circle r="13" fill="#267fe2" opacity=".18" /><circle r="7" fill="#127be5" stroke="white" strokeWidth="2.5" />
          <rect x="-79" y="-27" width="79" height="22" rx="5" fill="white" stroke="#b6c5c0" />
          <text x="-39.5" y="-12" textAnchor="middle">You are here</text>
        </g>
        <g transform={`translate(${end[0]} ${end[1]})`}>
          <image href={`${assets}/destination-home.svg`} x="-20" y="-35" width="40" height="40" />
          <rect x="16" y="-27" width="43" height="22" rx="5" fill="white" stroke="#b6c5c0" />
          <text x="37.5" y="-12" textAnchor="middle">Finish</text>
        </g>
      </svg>
      <a href="https://www.openstreetmap.org/copyright" className={styles.credit}>© OpenStreetMap contributors</a>
    </div>
  );
}

export function EarlyProductWalkthrough() {
  const [trip, setTrip] = useState<SampleTrip>(sampleTrips[0]);
  const [option, setOption] = useState<number>(sampleTrips[0].initialOption);
  const [view, setView] = useState<"plan" | "drive" | "toolkit">("plan");
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [tool, setTool] = useState<(typeof tools)[number] | null>(null);
  const [answer, setAnswer] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const firstResult = useRef<HTMLButtonElement>(null);
  const goRef = useRef<HTMLButtonElement>(null);
  const endRef = useRef<HTMLButtonElement>(null);
  const toolkitRef = useRef<HTMLButtonElement>(null);
  const toolbarBack = useRef<HTMLButtonElement>(null);
  const toolRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const focusAfter = useRef<"go" | "end" | "toolkit" | "back" | number | null>(null);
  const matches = sampleTrips.filter(item => `${item.name} ${item.area}`.toLowerCase().includes(query.trim().toLowerCase()));
  const route = trip.options[option];
  const arrival = arrivalTime(trip, option);

  useEffect(() => {
    const focus = focusAfter.current;
    if (focus === null) return;
    const targets = { go: goRef, end: endRef, toolkit: toolkitRef, back: toolbarBack };
    const target = typeof focus === "number" ? toolRefs.current[focus] : targets[focus].current;
    target?.focus({ preventScroll: true });
    focusAfter.current = null;
  }, [view, trip, searching, tool]);

  function chooseTrip(next: SampleTrip) {
    setTrip(next);
    setOption(next.initialOption);
    setSearching(false);
    setQuery("");
    setShowKey(false);
    focusAfter.current = "go";
  }

  function changeDrive(driving: boolean) {
    focusAfter.current = driving ? "end" : "go";
    setShowKey(false);
    setView(driving ? "drive" : "plan");
  }

  function closeToolkit() {
    if (tool) {
      focusAfter.current = tools.indexOf(tool);
      setTool(null);
      setAnswer("");
    } else {
      focusAfter.current = "toolkit";
      setView("drive");
    }
  }

  return (
    <section id="fg-app-walkthrough" className={`${styles.walkthrough} project-proof-target`} aria-labelledby="fg-walkthrough-title">
      <header className={styles.header}>
        <p className={styles.kicker}>Interactive prototype</p>
        <h3 id="fg-walkthrough-title">Drive to {trip.name}</h3>
        <p>Try two trips from the iOS prototype. Search for a destination, compare its routes, or open the safety toolkit during a drive.</p>
        <p className={styles.limit}>The map uses sample locations in Brixton and Brooklyn. Route times and light levels come from the iOS captures. Calls, recording, and location sharing stay in the iOS app.</p>
        <a href={trip.preview}>See the {trip.options[trip.initialOption].minutes}-minute route in iOS</a>
      </header>
      <div className={styles.stage}>
        <div className={styles.phone} onKeyDown={event => {
          if (event.key === "Escape" && searching) {
            event.preventDefault();
            setQuery("");
            searchRef.current?.focus({ preventScroll: true });
            setSearching(false);
          }
        }}>
          <div className={styles.status} aria-hidden="true"><b>{trip.clock}</b><span className={styles.island} /><svg width="31" height="12" viewBox="0 0 31 12" fill="none" aria-hidden="true"><path d="M1 4q5-4 10 0M3 6q3-2.5 6 0M5 8q1-1 2 0" stroke="currentColor" strokeWidth="1.5"/><rect x="15" y="2" width="13" height="8" rx="2" stroke="currentColor"/><rect x="17" y="4" width="8" height="4" rx="1" fill="currentColor"/><path d="M30 5v2" stroke="currentColor"/></svg></div>
          {view === "toolkit" ? (
            <div className={styles.toolkit} onKeyDown={event => { if (event.key === "Escape") closeToolkit(); }}>
              <button ref={toolbarBack} type="button" className={styles.back} onClick={closeToolkit}>‹ {tool ? "Safety toolkit" : "Back to drive"}</button>
              <p className={styles.overline}>Safety toolkit</p>
              <h4>{tool?.name ?? "What’s going on?"}</h4>
              {tool ? <>
                <p>{tool.detail}</p>
                {tool.name === "Pulled-over" && <fieldset className={styles.answers}><legend>Are you armed?</legend>
                  {["Yes", "No", "Prefer not to answer"].map(choice => <label key={choice}><input type="radio" name="fg-demo-answer" checked={answer === choice} onChange={() => setAnswer(choice)} />{choice}</label>)}
                </fieldset>}
                {answer && <p role="status">In the app, the next screen uses the answer and the driver’s location.</p>}
                {tool.name === "Pulled-over" && answer ? <a href="#fg-safety-reconstruction">See the U.S. prototype’s pulled-over sequence</a> :
                  <a href={`${captures}/${tool.capture}.png`}>See the original iOS {tool.name.toLowerCase()} screen</a>}
              </> : <div className={styles.tiles}>
                {tools.map((item, index) => <button type="button" ref={el => { toolRefs.current[index] = el; }} key={item.name} onClick={() => { focusAfter.current = "back"; setTool(item); }}>
                  <Image unoptimized src={`${assets}/${item.icon}.svg`} width="36" height="36" alt="" />{item.name}
                </button>)}
              </div>}
            </div>
          ) : <>
            {view === "plan" ? <div className={styles.searchBar}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="10" cy="10" r="6.7"/><path d="m15 15 6 6"/></svg>
              <input ref={searchRef} type="search" aria-label="Search sample destinations" placeholder="Where are you headed?" value={query}
                onClick={() => setSearching(true)} onFocus={() => setSearching(true)}
                onChange={event => { setQuery(event.target.value); setSearching(true); }}
                onKeyDown={event => {
                  if (event.key === "Enter" && !searching) { event.preventDefault(); setSearching(true); return; }
                  if (event.key === "Enter" && matches[0]) { event.preventDefault(); chooseTrip(matches[0]); }
                  if (event.key === "ArrowDown" && searching && matches.length) { event.preventDefault(); firstResult.current?.focus(); }
                }} />
            </div> : <div className={styles.turn}><span aria-hidden="true">↱</span><b>Head out on {trip.street}</b></div>}
            {searching ? <div className={styles.searchResults}>
              <div className={styles.resultTitle}><strong>Sample destinations</strong><button className={styles.textButton} type="button" onClick={() => { setSearching(false); setQuery(""); focusAfter.current = "go"; }}>Cancel</button></div>
              {matches.map((item, index) => <button ref={index === 0 ? firstResult : undefined} className={styles.place} type="button" key={item.id} onClick={() => chooseTrip(item)}><strong>{item.name}</strong><span>{item.area}</span></button>)}
              {matches.length === 0 && <p role="status">No saved places match. Try Brooklyn or Brixton.</p>}
            </div> : <>
              <div className={styles.mapViewport}>
              <TripMap trip={trip} option={option} />
              <div className={styles.mapTools}>
                <button className={styles.mapButton} type="button" aria-expanded={showKey} aria-controls={showKey ? "fg-demo-key" : undefined} onClick={() => setShowKey(!showKey)}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m3 5 6-2 6 3 6-2v15l-6 2-6-3-6 2ZM9 3v15M15 6v15"/></svg>Map key
                </button>
                {view === "drive" && <button className={styles.shield} aria-label="Safety toolkit" title="Safety toolkit" ref={toolkitRef} type="button" onClick={() => { focusAfter.current = "back"; setView("toolkit"); }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3.5 3.5h17V11c0 5-3.3 8.3-8.5 10.2C6.8 19.3 3.5 16 3.5 11Z" fill="#dcecff" stroke="#173a67" strokeWidth="1.6"/><path d="m8.2 11.8 2.4 2.5 5.3-5.4" stroke="#173a67" strokeWidth="1.8"/></svg>
                </button>}
              </div>
              {showKey && <ul className={styles.key} id="fg-demo-key" aria-label="Route line patterns"><li>Daylight</li><li>Dusk</li><li>After dark</li></ul>}
              </div>
              <div className={styles.sheet}>
                <div className={styles.handle} aria-hidden="true" />
                <p className={styles.overline}>{view === "drive" ? "Driving to" : trip.area}</p>
                <h4>{trip.name}</h4>
                {view === "plan" && <div className={styles.routeChoices} role="group" aria-label="Route options">
                  <button type="button" aria-label="Previous route" disabled={option === 0} onClick={() => setOption(option - 1)}>‹</button>
                  <span aria-live="polite" aria-atomic="true">{option + 1} of {trip.options.length}</span>
                  <button type="button" aria-label="Next route" disabled={option === trip.options.length - 1} onClick={() => setOption(option + 1)}>›</button>
                  <span>Via {route.via}</span>
                </div>}
                <div className={styles.times} aria-live="polite" aria-atomic="true">
                  <p><strong>{view === "drive" ? arrival : `${route.minutes} min`}</strong> · {route.miles} mi.</p>
                  <p>{view === "drive" ? `${route.minutes} min remaining` : `Arrive ${arrival}`} · {trip.light}</p>
                  {view === "drive" && <p className={styles.via}>Via {route.via}</p>}
                </div>
                {view === "plan" ? <button type="button" ref={goRef} className={styles.go} onClick={() => changeDrive(true)}>→ Go</button> :
                  <button type="button" ref={endRef} className={styles.end} onClick={() => changeDrive(false)}>End trip</button>}
              </div>
            </>}
          </>}
        </div>
      </div>
      <noscript><p>Open a saved trip to see the original route preview. <a href={sampleTrips[0].preview}>Brixton</a> · <a href={sampleTrips[1].preview}>Brooklyn</a></p></noscript>
    </section>
  );
}
