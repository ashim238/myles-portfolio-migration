"use client";

import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { CommandIcon } from "@/components/myles-97/command-icon";
import { iconForProgram, Myles97Icon } from "@/components/myles-97/icons";
import Link from "next/link";
import { useId, useState, useSyncExternalStore, type MouseEvent, type ReactNode } from "react";
import { FRESH_GREENS_ROLE, isFeaturedProject } from "@/lib/myles-97/programs";
import { StudyCover } from "./study-cover";
import { ProductThumbnail } from "@/components/myles-97/product-thumbnail";
import type { ProgramDefinition } from "@/lib/myles-97/programs";
import {
  dispatchProjectEnterRequest,
  saveProjectReturnSnapshot,
  type ProjectCoverVisual,
} from "@/lib/project-enter";

export type SelectedWorkExplorerProps = {
  programs: readonly ProgramDefinition[];
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

  const card = event.currentTarget.closest<HTMLElement>(".myles97-program-card") ?? event.currentTarget;
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

function ProjectEntry({ program, reduced, onRead, children }: {
  program: ProgramDefinition;
  reduced: boolean;
  onRead: (event: MouseEvent<HTMLAnchorElement>) => void;
  children: ReactNode;
}) {
  const [inspecting, setInspecting] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  return (
    <Link href={program.href} className="work-project-link" aria-label={`Read ${program.title} case study`}
      onClick={onRead}
      onFocus={event => setKeyboardFocus(event.currentTarget.matches(":focus-visible"))}
      onBlur={() => setKeyboardFocus(false)}>
      <span className="myles97-program-summary">
        {isFeaturedProject(program.id) ? (
          <span className="myles97-program-cover"
            onPointerEnter={event => {
              if (event.pointerType !== "touch" && window.matchMedia("(any-hover: hover)").matches) setInspecting(true);
            }}
            onPointerLeave={() => setInspecting(false)}>
            <ProductThumbnail project={program.id} reduced={reduced || keyboardFocus}
              interactive inspect={inspecting || keyboardFocus} />
          </span>
        ) : <StudyCover program={program} />}
        {children}
      </span>
      <span className="myles97-program-actions">
        <span className="myles97-case-study-link">Read case study <CommandIcon name="next" /></span>
      </span>
    </Link>
  );
}

const folderFileKey = "work-folder-file";
const fileSelectionEvent = "myles98:folder-file";
let temporarySelection: string | null = null;

function readSelection() {
  try { return sessionStorage.getItem(folderFileKey); }
  catch { return temporarySelection; }
}

function subscribeToSelection(notify: () => void) {
  window.addEventListener(fileSelectionEvent, notify);
  window.addEventListener("storage", notify);
  return () => {
    window.removeEventListener(fileSelectionEvent, notify);
    window.removeEventListener("storage", notify);
  };
}

function selectFile(id: ProgramDefinition["id"]) {
  if (id === readSelection()) return;
  temporarySelection = id;
  try { sessionStorage.setItem(folderFileKey, id); } catch { /* The current session can still select a project. */ }
  window.dispatchEvent(new Event(fileSelectionEvent));
}

export function SelectedWorkExplorer({
  programs,
  reduceMotion = false,
  heading = "Portfolio projects",
}: SelectedWorkExplorerProps) {
  const systemReduceMotion = usePrefersReducedMotion();
  const effectiveReduceMotion = Boolean(reduceMotion || systemReduceMotion);
  const [view, setView] = useState<"preview" | "thumbnails" | "details">("preview");
  const remembered = useSyncExternalStore(subscribeToSelection, readSelection, () => null);
  const selected = programs.find(program => program.id === remembered)?.id ?? programs[0]?.id;
  const viewGroup = useId();

  return (
    <div className="myles97-explorer" data-work-view={view}>
      <header className="work-folder-heading">
        <Myles97Icon name="folder" variant="color" size={48} />
        <div>
          <h2 className="work-folder-name">{heading}</h2>
          <p id="selected-work-guide" className="myles97-explorer-guide">
            Select a project to read its case study.
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
        <nav className="archive-file-list" aria-label="Case studies">
          {programs.map((program) => (
            <Link key={program.id} href={program.href} className="archive-file-row"
              data-selected={selected === program.id}
              onPointerEnter={event => { if (event.pointerType !== "touch") selectFile(program.id); }}
              onFocus={() => selectFile(program.id)}
              onClick={event => {
                if (!usesNativeNavigation(event)) selectFile(program.id);
                rememberReturnTarget(event, program, reduceMotion);
              }}>
              <Myles97Icon name={iconForProgram(program.id)} variant="color" size={24} />
              <span>{program.title === "UnderstandingFAFSA" ? <>Understanding<wbr />FAFSA</> : program.title}</span>
              <CommandIcon name="external" />
            </Link>
          ))}
        </nav>
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
            <ProjectEntry program={program} reduced={effectiveReduceMotion}
              onRead={event => {
                if (!usesNativeNavigation(event)) selectFile(program.id);
                rememberReturnTarget(event, program, reduceMotion);
              }}>
              <span className="myles97-program-card-copy">
                <Myles97Icon name={iconForProgram(program.id)} variant="color" size={24} />
                <strong>{program.title === "UnderstandingFAFSA" ? <>Understanding<wbr />FAFSA</> : program.title}</strong>
                <span>{view === "preview" && program.id === "fresh-greens"
                  ? FRESH_GREENS_ROLE
                  : program.cardSummary ?? program.applicationType}</span>
                {view === "preview" ? <span className="archive-file-description">{program.summary}</span> : <span>{program.appName}</span>}
              </span>
            </ProjectEntry>
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
