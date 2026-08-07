import type { ProgramId } from "@/lib/myles-97/programs";

export type WindowGeometry = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ViewportBounds = {
  width: number;
  height: number;
};

export type DisplayPreferences = {
  highContrast: boolean;
  reduceMotion: boolean;
};

export type WorkstationState = {
  version: 1;
  bootCompleted: boolean;
  openPrograms: ProgramId[];
  minimizedPrograms: ProgramId[];
  focusedProgram: ProgramId | null;
  recentPrograms: ProgramId[];
  windowGeometry: Partial<Record<ProgramId, WindowGeometry>>;
  desktopScrollY: number;
  displayPreferences: DisplayPreferences;
};

export type WorkstationAction =
  | { type: "open" | "focus" | "minimize" | "restore" | "close"; id: ProgramId }
  | { type: "move"; id: ProgramId; geometry: WindowGeometry; viewport?: ViewportBounds }
  | { type: "hydrate"; state: WorkstationState }
  | { type: "boot-complete" }
  | { type: "display"; preferences: DisplayPreferences }
  | { type: "desktop-scroll"; y: number }
  | { type: "reset" };

const DEFAULT_VIEWPORT: ViewportBounds = { width: 1440, height: 900 };
const MIN_WINDOW_WIDTH = 280;
const MIN_WINDOW_HEIGHT = 180;
const MIN_VISIBLE_TITLE_BAR = 44;

export function createInitialWorkstationState(): WorkstationState {
  return {
    version: 1,
    bootCompleted: false,
    openPrograms: ["selected-work", "welcome"],
    minimizedPrograms: [],
    focusedProgram: "welcome",
    recentPrograms: ["selected-work", "welcome"],
    windowGeometry: {},
    desktopScrollY: 0,
    displayPreferences: {
      highContrast: false,
      reduceMotion: false,
    },
  };
}

function uniquePrograms(programs: readonly ProgramId[]): ProgramId[] {
  return Array.from(new Set(programs));
}

function bringToFront(
  openPrograms: readonly ProgramId[],
  id: ProgramId,
): ProgramId[] {
  return [...openPrograms.filter((programId) => programId !== id), id];
}

function appendRecent(
  recentPrograms: readonly ProgramId[],
  id: ProgramId,
): ProgramId[] {
  return [...recentPrograms.filter((programId) => programId !== id), id].slice(-8);
}

function nextFocusedProgram(
  openPrograms: readonly ProgramId[],
  minimizedPrograms: readonly ProgramId[],
  excludedId?: ProgramId,
): ProgramId | null {
  const minimized = new Set(minimizedPrograms);
  for (let index = openPrograms.length - 1; index >= 0; index -= 1) {
    const id = openPrograms[index];
    if (id !== excludedId && !minimized.has(id)) return id;
  }
  return null;
}

export function clampWindowGeometry(
  geometry: WindowGeometry,
  viewport: ViewportBounds = DEFAULT_VIEWPORT,
): WindowGeometry {
  const width = Math.min(
    Math.max(geometry.width, MIN_WINDOW_WIDTH),
    Math.max(viewport.width, MIN_WINDOW_WIDTH),
  );
  const height = Math.min(
    Math.max(geometry.height, MIN_WINDOW_HEIGHT),
    Math.max(viewport.height, MIN_WINDOW_HEIGHT),
  );
  const minX = Math.min(0, viewport.width - MIN_VISIBLE_TITLE_BAR);
  const maxX = Math.max(0, viewport.width - MIN_VISIBLE_TITLE_BAR);
  const minY = 0;
  const maxY = Math.max(0, viewport.height - MIN_VISIBLE_TITLE_BAR);

  return {
    x: Math.min(Math.max(geometry.x, minX), maxX),
    y: Math.min(Math.max(geometry.y, minY), maxY),
    width,
    height,
  };
}

export function workstationReducer(
  state: WorkstationState,
  action: WorkstationAction,
): WorkstationState {
  switch (action.type) {
    case "open": {
      const openPrograms = bringToFront(state.openPrograms, action.id);
      return {
        ...state,
        openPrograms,
        minimizedPrograms: state.minimizedPrograms.filter((id) => id !== action.id),
        focusedProgram: action.id,
        recentPrograms: appendRecent(state.recentPrograms, action.id),
      };
    }
    case "focus": {
      if (!state.openPrograms.includes(action.id)) return state;
      return {
        ...state,
        openPrograms: bringToFront(state.openPrograms, action.id),
        minimizedPrograms: state.minimizedPrograms.filter((id) => id !== action.id),
        focusedProgram: action.id,
        recentPrograms: appendRecent(state.recentPrograms, action.id),
      };
    }
    case "minimize": {
      if (!state.openPrograms.includes(action.id)) return state;
      const minimizedPrograms = uniquePrograms([...state.minimizedPrograms, action.id]);
      return {
        ...state,
        minimizedPrograms,
        focusedProgram:
          state.focusedProgram === action.id
            ? nextFocusedProgram(state.openPrograms, minimizedPrograms, action.id)
            : state.focusedProgram,
      };
    }
    case "restore": {
      if (!state.openPrograms.includes(action.id)) {
        return workstationReducer(state, { type: "open", id: action.id });
      }
      return {
        ...state,
        openPrograms: bringToFront(state.openPrograms, action.id),
        minimizedPrograms: state.minimizedPrograms.filter((id) => id !== action.id),
        focusedProgram: action.id,
        recentPrograms: appendRecent(state.recentPrograms, action.id),
      };
    }
    case "close": {
      if (!state.openPrograms.includes(action.id)) return state;
      const openPrograms = state.openPrograms.filter((id) => id !== action.id);
      if (openPrograms.length === 0 && (action.id === "welcome" || action.id === "selected-work")) {
        const fallback: ProgramId = action.id === "welcome" ? "selected-work" : "welcome";
        return {
          ...state,
          openPrograms: [fallback],
          minimizedPrograms: state.minimizedPrograms.filter((id) => id !== action.id && id !== fallback),
          focusedProgram: fallback,
        };
      }
      const minimizedPrograms = state.minimizedPrograms.filter((id) => id !== action.id);
      return {
        ...state,
        openPrograms,
        minimizedPrograms,
        focusedProgram:
          state.focusedProgram === action.id
            ? nextFocusedProgram(openPrograms, minimizedPrograms, action.id)
            : state.focusedProgram,
      };
    }
    case "move":
      return {
        ...state,
        windowGeometry: {
          ...state.windowGeometry,
          [action.id]: clampWindowGeometry(action.geometry, action.viewport),
        },
      };
    case "hydrate":
      return action.state.version === 1 ? action.state : createInitialWorkstationState();
    case "boot-complete":
      return { ...state, bootCompleted: true };
    case "display":
      return { ...state, displayPreferences: { ...action.preferences } };
    case "desktop-scroll":
      return { ...state, desktopScrollY: Math.max(0, action.y) };
    case "reset":
      return createInitialWorkstationState();
  }
}
