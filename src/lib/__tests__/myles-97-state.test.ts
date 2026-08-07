import { describe, expect, it } from "vitest";
import {
  clampWindowGeometry,
  createInitialWorkstationState,
  workstationReducer,
} from "@/lib/myles-97/state";

describe("workstationReducer", () => {
  it("opens Selected Work behind focused Welcome", () => {
    const state = createInitialWorkstationState();
    expect(state.openPrograms).toEqual(["selected-work", "welcome"]);
    expect(state.focusedProgram).toBe("welcome");
  });

  it("opens, focuses, minimizes, restores, moves, closes, and resets", () => {
    let state = createInitialWorkstationState();
    state = workstationReducer(state, { type: "open", id: "fresh-greens" });
    state = workstationReducer(state, {
      type: "move",
      id: "fresh-greens",
      geometry: { x: 120, y: 80, width: 720, height: 520 },
      viewport: { width: 1280, height: 800 },
    });
    expect(state.windowGeometry["fresh-greens"]).toEqual({ x: 120, y: 80, width: 720, height: 520 });

    state = workstationReducer(state, { type: "minimize", id: "fresh-greens" });
    expect(state.minimizedPrograms).toContain("fresh-greens");

    state = workstationReducer(state, { type: "restore", id: "fresh-greens" });
    expect(state.focusedProgram).toBe("fresh-greens");

    state = workstationReducer(state, { type: "close", id: "fresh-greens" });
    expect(state.openPrograms).not.toContain("fresh-greens");
    expect(workstationReducer(state, { type: "reset" })).toEqual(createInitialWorkstationState());
  });

  it("clamps a window so its title bar remains recoverable", () => {
    expect(
      clampWindowGeometry(
        { x: 5000, y: -200, width: 1800, height: 1200 },
        { width: 1024, height: 768 },
      ),
    ).toEqual({ x: 980, y: 0, width: 1024, height: 768 });
  });
});
