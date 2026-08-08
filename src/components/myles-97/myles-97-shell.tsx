"use client";

import { useCallback, useEffect, useReducer } from "react";
import { BootSequence } from "@/components/myles-97/boot-sequence";
import type { LoosePartSummary } from "@/components/myles-97/loose-parts-program";
import { Pocket97Shell } from "@/components/myles-97/pocket-97-shell";
import { usePocket97 } from "@/components/myles-97/use-pocket-97";
import { WorkstationDesktop } from "@/components/myles-97/workstation-desktop";
import type { ProgramDefinition } from "@/lib/myles-97/programs";
import {
  loadPersistedWorkstation,
  saveLocalWorkstation,
  saveSessionWorkstation,
} from "@/lib/myles-97/persistence";
import {
  createInitialWorkstationState,
  workstationReducer,
  type WorkstationAction,
  type WorkstationState,
} from "@/lib/myles-97/state";

export type Myles97ShellProps = {
  programs: readonly ProgramDefinition[];
  looseParts: readonly LoosePartSummary[];
};

type ShellState = {
  workstation: WorkstationState;
  hydrated: boolean;
};

type ShellAction =
  | WorkstationAction
  | { type: "hydrate-shell"; state: WorkstationState };

function createInitialShellState(): ShellState {
  return {
    workstation: createInitialWorkstationState(),
    hydrated: false,
  };
}

function shellReducer(current: ShellState, action: ShellAction): ShellState {
  if (action.type === "hydrate-shell") {
    return {
      workstation: action.state,
      hydrated: true,
    };
  }

  return {
    ...current,
    workstation: workstationReducer(current.workstation, action),
  };
}

export function Myles97Shell({ programs, looseParts }: Myles97ShellProps) {
  const [{ workstation: state, hydrated }, dispatch] = useReducer(
    shellReducer,
    undefined,
    createInitialShellState,
  );
  const pocket = usePocket97();

  useEffect(() => {
    dispatch({ type: "hydrate-shell", state: loadPersistedWorkstation() });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveLocalWorkstation(state);
    saveSessionWorkstation(state);
  }, [hydrated, state]);

  const dispatchWorkstation = useCallback((action: WorkstationAction) => {
    dispatch(action);
  }, []);

  const completeBoot = useCallback(() => {
    dispatch({ type: "boot-complete" });
  }, []);

  return (
    <main
      id="main-content"
      className="myles97-shell"
      data-m97-contrast={state.displayPreferences.highContrast ? "high" : "default"}
      data-m97-motion={state.displayPreferences.reduceMotion ? "reduce" : "full"}
      data-m97-shell={pocket ? "pocket" : "workstation"}
    >
      {pocket ? (
        <Pocket97Shell
          programs={programs}
          looseParts={looseParts}
          state={state}
          dispatch={dispatchWorkstation}
        />
      ) : (
        <WorkstationDesktop
          programs={programs}
          looseParts={looseParts}
          state={state}
          dispatch={dispatchWorkstation}
        />
      )}
      <BootSequence
        eligible={hydrated && !state.bootCompleted}
        reduceMotion={state.displayPreferences.reduceMotion}
        onComplete={completeBoot}
      />
    </main>
  );
}
