import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  PROJECT_ENTER_REQUEST,
  PROJECT_RETURN_REQUEST,
  PROJECT_RETURN_STORAGE_KEY,
  dispatchProjectEnterRequest,
  dispatchProjectReturnRequest,
  readProjectReturnSnapshot,
  saveProjectReturnSnapshot,
  type ProjectReturnSnapshot,
} from "@/lib/project-enter";

const snapshot: ProjectReturnSnapshot = {
  version: 1,
  slug: "fresh-greens",
  rect: { top: 64, left: 180, width: 720, height: 520 },
  borderRadius: "0px",
  visual: {
    type: "program",
    programId: "fresh-greens",
    appName: "Fresh Greens.exe",
    title: "Fresh Greens",
    cover: { type: "image", src: "/projects/fresh-greens/cover.png" },
  },
};

describe("Myles 97 project return state", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("round-trips a valid structured snapshot", () => {
    saveProjectReturnSnapshot(snapshot);
    expect(readProjectReturnSnapshot()).toEqual(snapshot);
  });

  it("rejects corrupt, stale, unknown, and unusable snapshots", () => {
    for (const value of [
      "{",
      JSON.stringify({ ...snapshot, version: 2 }),
      JSON.stringify({ ...snapshot, slug: "unknown" }),
      JSON.stringify({ ...snapshot, returnTarget: "unknown" }),
      JSON.stringify({ ...snapshot, reduceMotion: "yes" }),
      JSON.stringify({ ...snapshot, animate: "yes" }),
      JSON.stringify({
        ...snapshot,
        rect: { top: 0, left: 0, width: 0, height: 520 },
      }),
    ]) {
      sessionStorage.setItem(PROJECT_RETURN_STORAGE_KEY, value);
      expect(readProjectReturnSnapshot()).toBeNull();
    }
  });

  it("uses controller acknowledgement without breaking native navigation fallback", () => {
    expect(dispatchProjectReturnRequest()).toBe(false);
    saveProjectReturnSnapshot(snapshot);
    expect(dispatchProjectReturnRequest()).toBe(false);

    const listener = vi.fn((event: Event) => event.preventDefault());
    window.addEventListener(PROJECT_RETURN_REQUEST, listener);
    expect(dispatchProjectReturnRequest()).toBe(true);
    expect(listener).toHaveBeenCalledTimes(1);
    window.removeEventListener(PROJECT_RETURN_REQUEST, listener);

    const enterDetail = {
      slug: "fresh-greens",
      href: "/work/fresh-greens",
      rect: snapshot.rect,
      borderRadius: snapshot.borderRadius,
      visual: snapshot.visual,
    };
    expect(dispatchProjectEnterRequest(enterDetail)).toBe(false);

    const enterListener = vi.fn((event: Event) => event.preventDefault());
    window.addEventListener(PROJECT_ENTER_REQUEST, enterListener);
    expect(dispatchProjectEnterRequest(enterDetail)).toBe(true);
    expect(enterListener).toHaveBeenCalledTimes(1);
    window.removeEventListener(PROJECT_ENTER_REQUEST, enterListener);
  });

  it("never writes image blobs or serialized DOM into the stored state", () => {
    saveProjectReturnSnapshot(snapshot);
    const raw = sessionStorage.getItem(PROJECT_RETURN_STORAGE_KEY) ?? "";
    expect(raw).not.toMatch(/data:image|outerHTML|innerHTML|canvas/i);
  });
});
