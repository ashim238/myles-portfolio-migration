"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { ProjectChapterEntry } from "@/lib/project-chapters";

type ProjectTocItem = Pick<ProjectChapterEntry, "id" | "title"> & {
  stage?: string;
};

type ProjectTocProps = {
  sections: readonly ProjectTocItem[];
  readingEndId?: string;
};

const WORDS_PER_MIN = 225;

function formatReadout(progress: number, totalMin: number): string {
  const pct = Math.round(progress * 100);
  if (pct <= 0) return `${Math.max(1, totalMin)} min read`;
  const left = Math.max(0, Math.ceil(totalMin * (1 - progress)));
  if (pct >= 100 || left === 0) return "Finished";
  return `${pct}% · ${left} min left`;
}

function completeChapterTitle(chapter: ProjectTocItem) {
  return chapter.stage
    ? `${chapter.stage}: ${chapter.title}`
    : chapter.title;
}

function displayChapterTitle(title: string) {
  // Chapters can carry a numbered action in their full heading. The ToC
  // already supplies its own ordinal, so repeating it makes the compact
  // navigation harder to scan, especially on a narrow screen.
  return title.replace(/^\d+\.\s+/, "");
}

export function ProjectToc({ sections, readingEndId }: ProjectTocProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const activeIdRef = useRef("");
  const tocRef = useRef<HTMLElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLAnchorElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const backTopRef = useRef<HTMLButtonElement>(null);
  const reducedRef = useRef(false);
  const enhancementPartsRef = useRef({
    sections: false,
    sticky: false,
    resize: false,
  });

  const updateEnhancement = useCallback(
    (part: keyof typeof enhancementPartsRef.current, ready: boolean) => {
      enhancementPartsRef.current[part] = ready;
      const toc = tocRef.current;
      if (!toc) return;

      if (Object.values(enhancementPartsRef.current).every(Boolean)) {
        toc.dataset.tocReady = "true";
      } else {
        delete toc.dataset.tocReady;
      }
    },
    [],
  );

  const commitActiveId = useCallback((id: string) => {
    if (!id || activeIdRef.current === id) return;
    activeIdRef.current = id;
    setActiveId(id);
  }, []);

  useEffect(() => () => {
    const toc = tocRef.current;
    if (toc) delete toc.dataset.tocReady;
  }, []);

  // Confirm the chapter anchors exist before the enhanced mobile control
  // replaces the server-rendered list. Active chapter tracking is handled by
  // the reading playhead below so it remains correct inside long chapters in
  // both scroll directions.
  useEffect(() => {
    const sectionEls = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean) as HTMLElement[];

    updateEnhancement("sections", sectionEls.length === sections.length);
    return () => {
      updateEnhancement("sections", false);
    };
  }, [sections, updateEnhancement]);

  // Track sticky state via sentinel element
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (
      !sentinel ||
      typeof window.IntersectionObserver !== "function"
    ) {
      updateEnhancement("sticky", false);
      return;
    }

    let observer: IntersectionObserver | undefined;
    try {
      observer = new IntersectionObserver(
        ([entry]) => {
          setIsSticky(!entry.isIntersecting);
        },
        { threshold: 0 },
      );
      observer.observe(sentinel);
    } catch {
      observer?.disconnect();
      updateEnhancement("sticky", false);
      return;
    }

    updateEnhancement("sticky", true);
    return () => {
      observer?.disconnect();
      updateEnhancement("sticky", false);
    };
  }, [updateEnhancement]);

  // ── The reading instrument ──────────────────────────────────────────────
  // A scroll-driven loop fills each section's rail as you read through it,
  // marks passed sections "read", drives the overall progress var, and
  // updates the reading-time readout. All writes are direct DOM mutations
  // (CSS custom properties + textContent) so high-frequency scroll updates
  // never trigger a React re-render. activeId stays React state because it
  // changes at most once per section.
  useEffect(() => {
    reducedRef.current =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const nav = tocRef.current;
    const list = listRef.current;
    if (!nav || !list) return;
    if (typeof window.ResizeObserver !== "function") {
      updateEnhancement("resize", false);
      return;
    }

    const article = nav.closest<HTMLElement>(".project-page") ?? document.body;

    // Reading time, measured once from the rendered article copy.
    const words = (article.innerText || "").trim().split(/\s+/).length;
    const totalMin = Math.max(1, Math.round(words / WORDS_PER_MIN));

    // Section anchors, in document order. Bounds are remeasured whenever the
    // layout changes (image loads, font swaps, viewport resize).
    let starts: number[] = [];
    let anchorIds: string[] = [];
    let regionStart = 0;
    let regionEnd = 1;

    const measure = () => {
      const anchors = sections
        .map((s) => document.getElementById(s.id))
        .filter(Boolean) as HTMLElement[];
      if (anchors.length === 0) return;

      const pageY = window.scrollY;
      starts = anchors.map((el) => el.getBoundingClientRect().top + pageY);
      anchorIds = anchors.map((el) => el.id);

      // The reading region can extend past the last visible TOC chapter when
      // several later sections are intentionally grouped under one chapter.
      const endAnchor =
        (readingEndId ? document.getElementById(readingEndId) : null) ??
        anchors[anchors.length - 1];
      const lastSection =
        endAnchor.closest<HTMLElement>(".project-section") ??
        endAnchor.closest<HTMLElement>("section") ??
        endAnchor;
      const lastRect = lastSection.getBoundingClientRect();
      regionStart = starts[0];
      regionEnd = lastRect.bottom + pageY;
    };

    const items = Array.from(
      list.querySelectorAll<HTMLLIElement>(".project-toc-item")
    );
    const readouts = Array.from(
      nav.querySelectorAll<HTMLElement>(".js-toc-readout")
    );
    const backTop = backTopRef.current;

    let frame = 0;
    let lastReadout = "";
    let lastBackTop = false;

    const render = () => {
      frame = 0;
      if (starts.length === 0) return;

      // The reading "playhead": a line just below the sticky bar, so a section
      // counts as read once its text has cleared the chrome.
      const navH = nav.getBoundingClientRect().height || 48;
      const playhead = window.scrollY + navH + 8;

      let currentChapterIndex = 0;
      for (let index = 0; index < starts.length; index += 1) {
        if (playhead < starts[index]) break;
        currentChapterIndex = index;
      }
      const hasUsableChapterGeometry =
        starts.length === 1 ||
        starts.some(
          (start, index) => index > 0 && start - starts[index - 1] > 1,
        );
      if (hasUsableChapterGeometry) {
        commitActiveId(anchorIds[currentChapterIndex] ?? "");
      }

      const span = Math.max(1, regionEnd - regionStart);
      const overall = Math.min(1, Math.max(0, (playhead - regionStart) / span));
      nav.style.setProperty("--toc-progress", overall.toFixed(4));

      for (let i = 0; i < items.length; i++) {
        const a = starts[i];
        const b = i + 1 < starts.length ? starts[i + 1] : regionEnd;
        const segSpan = Math.max(1, b - a);
        const fill = Math.min(1, Math.max(0, (playhead - a) / segSpan));
        const item = items[i];
        item.style.setProperty("--seg-fill", fill.toFixed(4));
        item.classList.toggle("project-toc-item--read", fill >= 0.999);
      }

      const next = formatReadout(overall, totalMin);
      if (next !== lastReadout) {
        readouts.forEach((el) => {
          el.textContent = next;
        });
        lastReadout = next;
      }

      // Reveal "back to top" once the reader is well past the fold.
      if (backTop) {
        const show = window.scrollY > window.innerHeight * 1.2;
        if (show !== lastBackTop) {
          backTop.classList.toggle("reading-top--show", show);
          backTop.setAttribute("aria-hidden", show ? "false" : "true");
          backTop.tabIndex = show ? 0 : -1;
          lastBackTop = show;
        }
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(render);
    };

    // Remeasure when the article's height changes (images, fonts, expands).
    let ro: ResizeObserver | undefined;
    try {
      ro = new ResizeObserver(() => {
        measure();
        render();
      });
      ro.observe(article);
    } catch {
      ro?.disconnect();
      updateEnhancement("resize", false);
      return;
    }

    measure();
    render();
    window.addEventListener("scroll", onScroll, { passive: true });
    updateEnhancement("resize", true);

    return () => {
      window.removeEventListener("scroll", onScroll);
      ro?.disconnect();
      if (frame) cancelAnimationFrame(frame);
      updateEnhancement("resize", false);
    };
  }, [sections, readingEndId, updateEnhancement, commitActiveId]);

  // Auto-scroll active item into view on desktop
  useEffect(() => {
    const activeItem = activeItemRef.current;
    if (
      activeItem &&
      listRef.current &&
      typeof activeItem.scrollIntoView === "function"
    ) {
      activeItem.scrollIntoView({
        behavior: reducedRef.current ? "auto" : "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeId]);

  const handleClick = useCallback(
    (id: string) => {
      commitActiveId(id);
      setIsOpen(false);
      if (isOpen) {
        window.requestAnimationFrame(() => toggleRef.current?.focus());
      }
    },
    [isOpen, commitActiveId],
  );

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: reducedRef.current ? "auto" : "smooth",
    });
  }, []);

  // Roving keyboard navigation: arrows/Home/End move focus between links;
  // Enter follows each link's native fragment behavior.
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLAnchorElement>, index: number) => {
      const last = sections.length - 1;
      let target: number;
      switch (event.key) {
        case "ArrowDown":
        case "ArrowRight":
          target = index >= last ? 0 : index + 1;
          break;
        case "ArrowUp":
        case "ArrowLeft":
          target = index <= 0 ? last : index - 1;
          break;
        case "Home":
          target = 0;
          break;
        case "End":
          target = last;
          break;
        case "Escape":
          if (!isOpen) return;
          event.preventDefault();
          setIsOpen(false);
          toggleRef.current?.focus();
          return;
        default:
          return;
      }
      event.preventDefault();
      const links = listRef.current?.querySelectorAll<HTMLAnchorElement>(".project-toc-link");
      links?.[target]?.focus();
    },
    [sections.length, isOpen]
  );

  const activeIndex = sections.findIndex((s) => s.id === activeId);
  const activeChapter = sections[activeIndex >= 0 ? activeIndex : 0];
  const activeTitle = activeChapter
    ? completeChapterTitle(activeChapter)
    : "";
  const activeNum = String(activeIndex >= 0 ? activeIndex + 1 : 1).padStart(2, "0");

  return (
    <>
      {/* Sentinel: sits right above the ToC in document flow. When it scrolls
          out of view the ToC has become sticky. */}
      <div ref={sentinelRef} className="project-toc-sentinel" aria-hidden="true" />

      <nav
        ref={tocRef}
        className={`project-toc${isSticky ? " project-toc--sticky" : ""}`}
        aria-label="Case study chapters"
      >
        {/* Mobile: collapsed current-section bar. The overall progress fills
            the hairline beneath it. */}
        <button
          ref={toggleRef}
          className="project-toc-toggle"
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={(event) => {
            if (event.key === "Escape" && isOpen) {
              event.preventDefault();
              setIsOpen(false);
            }
          }}
          aria-expanded={isOpen}
          aria-controls="project-toc-list"
          aria-label={activeTitle || "Case study chapters"}
        >
          <span className="project-toc-toggle-label">
            <span className="project-toc-num">{activeNum}.</span>
            <span className="project-toc-active-title">
              {activeChapter?.stage ? (
                <>
                  <span className="project-toc-stage">{activeChapter.stage}</span>
                  <span className="project-toc-separator" aria-hidden="true">
                    :{" "}
                  </span>
                </>
              ) : null}
              <span className="project-toc-title">
                {activeChapter ? displayChapterTitle(activeChapter.title) : ""}
              </span>
            </span>
          </span>
          <span className="project-toc-toggle-end">
            <span className="project-toc-readout-mobile js-toc-readout" aria-hidden="true" />
            <svg
              className={`project-toc-chevron${isOpen ? " project-toc-chevron--open" : ""}`}
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
            >
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>

        <div className="project-toc-track">
          {/* Section list — always visible on desktop, toggled on mobile */}
          <ol
            ref={listRef}
            id="project-toc-list"
            className={`project-toc-list${isOpen ? " project-toc-list--open" : ""}`}
            role="list"
            aria-describedby="project-toc-help"
          >
            {sections.map((section, i) => {
              const isActive = section.id === activeId;
              const num = String(i + 1).padStart(2, "0");

              return (
                <li key={section.id} className="project-toc-item" style={{ "--toc-i": i } as React.CSSProperties}>
                  <a
                    ref={isActive ? activeItemRef : undefined}
                    href={`#${section.id}`}
                    className={`project-toc-link${isActive ? " project-toc-link--active" : ""}`}
                    onClick={() => handleClick(section.id)}
                    onKeyDown={(event) => handleKeyDown(event, i)}
                    aria-current={isActive ? "true" : undefined}
                    aria-label={completeChapterTitle(section)}
                  >
                    <span className="project-toc-dot" aria-hidden="true" />
                    <span className="project-toc-num">{num}.</span>
                    <span className="project-toc-text">
                      {section.stage ? (
                        <>
                          <span className="project-toc-stage">{section.stage}</span>
                          <span className="project-toc-separator" aria-hidden="true">
                            :{" "}
                          </span>
                        </>
                      ) : null}
                      <span className="project-toc-title">
                        {displayChapterTitle(section.title)}
                      </span>
                    </span>
                    <span className="project-toc-rail" aria-hidden="true" />
                  </a>
                </li>
              );
            })}
          </ol>

          {/* Reading-position readout (desktop). Decorative — the section list
              already conveys position to assistive tech. */}
          <span
            className="project-toc-readout js-toc-readout"
            aria-hidden="true"
          />
        </div>

        {/* Overall progress hairline along the bottom edge of the sticky bar. */}
        <span className="project-toc-progress" aria-hidden="true" />

        <p id="project-toc-help" className="project-toc-help">
          Arrow keys move between chapters. Home and End jump to the ends.
        </p>
      </nav>

      {/* Polite live region: announces the section you've scrolled into so the
          progress the spine shows visually is also perceivable non-visually. */}
      <div className="project-toc-live" role="status" aria-live="polite">
        {activeId ? `Now reading: ${activeTitle}` : ""}
      </div>

      {/* Quiet return for long reads. Hidden (and untabbable) until scrolled. */}
      <button
        ref={backTopRef}
        type="button"
        className="reading-top"
        onClick={scrollToTop}
        aria-label="Back to top"
        aria-hidden="true"
        tabIndex={-1}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M8 13V3.5M8 3.5L3.5 8M8 3.5L12.5 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </>
  );
}
