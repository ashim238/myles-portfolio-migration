"use client";

import { useCallback, useEffect, useRef, useState, type Dispatch } from "react";
import { animate } from "motion";
import { DisplayProperties } from "@/components/myles-97/display-properties";
import { Myles97Icon } from "@/components/myles-97/icons";
import { PaintProgram } from "@/components/myles-97/paint-program";
import type { LoosePartSummary } from "@/components/myles-97/loose-parts-program";
import { ProgramWindow } from "@/components/myles-97/program-window";
import { ProjectProgram } from "@/components/myles-97/project-program";
import { RecipeNote, RecipeNoteProgram } from "@/components/myles-97/recipe-note";
import {
  RemindersProgram,
  RemindersWidget,
} from "@/components/myles-97/reminders-widget";
import {
  SecondaryProgram,
  type SecondaryProgramId,
} from "@/components/myles-97/secondary-programs";
import { SelectedWorkExplorer } from "@/components/myles-97/selected-work-explorer";
import { StartMenu } from "@/components/myles-97/start-menu";
import { Taskbar } from "@/components/myles-97/taskbar";
import { WelcomeProgram } from "@/components/myles-97/welcome-program";
import type {
  ProgramDefinition,
  ProgramId,
  ProjectProgramId,
} from "@/lib/myles-97/programs";
import type {
  WindowGeometry,
  WorkstationAction,
  WorkstationState,
} from "@/lib/myles-97/state";
import { setTheme } from "@/lib/myles-97/theme";

export type WorkstationDesktopProps = {
  programs: readonly ProgramDefinition[];
  looseParts: readonly LoosePartSummary[];
  state: WorkstationState;
  dispatch: Dispatch<WorkstationAction>;
};

const defaultGeometry: Partial<Record<ProgramId, WindowGeometry>> = {
  "selected-work": { x: 136, y: 112, width: 744, height: 536 },
  welcome: { x: 896, y: 64, width: 352, height: 352 },
  about: { x: 312, y: 124, width: 540, height: 430 },
  "loose-parts": { x: 232, y: 92, width: 720, height: 520 },
  resume: { x: 344, y: 112, width: 560, height: 470 },
  reminders: { x: 520, y: 126, width: 440, height: 390 },
  "trini-roti": { x: 472, y: 92, width: 520, height: 560 },
  "display-properties": { x: 504, y: 168, width: 448, height: 456 },
  paint: { x: 372, y: 144, width: 454, height: 408 },
};

const secondaryTitles: Record<SecondaryProgramId, string> = {
  about: "About Myles",
  "loose-parts": "Loose Parts",
  resume: "Résumé",
};

function isSecondaryProgram(id: ProgramId): id is SecondaryProgramId {
  return id === "about" || id === "loose-parts" || id === "resume";
}

function fallbackGeometry(id: ProgramId, stackIndex: number): WindowGeometry {
  const defined = defaultGeometry[id];
  if (defined) return defined;

  const offset = Math.min(stackIndex, 6) * 24;
  return {
    x: 184 + offset,
    y: 104 + offset,
    width: 720,
    height: 520,
  };
}

function resolvedGeometry(
  id: ProgramId,
  stackIndex: number,
  stored: WindowGeometry | undefined,
): WindowGeometry {
  const fallback = fallbackGeometry(id, stackIndex);
  if (!stored) return fallback;

  // Windows can be moved but not resized. Preserve the user's position while
  // allowing current authored dimensions to replace stale persisted sizes.
  return {
    ...fallback,
    x: stored.x,
    y: stored.y,
  };
}

