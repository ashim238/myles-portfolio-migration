"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type Dispatch } from "react";
import { DisplayProperties } from "@/components/myles-97/display-properties";
import {
  containTabFocus,
  focusFirstAvailable,
} from "@/components/myles-97/focus-management";
import { iconForProgram, Myles97Icon } from "@/components/myles-97/icons";
import type { LoosePartSummary } from "@/components/myles-97/loose-parts-program";
import { ProjectProgram } from "@/components/myles-97/project-program";
import { RecipeNoteProgram } from "@/components/myles-97/recipe-note";
import {
  SecondaryProgram,
  type SecondaryProgramId,
} from "@/components/myles-97/secondary-programs";
import { SelectedWorkExplorer } from "@/components/myles-97/selected-work-explorer";
import type {
  ProgramDefinition,
  ProgramId,
  ProjectProgramId,
} from "@/lib/myles-97/programs";
import { TRINI_ROTI_RECIPE } from "@/lib/myles-97/recipe";
import type {
  WorkstationAction,
  WorkstationState,
} from "@/lib/myles-97/state";
import { siteConfig } from "@/lib/site-config";

export type Pocket97ShellProps = {
  programs: readonly ProgramDefinition[];
  looseParts: readonly LoosePartSummary[];
  state: WorkstationState;
  dispatch: Dispatch<WorkstationAction>;
};

const secondaryTitles: Record<SecondaryProgramId, string> = {
  about: "About Myles",
  "loose-parts": "Loose Parts",
  resume: "Résumé",
};

function isSecondaryProgram(id: ProgramId): id is SecondaryProgramId {
  return id === "about" || id === "loose-parts" || id === "resume";
}

