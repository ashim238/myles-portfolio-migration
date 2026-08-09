"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Button, SearchInput } from "@/components/navi/ui";
import { ExperienceCard } from "@/components/navi/demo/ExperienceCard";
import { CategoryIcon } from "@/components/navi/demo/CategoryIcon";
import { FiltersSlideOver } from "@/components/navi/demo/FiltersSlideOver";
import { DEFAULT_FILTERS, activeCount, type Filters } from "@/components/navi/demo/filters";
import type { ExperienceSummary } from "@/lib/navi/experience-summary";
import { motionSafeScrollBehavior } from "@/lib/navi/motion";

type SortKey = "recommended" | "rating" | "price-asc" | "price-desc";
const PAGE_SIZE = 12;

const PRICE_TEST: Record<Filters["price"], (p: number) => boolean> = {
  any: () => true,
  under30: (p) => p < 30,
  "30to60": (p) => p >= 30 && p <= 60,
  over60: (p) => p > 60,
};

function durationToMinutes(s: string): number | null {
  const lower = s.toLowerCase();
  const num = parseFloat(lower);
  if (Number.isNaN(num)) return null;
  if (lower.includes("min")) return Math.round(num);
  if (lower.includes("hour")) return Math.round(num * 60);
  return null;
}

function durationMatches(band: Filters["duration"], duration: string): boolean {
  if (band === "any") return true;
  const mins = durationToMinutes(duration);
  if (mins === null) return false;
  if (band === "under2h") return mins < 120;
  if (band === "halfDay") return mins >= 120 && mins < 300;
  if (band === "fullDay") return mins >= 300;
  return true;
}

function groupMatches(band: Filters["group"], group: string): boolean {
  if (band === "any") return true;
  const m = group.match(/(\d+)/);
  // Open-capacity listings ("Drop in anytime") carry no number. They take any
  // size group, so they belong in the large band rather than vanishing.
  if (!m) return band === "large";
  const max = parseInt(m[1], 10);
  if (band === "small") return max <= 8;
  if (band === "large") return max > 8;
  return true;
}

