"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import { iconForProgram, Myles97Icon } from "@/components/myles-97/icons";
import { PROJECT_PROGRAM_BLUEPRINTS } from "@/lib/myles-97/programs";
import {
  dispatchProjectReturnRequest,
  readProjectReturnSnapshot,
} from "@/lib/project-enter";

type ReaderHeaderProps = {
  slug: string;
  title: string;
};

function appNameFor(slug: string, title: string) {
  return (
    PROJECT_PROGRAM_BLUEPRINTS.find((program) => program.id === slug)?.appName ??
    title
  );
}

function shouldUseNativeNavigation(event: MouseEvent<HTMLAnchorElement>) {
  return (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  );
}

export function ReaderHeader({ slug, title }: ReaderHeaderProps) {
  const appName = appNameFor(slug, title);

  return (
    <header className="reader-header" aria-label="Reader controls">
      <div className="reader-header-project">
        <span aria-hidden="true">
          <Myles97Icon
            name={iconForProgram(slug)}
            size={16}
            compact
            variant="color"
          />
        </span>
        <strong>{appName}</strong>
      </div>
      <Link
        className="reader-return"
        href="/"
        aria-label="Return to Desktop"
        onClick={(event) => {
          if (shouldUseNativeNavigation(event)) return;
          const snapshot = readProjectReturnSnapshot();
          if (!snapshot || snapshot.slug !== slug) return;
          if (!dispatchProjectReturnRequest(snapshot)) return;
          event.preventDefault();
        }}
      >
        <span aria-hidden="true">←</span>
        <span className="reader-return-label reader-return-label--full" aria-hidden="true">
          Return to Desktop
        </span>
        <span className="reader-return-label reader-return-label--compact" aria-hidden="true">
          Desktop
        </span>
      </Link>
    </header>
  );
}
