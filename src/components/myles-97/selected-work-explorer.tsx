"use client";

import Image from "next/image";
import Link from "next/link";
import { iconForProgram, Myles97Icon } from "@/components/myles-97/icons";
import type {
  ProgramDefinition,
  ProjectProgramId,
} from "@/lib/myles-97/programs";

export type SelectedWorkExplorerProps = {
  programs: readonly ProgramDefinition[];
  onOpen: (id: ProjectProgramId) => void;
};

export function SelectedWorkExplorer({
  programs,
  onOpen,
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
