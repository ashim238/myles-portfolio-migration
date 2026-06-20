"use client";

import { useMemo, useState } from "react";
import { SearchInput } from "@/components/navi/ui";
import { ResultCard } from "@/components/navi/demo/ResultCard";
import { Map } from "@/components/navi/demo/Map";
import { Legend } from "@/components/navi/demo/Legend";
import { EXPERIENCES } from "@/lib/navi/demo-data";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [hovered, setHovered] = useState<string | undefined>(undefined);

  const results = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return EXPERIENCES;
    return EXPERIENCES.filter((e) =>
      `${e.title} ${e.neighborhood}`.toLowerCase().includes(q),
    );
  }, [query]);

  const markers = useMemo(
    () => results.map((e) => ({ id: e.slug, lat: e.lat, lng: e.lng, label: `$${e.price}` })),
    [results],
  );

  return (
    <div className="nv-search-page">
      <aside className="nv-search-list">
        <header className="nv-search-head">
          <h1 className="nv-search-count">{results.length} nearby experiences</h1>
          <SearchInput
            label="Search experiences"
            value={query}
            onChange={setQuery}
            placeholder="Search"
          />
        </header>
        {results.length === 0 ? (
          <p className="nv-search-empty">No matches. Try a broader term.</p>
        ) : (
          <ul className="nv-search-results">
            {results.map((e) => (
              <li key={e.slug}>
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
          selectedId={hovered}
        />
        <Legend />
      </div>
    </div>
  );
}
