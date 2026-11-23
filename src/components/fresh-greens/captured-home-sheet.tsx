"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { categories, nearbyRows, type PlaceCard } from "./home-sheet-listings";
import styles from "./captured-home-sheet.module.css";

const media = "/projects/fresh-greens/home-sheet/";
const weeksville = "Weeksville Heritage Center";
const trustedIcon = "trustedbycommunity-empty-24";
const emptyMessage = "No spots have been vouched near you yet. Drop a report and let neighbors know where the community shows up.";

function Glyph({ name }: { name: string }) {
  return <Image src={media + name + ".svg"} width={24} height={24} unoptimized alt="" className={styles.glyph} />;
}

export function CapturedHomeSheet({ onCompareWeeksville, initialSearch = false }: { onCompareWeeksville: () => void; initialSearch?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [trustedOpen, setTrustedOpen] = useState(true);
  const [active, setActive] = useState("browse");
  const [searching, setSearching] = useState(initialSearch);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<PlaceCard | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const searchTrigger = useRef<HTMLButtonElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const selectedTrigger = useRef<HTMLButtonElement | null>(null);
  const detailBack = useRef<HTMLButtonElement>(null);
  const startY = useRef(0);
  const draggedHandle = useRef(false);
  const rows = useRef(new Map<string, HTMLElement>());

  useEffect(() => {
    if (initialSearch) searchInput.current?.focus({ preventScroll: true });
  }, [initialSearch]);

  function jump(key: string) {
    setExpanded(true);
    if (key !== "browse") setShowAll(true);
    setActive(key);
    requestAnimationFrame(() => {
      const scroll = scroller.current;
      if (!scroll) return;
      const row = rows.current.get(key);
      scroll.scrollTop = row && strip.current
        ? row.getBoundingClientRect().top - scroll.getBoundingClientRect().top + scroll.scrollTop - strip.current.offsetHeight
        : 0;
    });
  }

  function updateChip() {
    if (!expanded || !strip.current) return;
    const scroll = scroller.current;
    if (!scroll) return;
    const lastRow = [...rows.current.values()].at(-1);
    if (lastRow && scroll.scrollTop > 0 && scroll.scrollHeight - scroll.clientHeight - scroll.scrollTop <= 2) {
      setActive(lastRow.dataset.category || "browse");
      return;
    }
    const pinnedEdge = strip.current.getBoundingClientRect().bottom + 2;
    let key = "browse";
    for (const cat of categories) {
      const row = rows.current.get(cat.id);
      if (row && row.getBoundingClientRect().top <= pinnedEdge) key = cat.id;
    }
    setActive(key);
  }

  function collapse() {
    setExpanded(false);
    setActive("browse");
    if (scroller.current) scroller.current.scrollTop = 0;
  }

  function closeSearch() {
    setSearching(false);
    setQuery("");
    requestAnimationFrame(() => searchTrigger.current?.focus({ preventScroll: true }));
  }

  function closeListing() {
    setSelected(null);
    requestAnimationFrame(() => selectedTrigger.current?.focus({ preventScroll: true }));
  }

  const showWeeksville = !query.trim() || `${weeksville} Brooklyn New York`.toLowerCase().includes(query.trim().toLowerCase());
  return (
    <div className={styles.phone} role="group" aria-label="Fresh Greens home">
      <Image className={styles.map} src={media + "brooklyn-home.webp"} alt="Fresh Greens home map in Brooklyn." fill sizes="(max-width: 680px) 86vw, 400px" unoptimized />
      <button type="button" hidden={searching} ref={searchTrigger} className={styles.mapSearch} aria-label="Where are you headed? Search the sample route" onClick={() => {
        setSearching(true);
        requestAnimationFrame(() => searchInput.current?.focus({ preventScroll: true }));
      }} />
      <div hidden={searching || !!selected} className={styles.sheet} data-expanded={expanded}>
        <button type="button" className={styles.handle} aria-label={expanded ? "Collapse recommendations" : "Expand recommendations"} aria-expanded={expanded}
          onClick={() => { if (!draggedHandle.current) { if (expanded) collapse(); else setExpanded(true); } draggedHandle.current = false; }}
          onPointerDown={event => { startY.current = event.clientY; draggedHandle.current = false; event.currentTarget.setPointerCapture?.(event.pointerId); }}
          onPointerUp={event => {
            const dy = event.clientY - startY.current;
            if (Math.abs(dy) > 18) {
              draggedHandle.current = true;
              if (dy < 0) setExpanded(true);
              else collapse();
            }
          }}><span /></button>
        <div ref={scroller} className={styles.scroll} onScroll={updateChip}>
          <div className={styles.meta}>
            <span>Your Local Recs</span>
            <div className={styles.area}><strong>Kings County, New York</strong><div className={styles.weather}>
              <span><Glyph name="weather-glyph" />60°</span><span><Glyph name="driving-glyph" />Driving · Good</span>
            </div></div>
          </div>
          <div ref={strip} className={styles.strip}>
            <div className={styles.chips} role="group" aria-label="Jump to a recommendation category">
              <button type="button" aria-current={active === "browse" ? "location" : undefined} onClick={() => jump("browse")}><span aria-hidden="true">◎</span>Browse</button>
              {categories.map(cat => <button type="button" key={cat.id} aria-current={active === cat.id ? "location" : undefined} onClick={() => jump(cat.id)}><Glyph name={cat.icon} />{cat.label}</button>)}
            </div>
          </div>
          <button type="button" className={styles.trusted} aria-expanded={expanded && trustedOpen} onClick={() => { if (expanded) setTrustedOpen(!trustedOpen); else {setTrustedOpen(true); setExpanded(true);} }}>
            <Glyph name={trustedIcon} />Trusted by your community<span aria-hidden="true">{expanded && !trustedOpen ? "▾" : "▴"}</span>
          </button>
          {expanded && <>
            {trustedOpen && <div className={styles.empty}>
              <Glyph name={trustedIcon} /><strong>Be the first community signal</strong><span>{emptyMessage}</span>
            </div>}
            {nearbyRows.slice(0, showAll ? nearbyRows.length : 2).map(row => (
              <section className={styles.row} key={row.id} data-category={row.id} ref={node => { if (node) rows.current.set(row.id, node); else rows.current.delete(row.id); }}>
                <h4>{row.icon ? <Glyph name={row.icon} /> : <span aria-hidden="true">◷</span>}{row.label}</h4>
                {row.places.length > 0 && <p className={styles.note}>From the app’s Alabama sample catalog</p>}
                {row.note && <p className={styles.note}>{row.note}</p>}
                {row.places.length > 0 && <div className={styles.cards} role="group" aria-label={row.label + " listings"}>
                  {row.places.map(place => <button key={place.name} type="button" className={styles.card} onClick={event => {
                    selectedTrigger.current = event.currentTarget;
                    setSelected(place);
                    requestAnimationFrame(() => detailBack.current?.focus({ preventScroll: true }));
                  }}>
                    <span className={styles.art}><Glyph name={place.icon} /><span className={styles.quote}>{place.detail}</span></span>
                    <strong>{place.name}</strong><span>{place.kind}</span><small>{place.location}</small>
                  </button>)}
                </div>}
              </section>
            ))}
            {!showAll && <button type="button" className={styles.showAll} onClick={() => setShowAll(true)}>Show all categories <span aria-hidden="true">⌄</span></button>}
          </>}
        </div>
      </div>
      {selected && !searching && <div className={styles.details}>
        <button type="button" className={styles.back} ref={detailBack} onClick={closeListing}>‹ Back to recommendations</button>
        <div className={styles.detailIcon}><Glyph name={selected.icon} /></div>
        <strong>{selected.name}</strong><span>{selected.kind}</span><p>{selected.location}</p><small>From the app’s Alabama sample catalog</small>
        {selected.detail && <p>{selected.detail}</p>}
      </div>}
      {searching && <div className={styles.search}>
        <form onSubmit={event => { event.preventDefault(); if (showWeeksville) onCompareWeeksville(); }}>
          <button type="button" aria-label="Back to Home" className={styles.back} onClick={closeSearch}>‹</button>
          <input ref={searchInput} type="search" placeholder="Where are you headed?" aria-label="Search the sample destination" value={query}
            onChange={event => setQuery(event.target.value)} onKeyDown={event => { if (event.key === "Escape") {event.stopPropagation(); closeSearch();} }} />
        </form>
        <p>Sample destination</p>
        {showWeeksville ? <button type="button" className={styles.result} onClick={onCompareWeeksville}>
          <span aria-hidden="true">◷</span><span><strong>{weeksville}</strong><small>Brooklyn, New York</small></span>
        </button> : <p role="status">Try “Weeksville” to compare the two captured routes.</p>}
      </div>}
    </div>
  );
}
