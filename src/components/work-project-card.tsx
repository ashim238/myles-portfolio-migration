"use client";

import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { TikTokCoverBlobs } from "@/components/tiktok-dsa";
import type { Project } from "@/lib/content";
import { prefersReducedMotion } from "@/lib/home-intro";
import { dispatchProjectEnterRequest } from "@/lib/project-enter";
import { galleryOutcome } from "@/lib/work-gallery-data";

type WorkProjectCardProps = {
  project: Project;
  index: number; // 0-based; drives the mono index label
};

const EVIDENCE_LABELS: Record<string, string> = {
  "fresh-greens": "Working prototype",
  navi: "Live demo available",
  understandingfafsa: "Interactive case-study explanation",
  tiktok: "Static launch templates",
};

function formatIndex(index: number): string {
  return String(index + 1).padStart(2, "0");
}

// Insert soft break opportunities at camelCase / word-to-ACRONYM seams
// (e.g. "UnderstandingFAFSA" -> "Understanding" <wbr/> "FAFSA") so a long
// single-token title wraps at a natural point instead of mid-word.
function titleWithSoftBreaks(title: string) {
  const parts = title.split(/(?<=[a-z])(?=[A-Z])/);
  if (parts.length === 1) return title;
  return parts.map((part, i) => (
    <Fragment key={i}>
      {i > 0 ? <wbr /> : null}
      {part}
    </Fragment>
  ));
}

// The tactile corner tab: role · year, pinned to the cover like a label on a
// physical artifact. Year is the last 4-digit run in the timeframe.
function tabText(project: Project): string {
  const year = project.timeframe?.match(/\d{4}(?!.*\d{4})/)?.[0];
  return [project.role, year].filter(Boolean).join(" · ");
}

export function WorkProjectCard({
  project,
  index,
}: WorkProjectCardProps) {
  const { lead, rest } = galleryOutcome(project);
  const tab = tabText(project);
  const usesTikTokLogo = project.slug === "tiktok";
  const evidenceLabel = EVIDENCE_LABELS[project.slug];
  const imageDelay = `${(0.32 + index * 0.08).toFixed(2)}s`;
  const titleDelay = `${(0.42 + index * 0.08).toFixed(2)}s`;
  const copyDelay = `${(0.46 + index * 0.08).toFixed(2)}s`;

  const handleProjectEnter = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      prefersReducedMotion() ||
      !project.coverImage
    ) {
      return;
    }
    const frame = event.currentTarget.querySelector<HTMLElement>(".work-thumb");
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const handled = dispatchProjectEnterRequest({
      slug: project.slug,
      href: `/work/${project.slug}`,
      rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
      visual: usesTikTokLogo
        ? { type: "tiktok" }
        : { type: "image", src: project.coverImage },
      borderRadius: getComputedStyle(frame).borderRadius,
    });
    if (handled) event.preventDefault();
  };

  return (
    <div className="work-gallery-cell">
      <span
        className="work-gallery-index wg-anim wg-tick"
        style={{ ["--d" as string]: imageDelay }}
        aria-hidden="true"
      >
        {formatIndex(index)}
      </span>
      <Link className="work-card" href={`/work/${project.slug}`} onClick={handleProjectEnter}>
        {project.coverImage ? (
          <div className="work-media">
            <div
              className={`work-thumb wg-anim${usesTikTokLogo ? " work-thumb--tiktok-logo tt-cover--preview" : ""}`}
              style={{ ["--d" as string]: imageDelay }}
            >
              {usesTikTokLogo ? (
                <TikTokCoverBlobs deferUntilVisible />
              ) : (
                <Image
                  src={project.coverImage}
                  alt={`${project.title} preview`}
                  width={1400}
                  height={933}
                  sizes="(max-width: 767px) 100vw, min(46vw, 524px)"
                  priority={index === 0}
                />
              )}
              {tab ? <span className="work-tab">{tab}</span> : null}
            </div>
          </div>
        ) : null}
        <div className="work-cap">
          <h3
            className="work-title wg-anim wg-rise"
            style={{ ["--d" as string]: titleDelay }}
          >
            {titleWithSoftBreaks(project.title)}
          </h3>
          <p
            className="work-out wg-anim wg-rise"
            style={{ ["--d" as string]: copyDelay }}
          >
            {lead ? <strong>{lead}</strong> : null}
            {lead ? " " : ""}
            {rest}
          </p>
          {evidenceLabel ? (
            <span className="work-card-evidence">{evidenceLabel}</span>
          ) : null}
        </div>
      </Link>
    </div>
  );
}
