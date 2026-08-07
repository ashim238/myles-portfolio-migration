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

const evidenceLabels = {
  built: "Built",
  shipped: "Shipped",
  observed: "Observed",
  proposed: "Proposed",
  "needs-proof": "Still needs proof",
} as const;

export function SelectedWorkExplorer({
  programs,
  onOpen,
}: SelectedWorkExplorerProps) {
  return (
    <div className="myles97-explorer">
      <div className="myles97-explorer-toolbar" aria-hidden="true">
        <span>Portfolio Programs</span>
        <span>{programs.length} items</span>
      </div>
      <ul className="myles97-selected-work-list" role="list">
        {programs.map((program) => (
          <li key={program.id} className="myles97-program-card">
            <button
              type="button"
              className="myles97-program-launch"
              aria-label={`Open ${program.appName} program`}
              onClick={() => onOpen(program.id)}
            >
              <span className="myles97-program-cover" aria-hidden="true">
                {program.coverImage ? (
                  <Image
                    src={program.coverImage}
                    alt=""
                    width={640}
                    height={360}
                    sizes="(max-width: 900px) 80vw, 320px"
                  />
                ) : (
                  <Myles97Icon name={iconForProgram(program.id)} size={40} />
                )}
              </span>
              <span className="myles97-program-card-copy">
                <strong>{program.appName}</strong>
                <span>{program.applicationType}</span>
                <span className="myles97-evidence-badge">
                  {evidenceLabels[program.primaryEvidence]}
                </span>
              </span>
            </button>
            <Link
              className="myles97-case-study-link"
              href={program.href}
              aria-label={`Open ${program.title} case study`}
            >
              Open case study <span aria-hidden="true">↗</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
