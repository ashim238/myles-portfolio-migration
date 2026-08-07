"use client";

import { useEffect, useReducer, useState } from "react";
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
} from "@/lib/myles-97/state";

export type Myles97ShellProps = {
  programs: readonly ProgramDefinition[];
};

export function Myles97Shell({ programs }: Myles97ShellProps) {
  const [state, dispatch] = useReducer(
    workstationReducer,
    undefined,
    createInitialWorkstationState,
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    dispatch({ type: "hydrate", state: loadPersistedWorkstation() });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveLocalWorkstation(state);
    saveSessionWorkstation(state);
  }, [hydrated, state]);

  return (
    <main
      id="main-content"
      className="myles97-shell"
      data-m97-contrast={state.displayPreferences.highContrast ? "high" : "default"}
      data-m97-motion={state.displayPreferences.reduceMotion ? "reduce" : "full"}
    >
      <WorkstationDesktop programs={programs} state={state} dispatch={dispatch} />
    </main>
  );
}
