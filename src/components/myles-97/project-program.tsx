"use client";

import Image from "next/image";
import type { MouseEvent } from "react";
import { Myles97Icon } from "@/components/myles-97/icons";
import { prefersReducedMotion } from "@/lib/home-intro";
import type { ProgramDefinition } from "@/lib/myles-97/programs";
import {
  dispatchProjectEnterRequest,
  saveProjectReturnSnapshot,
  type ProjectCoverVisual,
  type ProjectEnterRect,
  type ProjectProgramVisual,
} from "@/lib/project-enter";

function shouldUseNativeNavigation(event: MouseEvent<HTMLAnchorElement>) {
  return (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  );
}

function toRect(rect: DOMRect): ProjectEnterRect {
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };
}

function coverVisual(program: ProgramDefinition): ProjectCoverVisual {
  if (program.id === "tiktok") return { type: "tiktok" };
  return {
    type: "image",
    src: program.coverImage ?? "/logomark.svg",
  };
}

type ProjectProgramProps = {
  program: ProgramDefinition;
  reduceMotion?: boolean;
};

export function ProjectProgram({
  program,
  reduceMotion = false,
}: ProjectProgramProps) {
  const visual: ProjectProgramVisual = {
    type: "program",
    programId: program.id,
    appName: program.appName,
    title: program.title,
    cover: coverVisual(program),
  };

  const openCaseStudy = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      shouldUseNativeNavigation(event) ||
      reduceMotion ||
      prefersReducedMotion()
    ) {
      return;
    }

    const windowElement = event.currentTarget.closest<HTMLElement>(
      ".myles97-window",
    );
    if (!windowElement) return;

    const sourceRect = windowElement.getBoundingClientRect();
    if (sourceRect.width <= 0 || sourceRect.height <= 0) return;

    event.preventDefault();
    const rect = toRect(sourceRect);
    const borderRadius = getComputedStyle(windowElement).borderRadius || "0px";

    saveProjectReturnSnapshot({
      version: 1,
      slug: program.id,
      rect,
      borderRadius,
      visual,
    });
    dispatchProjectEnterRequest({
      slug: program.id,
      href: program.href,
      rect,
      visual,
      borderRadius,
    });
  };

  return (
    <div className="myles97-project-preview">
      <div className="myles97-project-preview-cover" data-project-program-cover>
        {program.coverImage ? (
          <Image
            src={program.coverImage}
            alt=""
            width={960}
            height={540}
            sizes="(max-width: 900px) 80vw, 680px"
          />
        ) : (
          <Myles97Icon name="app" size={56} aria-hidden="true" />
        )}
      </div>
      <div className="myles97-project-preview-copy">
        <p className="myles97-eyebrow">{program.applicationType}</p>
        <h2>{program.title}</h2>
        <p>{program.summary}</p>
        <a
          className="myles97-primary-button"
          href={program.href}
          onClick={openCaseStudy}
        >
          Read {program.title} case study
        </a>
      </div>
    </div>
  );
}
