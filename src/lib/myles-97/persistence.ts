import { isProgramId, type ProgramId } from "@/lib/myles-97/programs";
import {
  createInitialWorkstationState,
  type DisplayPreferences,
  type WindowGeometry,
  type WorkstationState,
} from "@/lib/myles-97/state";

export const LOCAL_WORKSTATION_KEY = "myles97.desktop.v1";
export const SESSION_WORKSTATION_KEY = "myles97.session.v1";

const DEFAULT_DISPLAY: DisplayPreferences = {
  highContrast: false,
  reduceMotion: false,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function parsePrograms(value: unknown): ProgramId[] {
  if (!Array.isArray(value)) return [];
  return Array.from(new Set(value.filter(isProgramId)));
}

function parseGeometry(value: unknown): Partial<Record<ProgramId, WindowGeometry>> {
  if (!isRecord(value)) return {};
  const geometry: Partial<Record<ProgramId, WindowGeometry>> = {};

  for (const [id, entry] of Object.entries(value)) {
    if (!isProgramId(id) || !isRecord(entry)) continue;
    const { x, y, width, height } = entry;
    if (![x, y, width, height].every((part) => typeof part === "number" && Number.isFinite(part))) {
      continue;
    }
    geometry[id] = {
      x: x as number,
      y: y as number,
      width: width as number,
      height: height as number,
    };
  }

  return geometry;
}

function parseDisplay(value: unknown): DisplayPreferences {
  if (!isRecord(value)) return { ...DEFAULT_DISPLAY };
  return {
    highContrast: value.highContrast === true,
    reduceMotion: value.reduceMotion === true,
  };
}

function parseStoredJson(storage: Storage, key: string): Record<string, unknown> | null {
  const raw = storage.getItem(key);
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    return isRecord(value) && value.version === 1 ? value : null;
  } catch {
    return null;
  }
}

function fallbackFocus(
  openPrograms: readonly ProgramId[],
  minimizedPrograms: readonly ProgramId[],
): ProgramId | null {
  for (let index = openPrograms.length - 1; index >= 0; index -= 1) {
    const id = openPrograms[index];
    if (!minimizedPrograms.includes(id)) return id;
  }
  return null;
}

export function loadPersistedWorkstation(): WorkstationState {
  const initial = createInitialWorkstationState();
  if (typeof window === "undefined") return initial;

  try {
    const local = parseStoredJson(window.localStorage, LOCAL_WORKSTATION_KEY);
    const session = parseStoredJson(window.sessionStorage, SESSION_WORKSTATION_KEY);
    if (!local && !session) return initial;

    const restoredOpenPrograms = session ? parsePrograms(session.openPrograms) : initial.openPrograms;
    const openPrograms = restoredOpenPrograms.length > 0 ? restoredOpenPrograms : initial.openPrograms;
    const minimizedPrograms = session
      ? parsePrograms(session.minimizedPrograms).filter((id) => openPrograms.includes(id))
      : initial.minimizedPrograms;
    const focusedCandidate = session?.focusedProgram;
    const focusedProgram =
      isProgramId(focusedCandidate) &&
      openPrograms.includes(focusedCandidate) &&
      !minimizedPrograms.includes(focusedCandidate)
        ? focusedCandidate
        : fallbackFocus(openPrograms, minimizedPrograms);

    return {
      version: 1,
      bootCompleted: local?.bootCompleted === true,
      openPrograms,
      minimizedPrograms,
      focusedProgram,
      recentPrograms: local ? parsePrograms(local.recentPrograms) : initial.recentPrograms,
      windowGeometry: session ? parseGeometry(session.windowGeometry) : {},
      desktopScrollY:
        typeof session?.desktopScrollY === "number" && Number.isFinite(session.desktopScrollY)
          ? Math.max(0, session.desktopScrollY)
          : 0,
      displayPreferences: local ? parseDisplay(local.displayPreferences) : initial.displayPreferences,
    };
  } catch {
    return initial;
  }
}

export function saveLocalWorkstation(state: WorkstationState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      LOCAL_WORKSTATION_KEY,
      JSON.stringify({
        version: 1,
        bootCompleted: state.bootCompleted,
        recentPrograms: state.recentPrograms,
        displayPreferences: state.displayPreferences,
      }),
    );
  } catch {
    // Storage can be unavailable in private or restricted browsing contexts.
  }
}

export function saveSessionWorkstation(state: WorkstationState): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(
      SESSION_WORKSTATION_KEY,
      JSON.stringify({
        version: 1,
        openPrograms: state.openPrograms,
        minimizedPrograms: state.minimizedPrograms,
        focusedProgram: state.focusedProgram,
        windowGeometry: state.windowGeometry,
        desktopScrollY: state.desktopScrollY,
      }),
    );
  } catch {
    // Session persistence is optional; runtime state remains authoritative.
  }
}
