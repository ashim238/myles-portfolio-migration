"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { SearchInput } from "@/components/navi/ui";
import { ResultCard } from "@/components/navi/demo/ResultCard";
import { Map } from "@/components/navi/demo/Map";
import { Legend } from "@/components/navi/demo/Legend";
import { EXPERIENCES } from "@/lib/navi/demo-data";
import { motionSafeScrollBehavior } from "@/lib/navi/motion";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [hovered, setHovered] = useState<string | undefined>(undefined);
  // `picked` is the sticky selection from a pin click. It persists until the
  // next click (or hover) so the user still sees which card the pin maps to
  // after the scroll lands. Hover wins while pointing, otherwise picked stays.
  const [picked, setPicked] = useState<string | undefined>(undefined);
  const pulseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const results = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return EXPERIENCES;
    return EXPERIENCES.filter((e) =>
      `${e.title} ${e.neighborhood}`.toLowerCase().includes(q),
    );
  }, [query]);

  const markers = useMemo(
    () =>
      results.map((e) => ({
        id: e.slug,
        lat: e.lat,
        lng: e.lng,
        label: e.price === 0 ? "Free" : `$${e.price}`,
      })),
    [results],
  );

  const onPinSelect = useCallback((id: string) => {
    setPicked(id);
    const el = document.getElementById(`search-result-${id}`);
    if (!el) return;
    el.scrollIntoView({ behavior: motionSafeScrollBehavior(), block: "center" });
    el.dataset.pulse = "true";
    if (pulseTimer.current) clearTimeout(pulseTimer.current);
    pulseTimer.current = setTimeout(() => {
      delete el.dataset.pulse;
    }, 1400);
  }, []);

  return (
    <div className="nv-search-page">
      <aside className="nv-search-list">
        <header className="nv-search-head">
          <h1 className="nv-search-count" aria-live="polite" aria-atomic="true">
            {results.length} nearby experiences
          </h1>
          <SearchInput
            label="Search experiences"
            value={query}
            onChange={setQuery}
            placeholder="Search"
          />
        </header>
        {results.length === 0 ? (
          <p className="nv-search-empty" role="status">
            No matches. Try a broader term.
          </p>
        ) : (
          <ul className="nv-search-results">
            {results.map((e) => (
              <li key={e.slug} id={`search-result-${e.slug}`} className="nv-search-result">
                <ResultCard
                  experience={e}
                  href={`/work/navi/demo/experience/${e.slug}`}
                  onHover={setHovered}
                />
              </li>
            ))}
          </ul>
        )}
      </aside>
      <div className="nv-search-map">
        <Map
          center={[40.68, -73.95]}
          zoom={12}
          markers={markers}
          selectedId={hovered ?? picked}
          onSelect={onPinSelect}
          currentLocation={[40.68, -73.95]}
          fitToMarkers
        />
        {results.length === 0 && (
          <p className="nv-map-empty" aria-hidden="true">
            No matches. Try a broader term.
          </p>
        )}
        <Legend />
      </div>
    </div>
  );
}
