"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type Dispatch } from "react";
import { DisplayProperties } from "@/components/myles-97/display-properties";
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
  const startButtonRef = useRef<HTMLButtonElement>(null);
  const appsButtonRef = useRef<HTMLButtonElement>(null);
  const workButtonRef = useRef<HTMLButtonElement>(null);

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
    if (id === "welcome" || id === "selected-work") {
      setActiveProgram(null);
    } else {
      dispatch({ type: "open", id });
      setActiveProgram(id);
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
        setStartOpen(false);
        startButtonRef.current?.focus();
      }
      if (appsOpen) {
        setAppsOpen(false);
        appsButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [appsOpen, startOpen]);

  const recentPrograms = state.recentPrograms.filter(
    (id) => id !== "welcome" && id !== "selected-work" && id !== "reminders",
  );

  const activeProject = activeProgram
    ? projectById.get(activeProgram as ProjectProgramId)
    : undefined;

  return (
    <div className="pocket97-shell">
      <div className="pocket97-stage">
        {activeProgram ? (
          <section className="pocket97-app" aria-labelledby="pocket97-app-title">
            <header className="pocket97-app-header">
              <button type="button" className="pocket97-back" onClick={returnHome}>
                <span aria-hidden="true">←</span>
                Back
              </button>
              <span className="pocket97-app-identity">
                <Myles97Icon
                  name={iconForProgram(activeProgram)}
                  size={20}
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
        <div className="pocket97-sheet" role="group" aria-label="Pocket 98 Start">
          <button type="button" onClick={() => openProgram("about")}>
            <Myles97Icon name="profile" size={20} variant="color" aria-hidden="true" />
            About Myles
          </button>
          <button type="button" onClick={() => openProgram("resume")}>
            <Myles97Icon name="resume" size={20} variant="color" aria-hidden="true" />
            Résumé
          </button>
          <button type="button" onClick={() => openProgram("display-properties")}>
            <Myles97Icon name="display" size={20} variant="color" aria-hidden="true" />
            Display Properties
          </button>
          <a href={`mailto:${siteConfig.email}`}>
            <Myles97Icon name="mail" size={20} variant="color" aria-hidden="true" />
            E-mail
          </a>
        </div>
      ) : null}

      {appsOpen ? (
        <div className="pocket97-sheet" role="group" aria-label="Open Apps">
          {recentPrograms.length > 0 ? (
            recentPrograms
              .slice()
              .reverse()
              .map((id) => (
                <button key={id} type="button" onClick={() => openProgram(id)}>
                  <Myles97Icon
                    name={iconForProgram(id)}
                    size={20}
                    variant="color"
                    aria-hidden="true"
                  />
                  {titleFor(id)}
                </button>
              ))
          ) : (
            <p>No other programs are open yet.</p>
          )}
        </div>
      ) : null}

      <nav className="pocket97-dock" aria-label="Pocket 98 dock">
        <button
          ref={startButtonRef}
          type="button"
          aria-expanded={startOpen}
          onClick={() => {
            setAppsOpen(false);
            setStartOpen((open) => !open);
          }}
        >
          <Myles97Icon name="app" size={20} variant="color" aria-hidden="true" />
          <span>Start</span>
        </button>
        <button ref={workButtonRef} type="button" onClick={returnHome}>
          <Myles97Icon name="folder" size={20} variant="color" aria-hidden="true" />
          <span>Work</span>
        </button>
        <button type="button" onClick={() => openProgram("loose-parts")}>
          <Myles97Icon name="loose-parts" size={20} variant="color" aria-hidden="true" />
          <span>Loose Parts</span>
        </button>
        <button
          ref={appsButtonRef}
          type="button"
          aria-expanded={appsOpen}
          onClick={() => {
            setStartOpen(false);
            setAppsOpen((open) => !open);
          }}
        >
          <Myles97Icon name="display" size={20} variant="color" aria-hidden="true" />
          <span>Open Apps</span>
        </button>
      </nav>
    </div>
  );
}
