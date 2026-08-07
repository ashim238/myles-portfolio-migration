"use client";

import type { MouseEvent } from "react";
import { Myles97Icon } from "@/components/myles-97/icons";
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
          <Myles97Icon name="app" size={18} />
        </span>
        <strong>{appName}</strong>
      </div>
      <a
        className="reader-return"
        href="/"
        onClick={(event) => {
          if (shouldUseNativeNavigation(event)) return;
          const snapshot = readProjectReturnSnapshot();
          if (!snapshot || snapshot.slug !== slug) return;
          if (!dispatchProjectReturnRequest(snapshot)) return;
          event.preventDefault();
        }}
      >
        <span aria-hidden="true">←</span>
        Return to Desktop
      </a>
    </header>
  );
}
