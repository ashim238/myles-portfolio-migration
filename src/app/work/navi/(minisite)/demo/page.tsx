"use client";

import { useMemo, useState } from "react";
import { SearchInput } from "@/components/navi/ui";
import { ExperienceCard } from "@/components/navi/demo/ExperienceCard";
import { EXPERIENCES, CATEGORIES } from "@/lib/navi/demo-data";

type SortKey = "recommended" | "rating" | "price-asc" | "price-desc";
type PriceBand = "any" | "under30" | "30to60" | "over60";

const PRICE_BANDS: Record<PriceBand, (p: number) => boolean> = {
  any: () => true,
  under30: (p) => p < 30,
  "30to60": (p) => p >= 30 && p <= 60,
  over60: (p) => p > 60,
};

export default function FeedPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("recommended");
  const [priceBand, setPriceBand] = useState<PriceBand>("any");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    const inBand = PRICE_BANDS[priceBand];
    const list = EXPERIENCES.filter((e) => {
      if (activeCategory && e.category !== activeCategory) return false;
      if (!inBand(e.price)) return false;
      if (q && !`${e.title} ${e.neighborhood}`.toLowerCase().includes(q)) return false;
      return true;
    });
    const sorted = [...list];
    if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating);
    else if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    return sorted;
  }, [query, activeCategory, sort, priceBand]);

  const hasFilters = activeCategory !== null || priceBand !== "any" || query !== "" || sort !== "recommended";
  const clearFilters = () => {
    setActiveCategory(null);
    setPriceBand("any");
    setSort("recommended");
    setQuery("");
  };

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
          aria-pressed={activeCategory === null}
          onClick={() => setActiveCategory(null)}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            className={`nv-feed-cat${activeCategory === c ? " nv-feed-cat--active" : ""}`}
            aria-pressed={activeCategory === c}
            onClick={() => setActiveCategory(c)}
          >
            {c}
          </button>
        ))}
      </section>

      <div className="nv-feed-controls">
        <p className="nv-feed-count" role="status">
          {filtered.length} {filtered.length === 1 ? "experience" : "experiences"}
          {activeCategory ? ` in ${activeCategory}` : ""}
        </p>
        <div className="nv-feed-selects">
          <label className="nv-feed-select">
            <span className="nv-sr-only">Filter by price</span>
            <select value={priceBand} onChange={(e) => setPriceBand(e.target.value as PriceBand)}>
              <option value="any">Any price</option>
              <option value="under30">Under $30</option>
              <option value="30to60">$30 to $60</option>
              <option value="over60">Over $60</option>
            </select>
          </label>
          <label className="nv-feed-select">
            <span className="nv-sr-only">Sort experiences</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
              <option value="recommended">Recommended</option>
              <option value="rating">Top rated</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </label>
          {hasFilters && (
            <button type="button" className="nv-feed-clear" onClick={clearFilters}>
              Clear filters
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="nv-feed-empty">
          No experiences match.{" "}
          <button type="button" className="nv-feed-clear" onClick={clearFilters}>
            Clear filters
          </button>
        </p>
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
