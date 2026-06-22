"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { SearchInput } from "@/components/navi/ui";
import { ExperienceCard } from "@/components/navi/demo/ExperienceCard";
import { CategoryIcon } from "@/components/navi/demo/CategoryIcon";
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

  // Horizontal chip rail. Chevrons appear only when there's actually overflow
  // to scroll to, so they don't bait clicks at narrow widths or after the
  // user has scrolled to either end.
  const railRef = useRef<HTMLDivElement | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const updateRail = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);
  useEffect(() => {
    updateRail();
    const el = railRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateRail, { passive: true });
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateRail) : null;
    ro?.observe(el);
    return () => {
      el.removeEventListener("scroll", updateRail);
      ro?.disconnect();
    };
  }, [updateRail]);
  const scrollRail = (dir: -1 | 1) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(240, el.clientWidth * 0.7), behavior: "smooth" });
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

      <div className={`nv-feed-catwrap${canPrev ? " is-prev" : ""}${canNext ? " is-next" : ""}`}>
        {canPrev && (
          <button
            type="button"
            className="nv-cat-nav nv-cat-nav--prev"
            aria-label="Scroll categories left"
            onClick={() => scrollRail(-1)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}
        <section className="nv-feed-categories" aria-label="Categories" ref={railRef}>
          <button
            type="button"
            className={`nv-feed-cat${activeCategory === null ? " nv-feed-cat--active" : ""}`}
            aria-pressed={activeCategory === null}
            onClick={() => setActiveCategory(null)}
          >
            <CategoryIcon name="All" />
            <span>All</span>
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              className={`nv-feed-cat${activeCategory === c ? " nv-feed-cat--active" : ""}`}
              aria-pressed={activeCategory === c}
              onClick={() => setActiveCategory(c)}
            >
              <CategoryIcon name={c} />
              <span>{c}</span>
            </button>
          ))}
        </section>
        {canNext && (
          <button
            type="button"
            className="nv-cat-nav nv-cat-nav--next"
            aria-label="Scroll categories right"
            onClick={() => scrollRail(1)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
      </div>

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
          {filtered.map((e, i) => (
            <li key={e.slug} style={{ "--i": i } as CSSProperties}>
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
