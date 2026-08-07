"use client";

import Image from "next/image";
import { useEffect, useState, type RefObject } from "react";
import { iconForProgram, Myles97Icon } from "@/components/myles-97/icons";
import type { ProgramDefinition, ProgramId } from "@/lib/myles-97/programs";

export type TaskbarProps = {
  programs: readonly ProgramDefinition[];
  openPrograms: readonly ProgramId[];
  minimizedPrograms: readonly ProgramId[];
  focusedProgram: ProgramId | null;
  startOpen: boolean;
  startButtonRef: RefObject<HTMLButtonElement | null>;
  onToggleStart: () => void;
  onFocus: (id: ProgramId) => void;
  onMinimize: (id: ProgramId) => void;
  onRestore: (id: ProgramId) => void;
};

const systemTitles: Partial<Record<ProgramId, string>> = {
  welcome: "Welcome to Myles 98",
  "selected-work": "Selected Work",
  about: "About Myles",
  "loose-parts": "Loose Parts",
  resume: "Résumé",
  "display-properties": "Display Properties",
  "trini-roti": "Buss Up Shut.txt",
};

function titleFor(id: ProgramId, programs: readonly ProgramDefinition[]) {
  return programs.find((program) => program.id === id)?.appName ?? systemTitles[id] ?? id;
}

export function Taskbar({
  programs,
  openPrograms,
  minimizedPrograms,
  focusedProgram,
  startOpen,
  startButtonRef,
  onToggleStart,
  onFocus,
  onMinimize,
  onRestore,
}: TaskbarProps) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const updateClock = () => setNow(new Date());
    updateClock();
    const timer = window.setInterval(updateClock, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const minimized = new Set(minimizedPrograms);

  return (
    <nav className="myles97-taskbar" aria-label="Open programs">
      <button
        ref={startButtonRef}
        type="button"
        className="myles97-start-button"
        aria-expanded={startOpen}
        aria-controls="myles97-start-menu"
        onClick={onToggleStart}
      >
        <span className="myles97-start-mark" aria-hidden="true">
          <Image src="/logomark.svg" alt="" width={24} height={24} />
        </span>
        <strong>Start</strong>
      </button>

      <div className="myles97-task-buttons">
        {openPrograms.map((id) => {
          const isMinimized = minimized.has(id);
          const isFocused = focusedProgram === id && !isMinimized;
          const title = titleFor(id, programs);

          return (
            <button
              key={id}
              type="button"
              className="myles97-task-button"
              data-focused={isFocused ? "true" : "false"}
              data-minimized={isMinimized ? "true" : "false"}
              aria-pressed={isFocused}
              onClick={() => {
                if (isMinimized) {
                  onRestore(id);
                } else if (isFocused) {
                  onMinimize(id);
                } else {
                  onFocus(id);
                }
              }}
            >
              <Myles97Icon name={iconForProgram(id)} size={16} aria-hidden="true" />
              <span className="myles97-task-label">{title}</span>
            </button>
          );
        })}
      </div>

      <time className="myles97-clock" dateTime={now?.toISOString()}>
        {now
          ? now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
          : "--:--"}
      </time>
    </nav>
  );
}
