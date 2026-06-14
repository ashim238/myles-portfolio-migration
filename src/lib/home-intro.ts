export const HOME_BROWSER_INTRO_KEY = "home-browser-intro-seen";
export const HOME_ENTRANCE_KEY = "home-intro-seen";

export const HOME_BROWSER_INTRO_COMPLETE = "home-browser-intro-complete";
export const HOME_ENTRANCE_COMPLETE = "home-entrance-complete";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function shouldHideHomeBeforeIntro(): boolean {
  if (prefersReducedMotion()) return false;
  try {
    const browserDone = sessionStorage.getItem(HOME_BROWSER_INTRO_KEY) === "1";
    const entranceDone = sessionStorage.getItem(HOME_ENTRANCE_KEY) === "1";
    return !browserDone || !entranceDone;
  } catch {
    return false;
  }
}

export function applyHomeIntroWaitClass(): void {
  if (typeof document === "undefined") return;
  if (shouldHideHomeBeforeIntro()) {
    document.documentElement.classList.add("home-intro-wait");
  }
}
