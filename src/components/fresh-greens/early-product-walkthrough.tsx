"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { arrivalTime, sampleTrips, type SampleTrip } from "./sample-trips";
import { TripMap } from "./trip-map";
import styles from "./early-product-walkthrough.module.css";

const assets = "/projects/fresh-greens/pocket-map";
const captures = "/projects/fresh-greens/v2";
const tools = [
  { name: "Pulled-over", icon: "safety-pulled-over", capture: "pulled-over-armed-organic", detail: "The first question narrows down which guidance applies." },
  { name: "Roadside assistance", icon: "safety-car-troubles", capture: "roadside", detail: "The iOS app asks what happened and lets you look up nearby tow services." },
  { name: "Unfamiliar area", icon: "safety-lost", capture: "unfamiliar", detail: "A driver can look for a well-lit place, a gas station, or a nearby on-ramp." },
  { name: "Share location", icon: "safety-share-location", capture: "share-location", detail: "In the iOS app, the driver picks a reason to share the trip with a trusted contact." },
] as const;

// All layout measurements inside the handset use the simulator’s 430 × 932 point canvas.
function PhoneFrame({ children, mode, district }: { children: ReactNode; mode: string; district: string }) {
  const frame = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (typeof CSS !== "undefined" && CSS.supports?.("transform", "scale(calc(100cqw / 430px))")) return;
    const device = frame.current;
    if (!device || typeof ResizeObserver === "undefined") return;
    const sync = () => device.style.setProperty("--screen-scale", String(device.clientWidth / 430));
    sync();
    const resize = new ResizeObserver(sync);
    resize.observe(device);
    return () => resize.disconnect();
  }, []);
  return <div className={styles.device} ref={frame}><div className={styles.phone} data-view={mode} data-city={district}>{children}</div></div>;
}

const iconPaths = {
  search: "M16 10a6 6 0 1 1-12 0 6 6 0 0 1 12 0Zm-1.5 4.5L21 21",
  bookmark: "M6 3h12v18l-6-4.5L6 21Zm0 11.5 6-4 6 4",
  close: "m6 6 12 12M18 6 6 18",
  previous: "m15 4-8 8 8 8",
  next: "m9 4 8 8-8 8",
  map: "m2 5 7-2 6 3 7-2v15l-7 2-6-3-7 2Zm7-2v15m6-12v15",
  shield: "M3 4h18v7c0 5-4 8.5-9 11-5-2.5-9-6-9-11Zm5.5 8 2.5 2.5 4.8-5.5",
  route: "M3 6h12a3 3 0 0 1 0 6H7a3 3 0 0 0 0 6h9m4-3a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z",
  pointer: "m3 3 19 7-10 3-3 9Z",
  moon: "M19.7 15.8A9 9 0 0 1 8.2 4.3 9 9 0 1 0 19.7 15.8Z",
  sun: "M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0ZM12 1v2m0 18v2M1 12h2m18 0h2M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2",
} as const;