export function WorkstationDesktop({
  programs,
  looseParts,
  state,
  dispatch,
}: WorkstationDesktopProps) {
  const [startOpen, setStartOpen] = useState(false);
  const [resetRequested, setResetRequested] = useState(false);
  const startButtonRef = useRef<HTMLButtonElement>(null);
  const remindersTriggerRef = useRef<HTMLButtonElement>(null);
  const recipeTriggerRef = useRef<HTMLButtonElement>(null);
  const restoreStartFocusRef = useRef(false);
  const pendingWindowFocus = useRef(false);
  const previouslyOpenPrograms = useRef(new Set(state.openPrograms));
  const minimized = new Set(state.minimizedPrograms);
  const projectById = new Map(programs.map((program) => [program.id, program]));
  const dispatchWithWindowFocus = useCallback(
    (action: WorkstationAction) => {
      pendingWindowFocus.current = true;
      dispatch(action);
    },
    [dispatch],
  );
  const openProgram = useCallback(
    (id: ProgramId) => {
      setStartOpen(false);
      dispatchWithWindowFocus({ type: "open", id });
    },
    [dispatchWithWindowFocus],
  );
  const requestReset = useCallback(() => {
    setResetRequested(true);
    openProgram("display-properties");
  }, [openProgram]);
  const closeStart = useCallback(() => {
    restoreStartFocusRef.current = true;
    setStartOpen(false);
  }, []);

  useEffect(() => {
    if (startOpen || !restoreStartFocusRef.current) return;
    restoreStartFocusRef.current = false;
    const focusFrame = window.requestAnimationFrame(() => {
      startButtonRef.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(focusFrame);
  }, [startOpen]);

  useEffect(() => {
    if (!pendingWindowFocus.current) return;
    pendingWindowFocus.current = false;
    if (!state.focusedProgram) return;

    const windowElement = document.querySelector<HTMLElement>(
      `[data-m97-program-window="${state.focusedProgram}"]`,
    );
    if (!windowElement || windowElement.contains(document.activeElement)) return;
    windowElement
      .querySelector<HTMLElement>(
        `[data-m97-window-move="${state.focusedProgram}"]`,
      )
      ?.focus();
  }, [state.focusedProgram, state.minimizedPrograms, state.openPrograms]);

  useEffect(() => {
    const previous = previouslyOpenPrograms.current;
    const currentlyMinimized = new Set(state.minimizedPrograms);
    const newlyOpened = state.openPrograms.filter(
      (id) => !previous.has(id) && !currentlyMinimized.has(id),
    );
    previouslyOpenPrograms.current = new Set(state.openPrograms);
    if (state.displayPreferences.reduceMotion) return;

    const frame = window.requestAnimationFrame(() => {
      for (const id of newlyOpened) {
        const element = document.querySelector<HTMLElement>(
          `[data-m97-program-window="${id}"]`,
        );
        if (!element) continue;
        animate(
          element,
          { opacity: [0, 1], transform: ["scale(0.97)", "scale(1)"] },
          { duration: 0.2, ease: [0.23, 1, 0.32, 1] },
        );
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [state.displayPreferences.reduceMotion, state.minimizedPrograms, state.openPrograms]);

  const taskbarTransform = useCallback((id: ProgramId, windowElement: HTMLElement) => {
    const taskButton = document.querySelector<HTMLElement>(
      `[data-m97-task-program="${id}"]`,
    );
    if (!taskButton) return null;
    const windowRect = windowElement.getBoundingClientRect();
    const taskRect = taskButton.getBoundingClientRect();
    return {
      x: taskRect.left + taskRect.width / 2 - (windowRect.left + windowRect.width / 2),
      y: taskRect.top + taskRect.height / 2 - (windowRect.top + windowRect.height / 2),
      scale: Math.max(0.08, Math.min(0.22, taskRect.width / windowRect.width)),
    };
  }, []);

  const minimizeProgram = useCallback(async (id: ProgramId) => {
    const windowElement = document.querySelector<HTMLElement>(
      `[data-m97-program-window="${id}"]`,
    );
    const destination = windowElement ? taskbarTransform(id, windowElement) : null;
    if (!state.displayPreferences.reduceMotion && windowElement && destination) {
      const animation = animate(
        windowElement,
        {
          opacity: 0.22,
          transform: `translate3d(${destination.x}px, ${destination.y}px, 0) scale(${destination.scale})`,
        },
        { type: "spring", bounce: 0, duration: 0.32 },
      );
      try {
        await animation.finished;
      } catch {
        // A competing window action can intentionally interrupt this motion.
      }
    }
    dispatchWithWindowFocus({ type: "minimize", id });
  }, [dispatchWithWindowFocus, state.displayPreferences.reduceMotion, taskbarTransform]);

  const restoreProgram = useCallback((id: ProgramId) => {
    dispatchWithWindowFocus({ type: "restore", id });
    if (state.displayPreferences.reduceMotion) return;

    window.requestAnimationFrame(() => {
      const windowElement = document.querySelector<HTMLElement>(
        `[data-m97-program-window="${id}"]`,
      );
      if (!windowElement) return;
      const origin = taskbarTransform(id, windowElement);
      if (!origin) return;
      animate(
        windowElement,
        {
          opacity: [0.22, 1],
          transform: [
            `translate3d(${origin.x}px, ${origin.y}px, 0) scale(${origin.scale})`,
            "translate3d(0, 0, 0) scale(1)",
          ],
        },
        { type: "spring", bounce: 0, duration: 0.36 },
      );
    });
  }, [dispatchWithWindowFocus, state.displayPreferences.reduceMotion, taskbarTransform]);

  const commonWindowProps = (id: ProgramId, stackIndex: number) => ({
    id,
    geometry: resolvedGeometry(id, stackIndex, state.windowGeometry[id]),
    focused: state.focusedProgram === id,
    isDefaultPosition: state.windowGeometry[id] === undefined,
    stackIndex: 10 + stackIndex,
    reduceMotion: state.displayPreferences.reduceMotion,
    onFocus: (programId: ProgramId) =>
      dispatchWithWindowFocus({ type: "focus", id: programId }),
    onMove: (programId: ProgramId, geometry: WindowGeometry) =>
      dispatch({ type: "move", id: programId, geometry }),
    onMinimize: (programId: ProgramId) => {
      void minimizeProgram(programId);
    },
    onClose: (programId: ProgramId) =>
      dispatchWithWindowFocus({ type: "close", id: programId }),
  });

  return (
    <div className="myles97-desktop" aria-label="Myles 98 desktop">
      <div className="myles97-desktop-stage" inert={startOpen ? true : undefined}>
        <nav className="myles97-desktop-shortcuts" aria-label="Desktop shortcuts">
          <button type="button" onClick={() => openProgram("selected-work")}>
            <Myles97Icon name="folder" size={32} variant="color" aria-hidden="true" />
            <span>Work Stuff</span>
          </button>
          <button type="button" onClick={() => openProgram("about")}>
            <Myles97Icon name="profile" size={32} variant="color" aria-hidden="true" />
            <span>About Myles</span>
          </button>
          <button type="button" onClick={() => openProgram("loose-parts")}>
            <Myles97Icon name="loose-parts" size={32} variant="color" aria-hidden="true" />
            <span>Loose Parts</span>
          </button>
          <button type="button" onClick={() => openProgram("resume")}>
            <Myles97Icon name="resume" size={32} variant="color" aria-hidden="true" />
            <span>Résumé</span>
          </button>
          <button type="button" onClick={() => openProgram("paint")}>
            <Myles97Icon name="paintbrush" size={32} variant="color" aria-hidden="true" />
            <span>MDT Paint</span>
          </button>
        </nav>

        {state.openPrograms.map((id, stackIndex) => {
          if (minimized.has(id)) return null;
          const props = commonWindowProps(id, stackIndex);

          if (id === "welcome") {
            return (
              <ProgramWindow key={id} {...props} title="Welcome to Myles 98">
                <WelcomeProgram onSelectedWork={() => openProgram("selected-work")} />
              </ProgramWindow>
            );
          }

          if (id === "selected-work") {
            return (
              <ProgramWindow
                key={id}
                {...props}
                title="Work Stuff"
                status={`${programs.length} portfolio projects`}
              >
                <SelectedWorkExplorer
                  programs={programs}
                  onOpen={(programId: ProjectProgramId) => openProgram(programId)}
                  reduceMotion={state.displayPreferences.reduceMotion}
                />
              </ProgramWindow>
            );
          }

          if (id === "display-properties") {
            return (
              <ProgramWindow key={id} {...props} title="Display Properties">
                <DisplayProperties
                  preferences={state.displayPreferences}
                  onChange={(preferences) => dispatch({ type: "display", preferences })}
                  requestReset={resetRequested}
                  onResetRequestHandled={() => setResetRequested(false)}
                  onReset={() => {
                    setTheme("dark");
                    setResetRequested(false);
                    dispatch({ type: "reset" });
                  }}
                />
              </ProgramWindow>
            );
          }

          if (id === "trini-roti") {
            return (
              <ProgramWindow
                key={id}
                {...props}
                title="Buss Up Shut.txt"
                onClose={(programId) => {
                  dispatch({ type: "close", id: programId });
                  recipeTriggerRef.current?.focus();
                }}
              >
                <RecipeNoteProgram />
              </ProgramWindow>
            );
          }

          if (id === "reminders") {
            return (
              <ProgramWindow
                key={id}
                {...props}
                title="Reminders"
                onClose={(programId) => {
                  dispatch({ type: "close", id: programId });
                  remindersTriggerRef.current?.focus();
                }}
              >
                <RemindersProgram />
              </ProgramWindow>
            );
          }

          if (id === "paint") {
            return (
              <ProgramWindow key={id} {...props} title="MDT Paint">
                <PaintProgram />
              </ProgramWindow>
            );
          }

          if (isSecondaryProgram(id)) {
            return (
              <ProgramWindow key={id} {...props} title={secondaryTitles[id]}>
                <SecondaryProgram id={id} looseParts={looseParts} />
              </ProgramWindow>
            );
          }

          const project = projectById.get(id as ProjectProgramId);
          if (!project) return null;

          return (
            <ProgramWindow
              key={id}
              {...props}
              title={project.appName}
              status="Interactive preview"
            >
              <ProjectProgram
                program={project}
                reduceMotion={state.displayPreferences.reduceMotion}
              />
            </ProgramWindow>
          );
        })}

        <RemindersWidget
          triggerRef={remindersTriggerRef}
          onOpen={() => openProgram("reminders")}
        />

        <RecipeNote
          triggerRef={recipeTriggerRef}
          onOpen={() => openProgram("trini-roti")}
        />
      </div>

      <StartMenu
        open={startOpen}
        onClose={closeStart}
        onOpenProgram={openProgram}
        onRequestReset={requestReset}
        reduceMotion={state.displayPreferences.reduceMotion}
      />
      <Taskbar
        programs={programs}
        openPrograms={state.openPrograms}
        minimizedPrograms={state.minimizedPrograms}
        focusedProgram={state.focusedProgram}
        startOpen={startOpen}
        inert={startOpen}
        startButtonRef={startButtonRef}
        onToggleStart={() => setStartOpen((open) => !open)}
        onFocus={(id) => dispatchWithWindowFocus({ type: "focus", id })}
        onMinimize={(id) => {
          void minimizeProgram(id);
        }}
        onRestore={restoreProgram}
      />
    </div>
  );
}
