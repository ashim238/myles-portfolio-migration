"use client";

import { useMemo, useState } from "react";
import { SearchInput } from "@/components/navi/ui";
import { ExperienceCard } from "@/components/navi/demo/ExperienceCard";
import { EXPERIENCES, CATEGORIES } from "@/lib/navi/demo-data";

export default function FeedPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return EXPERIENCES.filter((e) => {
      if (activeCategory && e.category !== activeCategory) return false;
      if (q && !`${e.title} ${e.neighborhood}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, activeCategory]);

  return (
    <div className="nv-feed">
      <header className="nv-feed-head">
        <h1>Find your next neighborhood-led experience</h1>
        <SearchInput
          label="Search experiences"
          value={query}
          onChange={setQuery}
          placeholder="e.g. cooking in Bed-Stuy"
        />
      </header>

      <section className="nv-feed-categories" aria-label="Categories">
        <button
          type="button"
          className={`nv-feed-cat${activeCategory === null ? " nv-feed-cat--active" : ""}`}
          onClick={() => setActiveCategory(null)}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            className={`nv-feed-cat${activeCategory === c ? " nv-feed-cat--active" : ""}`}
            onClick={() => setActiveCategory(c)}
          >
            {c}
          </button>
        ))}
      </section>

      {filtered.length === 0 ? (
        <p className="nv-feed-empty">No experiences match. Try clearing the category or search.</p>
      ) : (
        <ul className="nv-feed-grid">
          {filtered.map((e) => (
            <li key={e.slug}>
              <ExperienceCard
                experience={e}
                href={`/work/navi/demo/experience/${e.slug}`}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
