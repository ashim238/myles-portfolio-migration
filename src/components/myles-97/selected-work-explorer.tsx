"use client";

import Image from "next/image";
import Link from "next/link";
import type { MouseEvent } from "react";
import { iconForProgram, Myles97Icon } from "@/components/myles-97/icons";
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
}: SelectedWorkExplorerProps) {
  return (
    <div className="myles97-explorer">
      <div className="myles97-explorer-toolbar" aria-hidden="true">
        <span>Portfolio projects</span>
        <span>{programs.length} projects</span>
      </div>
      <p id="selected-work-guide" className="myles97-explorer-guide">
        Read the full design story, or explore the interactive preview.
      </p>
      <ul
        className="myles97-selected-work-list"
        role="list"
        aria-label="Portfolio projects"
        aria-describedby="selected-work-guide"
      >
        {programs.map((program) => (
          <li
            key={program.id}
            className="myles97-program-card"
            data-m97-selected-work-project={program.id}
            aria-label={program.title}
          >
            <div className="myles97-program-summary">
              <span className="myles97-program-cover" aria-hidden="true">
                {program.coverImage ? (
                  <Image
                    src={program.coverImage}
                    alt=""
                    width={640}
                    height={360}
                    sizes="(max-width: 900px) 80vw, 320px"
                    preload={program.id === "fresh-greens"}
                  />
                ) : (
                  <Myles97Icon name={iconForProgram(program.id)} size={40} />
                )}
              </span>
              <span className="myles97-program-card-copy">
                <strong>{program.title}</strong>
                <span>{program.applicationType}</span>
                <span>{program.appName}</span>
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
                Read case study <span aria-hidden="true">↗</span>
              </Link>
              <button
                type="button"
                className="myles97-program-launch"
                aria-label={`Explore ${program.appName} interactive preview`}
                onClick={() => onOpen(program.id)}
              >
                Explore preview
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
