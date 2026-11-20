"use client";

import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { CommandIcon } from "@/components/myles-97/command-icon";
import { iconForProgram, Myles97Icon } from "@/components/myles-97/icons";
import Link from "next/link";
import { useEffect, useId, useState, type MouseEvent } from "react";
import { isFeaturedProject } from "@/lib/myles-97/programs";
import { StudyCover } from "./study-cover";
import { InspectableThumbnail } from "@/components/myles-97/product-thumbnail";
import type {
  ProgramDefinition,
  ProjectProgramId,
} from "@/lib/myles-97/programs";
import {
  dispatchProjectEnterRequest,
  saveProjectReturnSnapshot,
  type ProjectCoverVisual,
} from "@/lib/project-enter";

export type SelectedWorkExplorerProps = {
  programs: readonly ProgramDefinition[];
  onOpen: (id: ProjectProgramId) => void;
  reduceMotion?: boolean;
  heading?: string;
};

function usesNativeNavigation(event: MouseEvent<HTMLAnchorElement>) {
  return (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  );
}

function coverVisual(program: ProgramDefinition): ProjectCoverVisual {
  if (program.id === "tiktok") return { type: "tiktok" };
  return { type: "image", src: program.coverImage ?? "/logomark.svg" };
}

function rememberReturnTarget(
  event: MouseEvent<HTMLAnchorElement>,
  program: ProgramDefinition,
  reduceMotion: boolean,
) {
  if (usesNativeNavigation(event)) return;

  const card = event.currentTarget.closest<HTMLElement>(".myles97-program-card");
  if (!card) return;
  const bounds = card.getBoundingClientRect();
  if (bounds.width <= 0 || bounds.height <= 0) return;
  const rect = {
    top: bounds.top,
    left: bounds.left,
    width: bounds.width,
    height: bounds.height,
  };
  const borderRadius = getComputedStyle(card).borderRadius || "0px";
  const visual: ProjectCoverVisual = coverVisual(program);

  saveProjectReturnSnapshot({
    version: 1,
    slug: program.id,
    returnTarget: "selected-work",
    reduceMotion,
    animate: false,
    rect,
    borderRadius,
    visual: {
      type: "program",
      programId: program.id,
      appName: program.appName,
      title: program.title,
      cover: visual,
    },
  });

  const handled = dispatchProjectEnterRequest({
    slug: program.id,
    href: program.href,
    rect,
    visual,
    borderRadius,
    reduceMotion,
    animate: false,
  });
  if (handled) event.preventDefault();
}

export function SelectedWorkExplorer({
  programs,
  onOpen,
  reduceMotion = false,
  heading = "Portfolio projects",
}: SelectedWorkExplorerProps) {
  const systemReduceMotion = usePrefersReducedMotion();
  const effectiveReduceMotion = Boolean(reduceMotion || systemReduceMotion);
  const [view, setView] = useState<"preview" | "thumbnails" | "details">("preview");
  const [selected, setSelected] = useState(programs[0]?.id);
  const fileGroup = useId();

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("work-folder-file");
      const file = programs.find((program) => program.id === saved);
      if (file) setSelected(file.id);
    } catch { /* Storage is optional for reopening the folder. */ }
  }, [programs]);

  function selectFile(id: ProgramDefinition["id"]) {
    setSelected(id);
    try { sessionStorage.setItem("work-folder-file", id); } catch { /* Storage is optional. */ }
  }
  const viewGroup = useId();

  return (
    <div className="myles97-explorer" data-work-view={view}>
      <header className="work-folder-heading">
        <Myles97Icon name="folder" variant="color" size={48} />
        <div>
          <h2 className="work-folder-name">{heading}</h2>
          <p id="selected-work-guide" className="myles97-explorer-guide">
            Read a case study or open a project preview.
          </p>
        </div>
      </header>
      <div className="work-view-bar">
        <span>{programs.length} projects</span>
        <div role="radiogroup" aria-label="Project view">
          {(["preview", "thumbnails", "details"] as const).map((option) => (
            <label key={option}>
              <input className="sr-only" type="radio" name={viewGroup} value={option}
                checked={view === option} onChange={() => setView(option)} />
              {{ preview: "Preview pane", thumbnails: "Thumbnails", details: "Details" }[option]}
            </label>
          ))}
        </div>
      </div>
      {view === "preview" && (
        <fieldset className="archive-file-list">
          <legend className="sr-only">Project to preview</legend>
          {programs.map((program) => (
            <div key={program.id} className="archive-file-row">
              <label>
                <input type="radio" className="sr-only" name={fileGroup} value={program.id} aria-label={program.title}
                  checked={selected === program.id} onChange={() => selectFile(program.id)} />
                <Myles97Icon name={iconForProgram(program.id)} variant="color" size={24} />
                <span>{program.title === "UnderstandingFAFSA" ? <>Understanding<wbr />FAFSA</> : program.title}</span>
              </label>
              {selected !== program.id && (
                <Link href={program.href} aria-label={`Read ${program.title} case study`}
                  title={`Read ${program.title} case study`} onClick={(event) => {
                    if (!usesNativeNavigation(event)) selectFile(program.id);
                  }}>
                  <CommandIcon name="external" />
                </Link>
              )}
            </div>
          ))}
        </fieldset>
      )}
      <ul
        className="myles97-selected-work-list"
        role="list"
        aria-label="Portfolio projects"
        aria-describedby="selected-work-guide"
      >
        {programs.filter((program) => view !== "preview" || selected === program.id).map((program) => (
          <li
            key={program.id}
            className="myles97-program-card"
            data-m97-selected-work-project={program.id}
            aria-label={program.title}
          >
            <div className="myles97-program-summary">
              {isFeaturedProject(program.id)
                ? <InspectableThumbnail project={program.id} title={program.title} reduced={effectiveReduceMotion} />
                : <StudyCover program={program} />}
              <span className="myles97-program-card-copy">
                <Myles97Icon name={iconForProgram(program.id)} variant="color" size={24} />
                <strong>{program.title === "UnderstandingFAFSA" ? <>Understanding<wbr />FAFSA</> : program.title}</strong>
                <span>{program.cardSummary ?? program.applicationType}</span>
                {view === "preview" ? <span className="archive-file-description">{program.summary}</span> : <span>{program.appName}</span>}
              </span>
            </div>
            <div className="myles97-program-actions">
              <Link
                className="myles97-case-study-link"
                href={program.href}
                aria-label={`Read ${program.title} case study`}
                onClick={(event) =>
                  rememberReturnTarget(event, program, reduceMotion)
                }
              >
                Read case study
                <CommandIcon name="external" />
              </Link>
              <button
                type="button"
                className="myles97-program-launch"
                aria-label={`Explore ${program.appName} preview`}
                onClick={() => onOpen(program.id)}
              >
                Explore preview
              </button>
            </div>
          </li>
        ))}
      </ul>
      <noscript>
        <style>{".myles97-explorer[data-work-view=preview] :is(.work-view-bar,.archive-file-list,.myles97-selected-work-list){display:none}.myles97-explorer noscript{display:block;grid-column:1/-1;padding:1rem}.myles97-explorer noscript a{display:inline-flex;align-items:center;min-height:44px;text-decoration:underline}"}</style>
        <ul aria-label="All case studies">
          {programs.map((program) => <li key={program.id}><a href={program.href} aria-label={`Read ${program.title} case study`}>{program.title}</a></li>)}
        </ul>
      </noscript>
    </div>
  );
}