export function Pocket97Shell({
  programs,
  looseParts,
  state,
  dispatch,
}: Pocket97ShellProps) {
  const [activeProgram, setActiveProgram] = useState<ProgramId | null>(null);
  const [startOpen, setStartOpen] = useState(false);
  const [appsOpen, setAppsOpen] = useState(false);
  const [programFocusRequest, setProgramFocusRequest] = useState(0);
  const startButtonRef = useRef<HTMLButtonElement>(null);
  const appsButtonRef = useRef<HTMLButtonElement>(null);
  const workButtonRef = useRef<HTMLButtonElement>(null);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const startSheetRef = useRef<HTMLDivElement>(null);
  const appsSheetRef = useRef<HTMLDivElement>(null);
  const sheetReturnFocusRef = useRef<HTMLButtonElement | null>(null);
  const sheetOpen = startOpen || appsOpen;

  const projectById = useMemo(
    () => new Map(programs.map((program) => [program.id, program])),
    [programs],
  );

  const titleFor = (id: ProgramId) => {
    const project = projectById.get(id as ProjectProgramId);
    if (project) return project.appName;
    if (isSecondaryProgram(id)) return secondaryTitles[id];
    if (id === "trini-roti") return "Buss Up Shut.txt";
    if (id === "display-properties") return "Display Properties";
    return id === "welcome" ? "Welcome" : "Selected Work";
  };

  const openProgram = (id: ProgramId) => {
    sheetReturnFocusRef.current = null;
    if (id === "welcome" || id === "selected-work") {
      setActiveProgram(null);
    } else {
      dispatch({ type: "open", id });
      setActiveProgram(id);
      setProgramFocusRequest((request) => request + 1);
    }
    setStartOpen(false);
    setAppsOpen(false);
  };

  const returnHome = () => {
    setActiveProgram(null);
    setStartOpen(false);
    setAppsOpen(false);
    window.requestAnimationFrame(() => workButtonRef.current?.focus());
  };

  useEffect(() => {
    if (!startOpen && !appsOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (startOpen) {
        sheetReturnFocusRef.current = startButtonRef.current;
        setStartOpen(false);
      }
      if (appsOpen) {
        sheetReturnFocusRef.current = appsButtonRef.current;
        setAppsOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [appsOpen, startOpen]);

  useEffect(() => {
    if (sheetOpen) return;
    const trigger = sheetReturnFocusRef.current;
    if (!trigger) return;
    sheetReturnFocusRef.current = null;
    trigger.focus();
  }, [sheetOpen]);

  useEffect(() => {
    const openSheet = startOpen ? startSheetRef.current : appsOpen ? appsSheetRef.current : null;
    if (!openSheet) return;
    if (!focusFirstAvailable(openSheet)) openSheet.focus();
  }, [appsOpen, startOpen]);

  useEffect(() => {
    if (activeProgram && programFocusRequest > 0) backButtonRef.current?.focus();
  }, [activeProgram, programFocusRequest]);

  const recentPrograms = state.recentPrograms.filter(
    (id) => id !== "welcome" && id !== "selected-work" && id !== "reminders",
  );

  const activeProject = activeProgram
    ? projectById.get(activeProgram as ProjectProgramId)
    : undefined;

  return (
    <div className="pocket97-shell">
      <div className="pocket97-stage" inert={sheetOpen ? true : undefined}>
        {activeProgram ? (
          <section
            className="pocket97-app"
            aria-labelledby="pocket97-app-title"
            data-project-transition-source="selected-work"
          >
            <header className="pocket97-app-header">
              <button
                ref={backButtonRef}
                type="button"
                className="pocket97-back"
                onClick={returnHome}
              >
                <span aria-hidden="true">←</span>
                Back
              </button>
              <span className="pocket97-app-identity">
                <Myles97Icon
                  name={iconForProgram(activeProgram)}
                  size={24}
                  variant="color"
                  aria-hidden="true"
                />
                <strong id="pocket97-app-title">{titleFor(activeProgram)}</strong>
              </span>
            </header>
            <div className="pocket97-app-content">
              {activeProject ? (
                <ProjectProgram
                  program={activeProject}
                  reduceMotion={state.displayPreferences.reduceMotion}
                  returnTarget="selected-work"
                />
              ) : activeProgram === "trini-roti" ? (
                <RecipeNoteProgram />
              ) : activeProgram === "display-properties" ? (
                <DisplayProperties
                  preferences={state.displayPreferences}
                  onChange={(preferences) => dispatch({ type: "display", preferences })}
                  onReset={() => {
                    dispatch({ type: "reset" });
                    setActiveProgram(null);
                  }}
                />
              ) : isSecondaryProgram(activeProgram) ? (
                <SecondaryProgram id={activeProgram} looseParts={looseParts} />
              ) : null}
            </div>
          </section>
        ) : (
          <div className="pocket97-home">
            <header className="pocket97-intro">
              <div className="pocket97-intro-mark" aria-hidden="true">
                <Image src="/logomark.svg" alt="" width={72} height={72} priority />
              </div>
              <div>
                <p className="myles97-eyebrow">Pocket 98</p>
                <h1>Myles Ashitey</h1>
                <p className="pocket97-statement">
                  Design, code, and everything in between.
                </p>
                <p className="pocket97-context">
                  Previously TikTok and UMG. Latest project: Fresh Greens.
                </p>
              </div>
            </header>

            <section id="selected-work" className="pocket97-work" aria-labelledby="pocket97-work-title">
              <div className="pocket97-section-heading">
                <h2 id="pocket97-work-title">Selected Work</h2>
                <span>{programs.length} programs</span>
              </div>
              <SelectedWorkExplorer
                programs={programs}
                onOpen={(id) => openProgram(id)}
                reduceMotion={state.displayPreferences.reduceMotion}
              />
            </section>

            <button
              type="button"
              className="pocket97-recipe-card"
              onClick={() => openProgram("trini-roti")}
            >
              <span className="myles97-roti-label">Recipe note</span>
              <strong>{TRINI_ROTI_RECIPE.title}</strong>
              <span>{TRINI_ROTI_RECIPE.preview}</span>
            </button>
          </div>
        )}
      </div>

      {startOpen ? (
        <div
          ref={startSheetRef}
          id="pocket97-start-sheet"
          className="pocket97-sheet"
          role="dialog"
          aria-modal="true"
          aria-label="Pocket 98 Start"
          tabIndex={-1}
          onKeyDown={(event) => containTabFocus(event, startSheetRef.current)}
        >
          <button type="button" onClick={() => openProgram("about")}>
            <Myles97Icon name="profile" size={24} variant="color" aria-hidden="true" />
            About Myles
          </button>
          <button type="button" onClick={() => openProgram("resume")}>
            <Myles97Icon name="resume" size={24} variant="color" aria-hidden="true" />
            Résumé
          </button>
          <button type="button" onClick={() => openProgram("display-properties")}>
            <Myles97Icon name="display" size={24} variant="color" aria-hidden="true" />
            Display Properties
          </button>
          <a
            href={`mailto:${siteConfig.email}`}
            onClick={() => {
              sheetReturnFocusRef.current = startButtonRef.current;
              setStartOpen(false);
            }}
          >
            <Myles97Icon name="mail" size={24} variant="color" aria-hidden="true" />
            E-mail
          </a>
          <button
            type="button"
            className="pocket97-sheet-dismiss"
            aria-label="Close Pocket 98 Start"
            onClick={() => {
              sheetReturnFocusRef.current = startButtonRef.current;
              setStartOpen(false);
            }}
          >
            Close
          </button>
        </div>
      ) : null}

      {appsOpen ? (
        <div
          ref={appsSheetRef}
          id="pocket97-open-apps-sheet"
          className="pocket97-sheet"
          role="dialog"
          aria-modal="true"
          aria-label="Open Apps"
          tabIndex={-1}
          onKeyDown={(event) => containTabFocus(event, appsSheetRef.current)}
        >
          {recentPrograms.length > 0 ? (
            recentPrograms
              .slice()
              .reverse()
              .map((id) => (
                <button key={id} type="button" onClick={() => openProgram(id)}>
                  <Myles97Icon
                    name={iconForProgram(id)}
                    size={24}
                    variant="color"
                    aria-hidden="true"
                  />
                  {titleFor(id)}
                </button>
              ))
          ) : (
            <p>No other programs are open yet.</p>
          )}
          <button
            type="button"
            className="pocket97-sheet-dismiss"
            aria-label="Close Open Apps"
            onClick={() => {
              sheetReturnFocusRef.current = appsButtonRef.current;
              setAppsOpen(false);
            }}
          >
            Close
          </button>
        </div>
      ) : null}

      <nav
        className="pocket97-dock"
        aria-label="Pocket 98 dock"
        inert={sheetOpen ? true : undefined}
      >
        <button
          ref={startButtonRef}
          type="button"
          aria-controls="pocket97-start-sheet"
          aria-expanded={startOpen}
          aria-haspopup="dialog"
          onClick={() => {
            sheetReturnFocusRef.current = startButtonRef.current;
            setAppsOpen(false);
            setStartOpen((open) => !open);
          }}
        >
          <Myles97Icon name="app" size={24} variant="color" aria-hidden="true" />
          <span>Start</span>
        </button>
        <button ref={workButtonRef} type="button" onClick={returnHome}>
          <Myles97Icon name="folder" size={24} variant="color" aria-hidden="true" />
          <span>Work</span>
        </button>
        <button type="button" onClick={() => openProgram("loose-parts")}>
          <Myles97Icon name="loose-parts" size={24} variant="color" aria-hidden="true" />
          <span>Loose Parts</span>
        </button>
        <button
          ref={appsButtonRef}
          type="button"
          aria-controls="pocket97-open-apps-sheet"
          aria-expanded={appsOpen}
          aria-haspopup="dialog"
          onClick={() => {
            sheetReturnFocusRef.current = appsButtonRef.current;
            setStartOpen(false);
            setAppsOpen((open) => !open);
          }}
        >
          <Myles97Icon name="open-apps" size={24} variant="color" aria-hidden="true" />
          <span>Open Apps</span>
        </button>
      </nav>
    </div>
  );
}
