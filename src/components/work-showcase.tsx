"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/content";
import { prefersReducedMotion } from "@/lib/home-intro";
import { WorkProjectCard } from "@/components/work-project-card";
import { WorkShowcaseRail } from "@/components/work-showcase-rail";

type WorkShowcaseProps = {
  projects: Project[];
};

function clampFocusDistance(index: number, activeIndex: number): number {
  return Math.min(Math.abs(index - activeIndex), 2);
}

export function WorkShowcase({ projects }: WorkShowcaseProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [focusReady, setFocusReady] = useState(false);

  const updateActiveIndex = useCallback(() => {
    const list = listRef.current;
    if (!list) return;

    const items = list.querySelectorAll<HTMLElement>(".work-showcase-item");
    if (items.length === 0) return;

    const viewportCenter = window.innerHeight * 0.5;
    let nextActive = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    items.forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      const itemCenter = rect.top + rect.height * 0.5;
      const distance = Math.abs(itemCenter - viewportCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        nextActive = index;
      }
    });

    setActiveIndex((current) => (current === nextActive ? current : nextActive));
  }, []);

  useEffect(() => {
    if (projects.length === 0) return;

    if (prefersReducedMotion()) {
      setFocusReady(true);
      return;
    }

    setFocusReady(true);
    updateActiveIndex();

    let frame = 0;
    const onScrollOrResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateActiveIndex);
    };

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [projects.length, updateActiveIndex]);

  const scrollToProject = useCallback((index: number) => {
    const list = listRef.current;
    if (!list) return;

    const item = list.querySelector<HTMLElement>(
      `.work-showcase-item[data-project-index="${index}"]`,
    );
    item?.scrollIntoView({ behavior: "smooth", block: "center" });
    setActiveIndex(index);
  }, []);

  if (projects.length === 0) {
    return (
      <ul className="work-list work-showcase" role="list">
        <li className="work-item">
          <p>No published projects yet. Keep building.</p>
        </li>
      </ul>
    );
  }

  const depthEnabled = focusReady && !prefersReducedMotion();

  return (
    <div
      ref={shellRef}
      className="work-showcase-shell"
      data-focus-ready={depthEnabled ? "true" : undefined}
    >
      <WorkShowcaseRail
        projects={projects}
        activeIndex={activeIndex}
        onSelect={scrollToProject}
      />
      <ul ref={listRef} className="work-list work-showcase" role="list">
        {projects.map((project, index) => (
          <WorkProjectCard
            key={project.slug}
            project={project}
            index={index}
            isActive={depthEnabled && index === activeIndex}
            focusDistance={depthEnabled ? clampFocusDistance(index, activeIndex) : 0}
          />
        ))}
      </ul>
    </div>
  );
}