export function FeedView({
  experiences,
  categories,
}: {
  experiences: ExperienceSummary[];
  categories: string[];
}) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("recommended");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [slideOverOpen, setSlideOverOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const allLanguages = useMemo(
    () => Array.from(new Set(experiences.map((e) => e.language))).sort(),
    [experiences],
  );
  const allNeighborhoods = useMemo(
    () =>
      Array.from(new Set(experiences.map((e) => e.neighborhood))).filter(Boolean).sort(),
    [experiences],
  );

  const applyFilters = useCallback(
    (list: ExperienceSummary[], f: Filters) => {
      const q = query.toLowerCase();
      const inPrice = PRICE_TEST[f.price];
      return list.filter((e) => {
        if (activeCategory && e.category !== activeCategory) return false;
        if (!inPrice(e.price)) return false;
        if (!durationMatches(f.duration, e.duration)) return false;
        if (!groupMatches(f.group, e.groupSize)) return false;
        if (f.languages.length > 0 && !f.languages.includes(e.language)) return false;
        if (f.neighborhoods.length > 0 && !f.neighborhoods.includes(e.neighborhood)) {
          return false;
        }
        const haystack = `${e.title} ${e.neighborhood}`;
        if (q && !haystack.toLowerCase().includes(q)) return false;
        return true;
      });
    },
    [query, activeCategory],
  );

  const filtered = useMemo(() => {
    const list = applyFilters([...experiences], filters);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    else if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [applyFilters, sort, filters, experiences]);

  const hasFilters =
    activeCategory !== null ||
    activeCount(filters) > 0 ||
    query !== "" ||
    sort !== "recommended";

  const clearFilters = () => {
    setActiveCategory(null);
    setFilters(DEFAULT_FILTERS);
    setSort("recommended");
    setQuery("");
    setVisibleCount(PAGE_SIZE);
  };

  const matchCountFor = useCallback(
    (draft: Filters) => applyFilters([...experiences], draft).length,
    [applyFilters, experiences],
  );

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
    el.scrollBy({
      left: dir * Math.max(240, el.clientWidth * 0.7),
      behavior: motionSafeScrollBehavior(),
    });
  };

  return (
    <div className="nv-feed">
      <header className="nv-feed-head">
        <h1>Find your next neighborhood-led experience</h1>
        <SearchInput
          label="Search experiences"
          value={query}
          onChange={(value) => {
            setQuery(value);
            setVisibleCount(PAGE_SIZE);
          }}
          placeholder="e.g. cooking in Bed-Stuy"
        />
      </header>

      <div className="nv-feed-row">
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
              onClick={() => {
                setActiveCategory(null);
                setVisibleCount(PAGE_SIZE);
              }}
            >
              <CategoryIcon name="All" />
              <span>All</span>
            </button>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                className={`nv-feed-cat${activeCategory === c ? " nv-feed-cat--active" : ""}`}
                aria-pressed={activeCategory === c}
                onClick={() => {
                  setActiveCategory(c);
                  setVisibleCount(PAGE_SIZE);
                }}
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
        <div className="nv-feed-divider" aria-hidden="true" />
        <div className="nv-feed-actions">
          <label className="nv-feed-select">
            <span className="nv-sr-only">Sort experiences</span>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as SortKey);
                setVisibleCount(PAGE_SIZE);
              }}
            >
              <option value="recommended">Recommended</option>
              <option value="rating">Top rated</option>
              <option value="price-asc">Lowest price</option>
              <option value="price-desc">Highest price</option>
            </select>
          </label>
          <button
            type="button"
            className="nv-feed-filters"
            onClick={() => setSlideOverOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={slideOverOpen}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <line x1="4" y1="6" x2="20" y2="6" />
              <circle cx="9" cy="6" r="2" fill="currentColor" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <circle cx="15" cy="12" r="2" fill="currentColor" />
              <line x1="4" y1="18" x2="20" y2="18" />
              <circle cx="11" cy="18" r="2" fill="currentColor" />
            </svg>
            <span>Filters</span>
            {activeCount(filters) > 0 && (
              <span className="nv-feed-filters-badge" aria-label={`${activeCount(filters)} active`}>
                {activeCount(filters)}
              </span>
            )}
          </button>
          {hasFilters && (
            <button type="button" className="nv-feed-clear" onClick={clearFilters}>
              Clear filters
            </button>
          )}
        </div>
      </div>

      <p className="nv-feed-count" role="status">
        Showing {Math.min(visibleCount, filtered.length)} of {filtered.length}{" "}
        {filtered.length === 1 ? "experience" : "experiences"}
        {activeCategory ? ` in ${activeCategory}` : ""}
      </p>

      {filtered.length === 0 ? (
        <p className="nv-feed-empty">
          No experiences match.{" "}
          <button type="button" className="nv-feed-clear" onClick={clearFilters}>
            Clear filters
          </button>
        </p>
      ) : (
        <ul className="nv-feed-grid">
          {filtered.slice(0, visibleCount).map((e, i) => (
            <li key={e.slug} style={{ "--i": i } as CSSProperties}>
              <ExperienceCard
                experience={e}
                href={`/work/navi/demo/experience/${e.slug}`}
                headingLevel={2}
                preload={i === 0}
              />
            </li>
          ))}
        </ul>
      )}

      {filtered.length > PAGE_SIZE && (
        <Button
          variant="outline"
          className="nv-feed-load-more"
          disabled={visibleCount >= filtered.length}
          onClick={() => setVisibleCount((count) => Math.min(count + PAGE_SIZE, filtered.length))}
        >
          {visibleCount >= filtered.length
            ? `All ${filtered.length} experiences shown`
            : `Load ${Math.min(PAGE_SIZE, filtered.length - visibleCount)} more ${
                filtered.length - visibleCount === 1 ? "experience" : "experiences"
              }`}
        </Button>
      )}

      <FiltersSlideOver
        open={slideOverOpen}
        initial={filters}
        languageOptions={allLanguages}
        neighborhoodOptions={allNeighborhoods}
        matchCountFor={matchCountFor}
        onApply={(nextFilters) => {
          setFilters(nextFilters);
          setVisibleCount(PAGE_SIZE);
        }}
        onClose={() => setSlideOverOpen(false)}
      />
    </div>
  );
}
