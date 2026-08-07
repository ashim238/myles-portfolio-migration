import { beforeEach, describe, expect, it } from "vitest";
import {
  LOCAL_WORKSTATION_KEY,
  SESSION_WORKSTATION_KEY,
  loadPersistedWorkstation,
  saveLocalWorkstation,
  saveSessionWorkstation,
} from "@/lib/myles-97/persistence";
import {
  createInitialWorkstationState,
  type WorkstationState,
} from "@/lib/myles-97/state";

describe("Myles 97 persistence", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it("falls back without throwing when persisted JSON is corrupt", () => {
    localStorage.setItem(LOCAL_WORKSTATION_KEY, "{");
    expect(loadPersistedWorkstation()).toEqual(createInitialWorkstationState());
  });

  it("ignores stale versions", () => {
    localStorage.setItem(
      LOCAL_WORKSTATION_KEY,
      JSON.stringify({ version: 99, bootCompleted: true }),
    );
    expect(loadPersistedWorkstation().bootCompleted).toBe(false);
  });

  it("does not replace the canonical theme key", () => {
    localStorage.setItem("theme", "light");
    saveLocalWorkstation(createInitialWorkstationState());
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("splits durable preferences from session window state", () => {
    const state: WorkstationState = {
      ...createInitialWorkstationState(),
      bootCompleted: true,
      openPrograms: ["selected-work", "welcome", "fresh-greens"],
      focusedProgram: "fresh-greens",
      recentPrograms: ["welcome", "fresh-greens"],
      windowGeometry: {
        "fresh-greens": { x: 80, y: 64, width: 720, height: 520 },
      },
      desktopScrollY: 240,
      displayPreferences: { highContrast: true, reduceMotion: false },
    };

    saveLocalWorkstation(state);
    saveSessionWorkstation(state);

    expect(JSON.parse(localStorage.getItem(LOCAL_WORKSTATION_KEY) ?? "{}")).toMatchObject({
      version: 1,
      bootCompleted: true,
      displayPreferences: { highContrast: true, reduceMotion: false },
    });
    expect(JSON.parse(sessionStorage.getItem(SESSION_WORKSTATION_KEY) ?? "{}")).toMatchObject({
      focusedProgram: "fresh-greens",
      desktopScrollY: 240,
    });

    const restored = loadPersistedWorkstation();
    expect(restored.focusedProgram).toBe("fresh-greens");
    expect(restored.windowGeometry["fresh-greens"]).toEqual({
      x: 80,
      y: 64,
      width: 720,
      height: 520,
    });
  });

  it("filters unknown program ids and restores focus to an open program", () => {
    sessionStorage.setItem(
      SESSION_WORKSTATION_KEY,
      JSON.stringify({
        version: 1,
        openPrograms: ["selected-work", "bogus"],
        minimizedPrograms: ["bogus"],
        focusedProgram: "bogus",
      }),
    );

    const restored = loadPersistedWorkstation();
    expect(restored.openPrograms).toEqual(["selected-work"]);
    expect(restored.minimizedPrograms).toEqual([]);
    expect(restored.focusedProgram).toBe("selected-work");
  });
});
