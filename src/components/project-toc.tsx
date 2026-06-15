"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type ProjectTocProps = {
  sections: { title: string; id: string }[];
};

export function ProjectToc({ sections }: ProjectTocProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const tocRef = useRef<HTMLElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLOListElement>(null);

  // Track which section is in view
  useEffect(() => {
    const sectionEls = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean) as HTMLElement[];

    if (sectionEls.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry that is most visible
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0 && visible[0].target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-10% 0px -60% 0px",
        threshold: [0, 0.25, 0.5],
      }
    );

    sectionEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  // Track sticky state via sentinel element
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // Auto-scroll active item into view on desktop
  useEffect(() => {
    if (activeItemRef.current && listRef.current) {
      activeItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeId]);

  const handleClick = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        setActiveId(id);
        setIsOpen(false);
      }
    },
    []
  );

  // Roving keyboard navigation: arrows/Home/End move focus between links;
  // Enter/Space still activate via the native button.
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
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
        default:
          return;
      }
      event.preventDefault();
      const links = listRef.current?.querySelectorAll<HTMLButtonElement>(".project-toc-link");
      links?.[target]?.focus();
    },
    [sections.length]
  );

  const activeIndex = sections.findIndex((s) => s.id === activeId);
  const activeTitle = activeIndex >= 0 ? sections[activeIndex].title : sections[0]?.title ?? "";
  const activeNum = String(activeIndex >= 0 ? activeIndex + 1 : 1).padStart(2, "0");

  return (
    <>
      {/* Sentinel: sits right above the ToC in document flow. When it scrolls
          out of view the ToC has become sticky. */}
      <div ref={sentinelRef} className="project-toc-sentinel" aria-hidden="true" />

      <nav
        ref={tocRef}
        className={`project-toc${isSticky ? " project-toc--sticky" : ""}`}
        aria-label="Case study sections"
      >
        {/* Mobile: collapsed current-section bar */}
        <button
          className="project-toc-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="project-toc-list"
        >
          <span className="project-toc-toggle-label">
            <span className="project-toc-num">{activeNum}.</span>
            {activeTitle}
          </span>
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
        </button>

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
              <li key={section.id} className="project-toc-item">
                <button
                  ref={isActive ? activeItemRef : undefined}
                  className={`project-toc-link${isActive ? " project-toc-link--active" : ""}`}
                  onClick={() => handleClick(section.id)}
                  onKeyDown={(event) => handleKeyDown(event, i)}
                  aria-current={isActive ? "true" : undefined}
                >
                  <span className="project-toc-dot" aria-hidden="true" />
                  <span className="project-toc-num">{num}.</span>
                  <span className="project-toc-text">{section.title}</span>
                </button>
              </li>
            );
          })}
        </ol>

        <p id="project-toc-help" className="project-toc-help">
          Arrow keys move between sections. Home and End jump to the ends.
        </p>
      </nav>
    </>
  );
}
