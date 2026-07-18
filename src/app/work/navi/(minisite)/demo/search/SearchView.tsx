"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Button, SearchInput } from "@/components/navi/ui";
import { ResultCard } from "@/components/navi/demo/ResultCard";
import { Map } from "@/components/navi/demo/Map";
import { Legend } from "@/components/navi/demo/Legend";
import type { ExperienceSummary } from "@/lib/navi/experience-summary";
import { motionSafeScrollBehavior } from "@/lib/navi/motion";

const PAGE_SIZE = 12;
const SEARCH_CENTER: [number, number] = [40.68, -73.95];

export function SearchView({ experiences }: { experiences: ExperienceSummary[] }) {
  const [query, setQuery] = useState("");
  const [hovered, setHovered] = useState<string | undefined>(undefined);
  // `picked` is the sticky selection from a pin click. It persists until the
  // next click (or hover) so the user still sees which card the pin maps to
  // after the scroll lands. Hover wins while pointing, otherwise picked stays.
  const [picked, setPicked] = useState<string | undefined>(undefined);
  const pulseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const results = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return experiences;
    return experiences.filter((e) =>
      `${e.title} ${e.neighborhood}`.toLowerCase().includes(q),
    );
  }, [query, experiences]);

  const visibleResults = useMemo(
    () => results.slice(0, visibleCount),
    [results, visibleCount],
  );

  const markers = useMemo(
    () =>
      visibleResults.map((e) => ({
        id: e.slug,
        lat: e.lat,
        lng: e.lng,
        label: e.price === 0 ? "Free" : `$${e.price}`,
        accessibleLabel: `${e.title}, ${e.price === 0 ? "free" : `$${e.price}`}`,
      })),
    [visibleResults],
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
      <section className="nv-search-list" aria-labelledby="nv-search-results-title">
        <header className="nv-search-head">
          <h1
            id="nv-search-results-title"
            className="nv-search-count"
            aria-live="polite"
            aria-atomic="true"
          >
            {results.length} nearby experiences
          </h1>
          <SearchInput
            label="Search experiences"
            value={query}
            onChange={(value) => {
              setQuery(value);
              setVisibleCount(PAGE_SIZE);
            }}
            placeholder="Search"
          />
        </header>
        {results.length === 0 ? (
          <p className="nv-search-empty" role="status">
            No matches. Try a broader term.
          </p>
        ) : (
          <>
            <p className="nv-search-visible-count" role="status">
              Showing {Math.min(visibleCount, results.length)} of {results.length} results
            </p>
            <ul className="nv-search-results">
              {visibleResults.map((e) => (
                <li key={e.slug} id={`search-result-${e.slug}`} className="nv-search-result">
                  <ResultCard
                    experience={e}
                    href={`/work/navi/demo/experience/${e.slug}`}
                    onHover={setHovered}
                    headingLevel={2}
                  />
                </li>
              ))}
            </ul>
          </>
        )}
        {results.length > PAGE_SIZE && (
          <Button
            variant="outline"
            className="nv-search-load-more"
            disabled={visibleCount >= results.length}
            onClick={() => setVisibleCount((count) => Math.min(count + PAGE_SIZE, results.length))}
          >
            {visibleCount >= results.length
              ? `All ${results.length} experiences shown`
              : `Load ${Math.min(PAGE_SIZE, results.length - visibleCount)} more ${
                  results.length - visibleCount === 1 ? "experience" : "experiences"
                }`}
          </Button>
        )}
      </section>
      <div className="nv-search-map">
        <Map
          center={SEARCH_CENTER}
          zoom={12}
          markers={markers}
          selectedId={hovered ?? picked}
          onSelect={onPinSelect}
          currentLocation={SEARCH_CENTER}
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
