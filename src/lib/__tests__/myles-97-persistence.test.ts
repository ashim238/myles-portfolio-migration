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
      openPrograms: ["selected-work", "welcome", "about"],
      focusedProgram: "about",
      recentPrograms: ["welcome", "about"],
      windowGeometry: {
        "about": { x: 80, y: 64, width: 720, height: 520 },
      },
      reminderWidgetPosition: { x: 570, y: 100 },
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
      focusedProgram: "about",
      reminderWidgetPosition: { x: 570, y: 100 },
      desktopScrollY: 240,
    });

    const restored = loadPersistedWorkstation();
    expect(restored.focusedProgram).toBe("about");
    expect(restored.reminderWidgetPosition).toEqual({ x: 570, y: 100 });
    expect(restored.windowGeometry["about"]).toEqual({
      x: 80,
      y: 64,
      width: 720,
      height: 520,
    });
  });

  it("returns an older foreground project preview to its folder while preserving other open programs", () => {
    sessionStorage.setItem(SESSION_WORKSTATION_KEY, JSON.stringify({
      version: 1,
      openPrograms: ["paint", "tiktok"],
      minimizedPrograms: ["selected-work"],
      focusedProgram: "tiktok",
    }));
    expect(loadPersistedWorkstation()).toMatchObject({
      openPrograms: ["paint", "selected-work"],
      minimizedPrograms: [],
      focusedProgram: "selected-work",
    });
  });

  it("filters retired project windows and unknown program ids and restores focus to an open program", () => {
    sessionStorage.setItem(
      SESSION_WORKSTATION_KEY,
      JSON.stringify({
        version: 1,
        openPrograms: ["selected-work", "tiktok", "study-older-project", "bogus"],
        minimizedPrograms: ["bogus"],
        focusedProgram: "bogus",
      }),
    );

    const restored = loadPersistedWorkstation();
    expect(restored.openPrograms).toEqual(["selected-work"]);
    expect(restored.minimizedPrograms).toEqual([]);
    expect(restored.focusedProgram).toBe("selected-work");
  });

  it("keeps Now Playing ephemeral across page loads", () => {
    const state: WorkstationState = {
      ...createInitialWorkstationState(),
      openPrograms: ["selected-work", "welcome", "now-playing"],
      minimizedPrograms: ["now-playing"],
      focusedProgram: "now-playing",
      recentPrograms: ["welcome", "now-playing"],
      windowGeometry: {
        "now-playing": { x: 120, y: 48, width: 804, height: 640 },
      },
    };

    saveLocalWorkstation(state);
    saveSessionWorkstation(state);

    const savedLocal = JSON.parse(
      localStorage.getItem(LOCAL_WORKSTATION_KEY) ?? "{}",
    );
    const savedSession = JSON.parse(
      sessionStorage.getItem(SESSION_WORKSTATION_KEY) ?? "{}",
    );

    expect(savedLocal.recentPrograms).not.toContain("now-playing");
    expect(savedSession.openPrograms).not.toContain("now-playing");
    expect(savedSession.minimizedPrograms).not.toContain("now-playing");
    expect(savedSession.focusedProgram).toBe("welcome");
    expect(savedSession.windowGeometry).not.toHaveProperty("now-playing");

    sessionStorage.setItem(
      SESSION_WORKSTATION_KEY,
      JSON.stringify({
        version: 1,
        openPrograms: ["selected-work", "now-playing"],
        minimizedPrograms: [],
        focusedProgram: "now-playing",
        windowGeometry: {
          "now-playing": { x: 120, y: 48, width: 804, height: 640 },
        },
      }),
    );

    const restored = loadPersistedWorkstation();
    expect(restored.openPrograms).toEqual(["selected-work"]);
    expect(restored.focusedProgram).toBe("selected-work");
    expect(restored.windowGeometry).not.toHaveProperty("now-playing");
  });
});
