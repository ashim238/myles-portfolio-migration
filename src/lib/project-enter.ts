import {
  isProgramId,
  type ProjectProgramId,
} from "@/lib/myles-97/programs";

export const PROJECT_ENTER_REQUEST = "project-enter-request";
export const PROJECT_RETURN_REQUEST = "project-return-request";
export const PROJECT_ENTER_COMPLETE = "project-enter-complete";
export const PROJECT_RETURN_STORAGE_KEY = "myles97.project-return.v1";

export type ProjectEnterRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type ProjectCoverVisual =
  | { type: "image"; src: string }
  | { type: "tiktok" };

export type ProjectProgramVisual = {
  type: "program";
  programId: ProjectProgramId;
  appName: string;
  title: string;
  cover: ProjectCoverVisual;
};

export type ProjectEnterVisual = ProjectCoverVisual | ProjectProgramVisual;

export type ProjectEnterRequestDetail = {
  slug: string;
  href: string;
  rect: ProjectEnterRect;
  visual: ProjectEnterVisual;
  borderRadius: string;
};

export type ProjectReturnSnapshot = {
  version: 1;
  slug: ProjectProgramId;
  rect: ProjectEnterRect;
  borderRadius: string;
  visual: ProjectProgramVisual;
};

export type ProjectReturnRequestDetail = {
  href: "/";
  snapshot: ProjectReturnSnapshot;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isProjectProgramId(value: unknown): value is ProjectProgramId {
  return (
    isProgramId(value) &&
    (value === "fresh-greens" ||
      value === "understandingfafsa" ||
      value === "navi" ||
      value === "tiktok")
  );
}

function isRect(value: unknown): value is ProjectEnterRect {
  if (!isRecord(value)) return false;
  return (
    isFiniteNumber(value.top) &&
    isFiniteNumber(value.left) &&
    isFiniteNumber(value.width) &&
    isFiniteNumber(value.height) &&
    value.width > 0 &&
    value.height > 0
  );
}

function isCoverVisual(value: unknown): value is ProjectCoverVisual {
  if (!isRecord(value)) return false;
  if (value.type === "tiktok") return true;
  return value.type === "image" && typeof value.src === "string" && value.src.length > 0;
}

function isProgramVisual(value: unknown): value is ProjectProgramVisual {
  if (!isRecord(value)) return false;
  return (
    value.type === "program" &&
    isProjectProgramId(value.programId) &&
    typeof value.appName === "string" &&
    value.appName.length > 0 &&
    typeof value.title === "string" &&
    value.title.length > 0 &&
    isCoverVisual(value.cover)
  );
}

function isReturnSnapshot(value: unknown): value is ProjectReturnSnapshot {
  if (!isRecord(value)) return false;
  return (
    value.version === 1 &&
    isProjectProgramId(value.slug) &&
    isRect(value.rect) &&
    typeof value.borderRadius === "string" &&
    isProgramVisual(value.visual) &&
    value.visual.programId === value.slug
  );
}

export function dispatchProjectEnterRequest(detail: ProjectEnterRequestDetail): void {
  window.dispatchEvent(
    new CustomEvent<ProjectEnterRequestDetail>(PROJECT_ENTER_REQUEST, { detail }),
  );
}

export function saveProjectReturnSnapshot(snapshot: ProjectReturnSnapshot): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(
      PROJECT_RETURN_STORAGE_KEY,
      JSON.stringify(snapshot),
    );
  } catch {
    // Reverse animation is optional; native navigation remains available.
  }
}

export function readProjectReturnSnapshot(): ProjectReturnSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(PROJECT_RETURN_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isReturnSnapshot(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function dispatchProjectReturnRequest(
  snapshot = readProjectReturnSnapshot(),
): boolean {
  if (!snapshot) return false;
  window.dispatchEvent(
    new CustomEvent<ProjectReturnRequestDetail>(PROJECT_RETURN_REQUEST, {
      detail: { href: "/", snapshot },
    }),
  );
  return true;
}

export const PROJECT_ENTER_SETTLE_MS = 560;

export function queryProjectCover(slug: string): HTMLElement | null {
  const page = document.querySelector<HTMLElement>(
    `.project-page[data-project-slug="${slug}"]`,
  );
  if (!page) return null;

  return (
    page.querySelector<HTMLElement>(".project-cover-image") ??
    page.querySelector<HTMLElement>("[data-project-enter-cover]")
  );
}

export function queryProjectProgram(slug: ProjectProgramId): HTMLElement | null {
  return document.querySelector<HTMLElement>(
    `[data-m97-program-window="${slug}"]`,
  );
}

function waitForElement(
  query: () => HTMLElement | null,
  attempts: number,
): Promise<HTMLElement | null> {
  return new Promise((resolve) => {
    let remaining = attempts;

    const tick = () => {
      const element = query();
      if (element) {
        resolve(element);
        return;
      }

      remaining -= 1;
      if (remaining <= 0) {
        resolve(null);
        return;
      }

      requestAnimationFrame(tick);
    };

    tick();
  });
}

export function waitForProjectCover(
  slug: string,
  attempts = 48,
): Promise<HTMLElement | null> {
  return waitForElement(() => queryProjectCover(slug), attempts);
}

export function waitForProjectProgram(
  slug: ProjectProgramId,
  attempts = 48,
): Promise<HTMLElement | null> {
  return waitForElement(() => queryProjectProgram(slug), attempts);
}
