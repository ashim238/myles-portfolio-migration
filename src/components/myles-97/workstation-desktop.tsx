"use client";

import { useCallback, useEffect, useRef, useState, type Dispatch } from "react";
import { DisplayProperties } from "@/components/myles-97/display-properties";
import { Myles97Icon } from "@/components/myles-97/icons";
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

export type WorkstationDesktopProps = {
  programs: readonly ProgramDefinition[];
  looseParts: readonly LoosePartSummary[];
  state: WorkstationState;
  dispatch: Dispatch<WorkstationAction>;
};

const defaultGeometry: Partial<Record<ProgramId, WindowGeometry>> = {
  "selected-work": { x: 136, y: 112, width: 744, height: 536 },
  welcome: { x: 896, y: 160, width: 352, height: 312 },
  about: { x: 312, y: 124, width: 540, height: 430 },
  "loose-parts": { x: 232, y: 92, width: 720, height: 520 },
  resume: { x: 344, y: 112, width: 560, height: 470 },
  reminders: { x: 520, y: 126, width: 440, height: 390 },
  "trini-roti": { x: 472, y: 92, width: 520, height: 560 },
  "display-properties": { x: 504, y: 168, width: 448, height: 456 },
};

const evidenceLabels = {
  built: "Built",
  shipped: "Shipped",
  observed: "Observed",
  proposed: "Proposed",
  "needs-proof": "Still needs proof",
} as const;

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

export function WorkstationDesktop({
  programs,
  looseParts,
  state,
  dispatch,
}: WorkstationDesktopProps) {
  const [startOpen, setStartOpen] = useState(false);
  const startButtonRef = useRef<HTMLButtonElement>(null);
  const remindersTriggerRef = useRef<HTMLButtonElement>(null);
  const recipeTriggerRef = useRef<HTMLButtonElement>(null);
  const pendingWindowFocus = useRef(false);
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
  const closeStart = useCallback(() => {
    setStartOpen(false);
    startButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!pendingWindowFocus.current) return;
    pendingWindowFocus.current = false;
    if (!state.focusedProgram) return;

    const windowElement = document.querySelector<HTMLElement>(
      `[data-m97-program-window="${state.focusedProgram}"]`,
    );
    if (!windowElement || windowElement.contains(document.activeElement)) return;
    windowElement
      .querySelector<HTMLButtonElement>(
        `[data-m97-window-move="${state.focusedProgram}"]`,
      )
      ?.focus();
  }, [state.focusedProgram, state.minimizedPrograms, state.openPrograms]);

  const commonWindowProps = (id: ProgramId, stackIndex: number) => ({
    id,
    geometry: state.windowGeometry[id] ?? fallbackGeometry(id, stackIndex),
    focused: state.focusedProgram === id,
    isDefaultPosition: state.windowGeometry[id] === undefined,
    stackIndex: 10 + stackIndex,
    onFocus: (programId: ProgramId) => dispatch({ type: "focus", id: programId }),
    onMove: (programId: ProgramId, geometry: WindowGeometry) =>
      dispatch({ type: "move", id: programId, geometry }),
    onMinimize: (programId: ProgramId) =>
      dispatchWithWindowFocus({ type: "minimize", id: programId }),
    onClose: (programId: ProgramId) =>
      dispatchWithWindowFocus({ type: "close", id: programId }),
  });

  return (
    <div className="myles97-desktop" aria-label="Myles 98 desktop">
      <nav className="myles97-desktop-shortcuts" aria-label="Desktop shortcuts">
        <button type="button" onClick={() => openProgram("selected-work")}>
          <Myles97Icon name="folder" size={32} variant="color" aria-hidden="true" />
          <span>Selected Work</span>
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
              title="Selected Work"
              status={`${programs.length} portfolio programs`}
            >
              <SelectedWorkExplorer
                programs={programs}
                onOpen={(programId: ProjectProgramId) => openProgram(programId)}
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
                onReset={() => dispatch({ type: "reset" })}
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
            status={evidenceLabels[project.primaryEvidence]}
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

      <StartMenu
        open={startOpen}
        onClose={closeStart}
        onOpenProgram={openProgram}
        onRequestReset={() => openProgram("display-properties")}
      />
      <Taskbar
        programs={programs}
        openPrograms={state.openPrograms}
        minimizedPrograms={state.minimizedPrograms}
        focusedProgram={state.focusedProgram}
        startOpen={startOpen}
        startButtonRef={startButtonRef}
        onToggleStart={() => setStartOpen((open) => !open)}
        onFocus={(id) => dispatchWithWindowFocus({ type: "focus", id })}
        onMinimize={(id) => dispatchWithWindowFocus({ type: "minimize", id })}
        onRestore={(id) => dispatchWithWindowFocus({ type: "restore", id })}
      />
    </div>
  );
}