function PhoneIcon({ name, size = 24 }: { name: keyof typeof iconPaths; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={name === "shield" ? "#c1daf4" : "none"} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={iconPaths[name]}/></svg>;
}

export function EarlyProductWalkthrough() {
  const [trip, setTrip] = useState<SampleTrip>(sampleTrips[0]);
  const [option, setOption] = useState<number>(sampleTrips[0].initialOption);
  const [view, setView] = useState<"plan" | "drive" | "toolkit">("plan");
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");
  const [showKey, setShowKey] = useState(true);
  const [saved, setSaved] = useState<readonly string[]>([]);
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
  const daylight = trip.light === "Daylight";
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
    setShowKey(true);
    focusAfter.current = "go";
  }

  function changeDrive(driving: boolean) {
    focusAfter.current = driving ? "end" : "go";
    setShowKey(!driving);
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

  function openSearch() {
    setView("plan");
    setSearching(true);
    setQuery("");
  }

  useEffect(() => {
    if (searching) searchRef.current?.focus({ preventScroll: true });
  }, [searching]);

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
        <PhoneFrame mode={view} district={trip.id}>
          <div className={styles.screen} onKeyDown={event => {
          if (event.key === "Escape" && searching) {
            event.preventDefault();
            setQuery("");
            searchRef.current?.focus({ preventScroll: true });
            setSearching(false);
          }
        }}>
          <div className={styles.status} aria-hidden="true">
            <b>{trip.clock}</b><span className={styles.island} />
            <svg width="85" height="19" viewBox="0 0 85 19" fill="currentColor"><path opacity=".28" d="M1 12h3v4H1zm5 0h3v4H6zm5 0h3v4h-3zm5 0h3v4h-3z"/>
              <path d="M30 6q10-9 20 0l-2.2 2.3q-8-7-15.6 0ZM34 10q6-5.5 12 0l-2.4 2.3q-3.6-3-7.2 0Zm4 4q2-2 4 0l-2 2Z"/>
              <rect x="58" y="3" width="24" height="13" rx="3.5" fill="none" stroke="currentColor" opacity=".55"/><rect x="60" y="5" width="20" height="9" rx="2"/><path d="M84 7v5" stroke="currentColor"/></svg>
          </div>
          {view === "toolkit" ? (
            <div className={styles.toolkit} onKeyDown={event => { if (event.key === "Escape") closeToolkit(); }}>
              <button ref={toolbarBack} type="button" className={styles.back} onClick={closeToolkit}>‹ {tool ? "Safety toolkit" : "Back to drive"}</button>
              <span className={styles.toolkitShield}><PhoneIcon name="shield" size={30} /></span>
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
                  <span className={styles.tileArt}><Image unoptimized src={`${assets}/${item.icon}.svg`} width="48" height="48" alt="" /></span>{item.name}
                </button>)}
              </div>}
            </div>
          ) : <>
            {view === "plan" ? <div className={styles.searchBar}>
              <PhoneIcon name="search" />
              <input ref={searchRef} type="search" aria-label="Search sample destinations" placeholder="Where are you headed?" value={query}
                onClick={() => setSearching(true)} onFocus={() => setSearching(true)}
                onChange={event => { setQuery(event.target.value); setSearching(true); }}
                onKeyDown={event => {
                  if (event.key === "Enter" && !searching) { event.preventDefault(); setSearching(true); return; }
                  if (event.key === "Enter" && matches[0]) { event.preventDefault(); chooseTrip(matches[0]); }
                  if (event.key === "ArrowDown" && searching && matches.length) { event.preventDefault(); firstResult.current?.focus(); }
                }} />
            </div> : <div className={styles.turn}>
              <div className={styles.instruction}><PhoneIcon name="pointer" size={44}/><div><b>Head out on {trip.street}</b><span>now</span></div></div>
              {daylight && <span className={styles.turnHazard} role="img" aria-label="Road condition ahead"><i className={styles.hazardIcon} aria-hidden="true">!</i></span>}
              <div className={styles.nextTurn}>Then <span aria-hidden="true">{daylight ? "↱" : "↰"}</span></div>
            </div>}
            {searching ? <div className={styles.searchResults}>
              <div className={styles.resultTitle}><strong>Sample destinations</strong><button className={styles.textButton} type="button" onClick={() => { setSearching(false); setQuery(""); focusAfter.current = "go"; }}>Cancel</button></div>
              {matches.map((item, index) => <button ref={index === 0 ? firstResult : undefined} className={styles.place} type="button" key={item.id} onClick={() => chooseTrip(item)}><strong>{item.name}</strong><span>{item.area}</span></button>)}
              {matches.length === 0 && <p role="status">No saved places match. Try Brooklyn or Brixton.</p>}
            </div> : <>
              <div className={styles.mapViewport}>
                <TripMap trip={trip} option={option} driving={view === "drive"} />
                <div className={styles.mapTools}>
                  <div className={showKey ? styles.legend : undefined}>
                    {showKey && <ul id="fg-demo-key" className={styles.key} aria-label="Route line patterns"><li>Daylight</li><li>Dusk</li><li>After dark</li></ul>}
                    <button type="button" className={showKey ? undefined : styles.mapButton}
                      aria-label={showKey ? "Close map key" : "Map key"} aria-expanded={showKey}
                      aria-controls={showKey ? "fg-demo-key" : undefined} onClick={() => setShowKey(!showKey)}>
                      {showKey ? <PhoneIcon name="close" size={16}/> : <><PhoneIcon name="map" size={16}/> Map key</>}
                    </button>
                  </div>
                </div>
                {view === "drive" && <div className={styles.speed} role="img" aria-label={`Speed limit ${daylight ? 25 : 20} miles per hour. Current speed unavailable.`}>
                  <strong>{daylight ? 25 : 20}</strong><span>—<small>mph</small></span>
                </div>}
                {view === "drive" && <button className={styles.shield} aria-label="Safety toolkit" title="Safety toolkit" ref={toolkitRef} type="button" onClick={() => { focusAfter.current = "back"; setView("toolkit"); }}><PhoneIcon name="shield" size={27}/></button>}
              </div>
              <div className={styles.sheet}>
                <div className={styles.handle} aria-hidden="true" />
                {view === "plan" ? <>
                  <div className={styles.destination}>
                    <h4>{trip.name}</h4>
                    <button className={styles.circle} type="button" aria-label={`Save ${trip.name}`} aria-pressed={saved.includes(trip.id)} onClick={() => setSaved(prev => prev.includes(trip.id) ? prev.filter(id => id !== trip.id) : [...prev, trip.id])}><PhoneIcon name="bookmark" size={20}/></button>
                    <button className={styles.circle} type="button" aria-label="Change destination" onClick={openSearch}><PhoneIcon name="close" size={18}/></button>
                  </div>
                  <div className={styles.routeChoices} role="group" aria-label="Route options">
                    <button className={styles.circle} type="button" aria-label="Previous route" disabled={option === 0} onClick={() => setOption(option - 1)}><PhoneIcon name="previous" size={16}/></button>
                    <span aria-live="polite" aria-atomic="true">{option + 1} of {trip.options.length}</span>
                    <button className={styles.circle} type="button" aria-label="Next route" disabled={option === trip.options.length - 1} onClick={() => setOption(option + 1)}><PhoneIcon name="next" size={16}/></button>
                    <span>Via {route.via}</span>
                  </div>
                  <div className={styles.facts} aria-live="polite" aria-atomic="true">
                    <p><strong>{route.minutes} min</strong> · {route.miles} mi.</p>
                    <p>Arrive {arrival} · <PhoneIcon name={daylight ? "sun" : "moon"} size={16}/> {trip.light}</p>
                  </div>
                  <div className={styles.condition}>{daylight ? <><small>Along this route:</small><span><i className={styles.hazardIcon} aria-hidden="true">!</i>{route.conditions} road {route.conditions === 1 ? "condition" : "conditions"}</span></> : route.conditions === 0 ? <span>✓ &nbsp;All clear</span> : <span data-unknown="">Conditions unavailable</span>}</div>
                  <button type="button" ref={goRef} className={styles.go} onClick={() => changeDrive(true)}><span aria-hidden="true">→</span> Go</button>
                </> : <>
                  <div className={styles.drivingRow}>
                    <button className={styles.circle} type="button" aria-label="Change destination" onClick={openSearch}><PhoneIcon name="search"/></button>
                    <div className={styles.eta}><b>{arrival.split(" ")[0]}</b><PhoneIcon name={daylight ? "sun" : "moon"} size={16}/><span>{trip.light}</span></div>
                    <button className={styles.circle} type="button" aria-label="Compare routes" onClick={() => changeDrive(false)}><PhoneIcon name="route"/></button>
                  </div>
                  <p className={styles.remaining}>{route.miles} mi. · {route.minutes} min</p>
                  <button type="button" ref={endRef} className={styles.end} onClick={() => changeDrive(false)}>End trip</button>
                </>}
              </div>
            </>}
          </>}
          </div>
        </PhoneFrame>
      </div>
      <noscript><p>Open a saved trip to see the original route preview. <a href={sampleTrips[0].preview}>Brixton</a> · <a href={sampleTrips[1].preview}>Brooklyn</a></p></noscript>
    </section>
  );
}
