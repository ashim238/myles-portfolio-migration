"use client";

import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
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
  type WorkstationState,
} from "@/lib/myles-97/state";

export type Myles97ShellProps = {
  programs: readonly ProgramDefinition[];
  looseParts: readonly LoosePartSummary[];
};

type HydrationSnapshot = {
  complete: boolean;
  state: WorkstationState | null;
};

type HydrationStore = {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => boolean;
  getServerSnapshot: () => boolean;
  markComplete: () => void;
};

function createHydrationStore(): HydrationStore {
  let complete = false;
  const listeners = new Set<() => void>();

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot() {
      return complete;
    },
    getServerSnapshot() {
      return false;
    },
    markComplete() {
      if (complete) return;
      complete = true;
      for (const listener of listeners) listener();
    },
  };
}

export function Myles97Shell({ programs, looseParts }: Myles97ShellProps) {
  const [state, dispatch] = useReducer(
    workstationReducer,
    undefined,
    createInitialWorkstationState,
  );
  const hydration = useRef<HydrationSnapshot>({
    complete: false,
    state: null,
  });
  const persistenceReady = useRef(false);
  const [hydrationStore] = useState(createHydrationStore);
  const hydrated = useSyncExternalStore(
    hydrationStore.subscribe,
    hydrationStore.getSnapshot,
    hydrationStore.getServerSnapshot,
  );
  const pocket = usePocket97();

  useEffect(() => {
    const loaded = loadPersistedWorkstation();
    hydration.current = { complete: true, state: loaded };
    dispatch({ type: "hydrate", state: loaded });
  }, []);

  useEffect(() => {
    const loaded = hydration.current.state;
    if (!hydration.current.complete || !loaded) return;

    if (!persistenceReady.current) {
      if (state !== loaded) return;
      persistenceReady.current = true;
      hydrationStore.markComplete();
    }

    saveLocalWorkstation(state);
    saveSessionWorkstation(state);
  }, [hydrationStore, state]);

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
          dispatch={dispatch}
        />
      ) : (
        <WorkstationDesktop
          programs={programs}
          looseParts={looseParts}
          state={state}
          dispatch={dispatch}
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
