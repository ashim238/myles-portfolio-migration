"use client";

import { createTimeline } from "animejs";
import { useLayoutEffect, useSyncExternalStore } from "react";
import {
  HOME_BROWSER_INTRO_COMPLETE,
  HOME_BROWSER_INTRO_KEY,
  prefersReducedMotion,
} from "@/lib/home-intro";

type HomeBrowserIntroProps = {
  siteName: string;
  siteUrl?: string;
};

type IntroVariant = "desktop" | "mobile";

const MOBILE_MAX_WIDTH = 639;
const HOME_BROWSER_INTRO_VISIBILITY_CHANGE =
  "home-browser-intro-visibility-change";

const ZOOM_START_MS = 360;
const ZOOM_DURATION_MS = 1080;
const ZOOM_END_MS = ZOOM_START_MS + ZOOM_DURATION_MS;
const CHROME_FADE_START_MS = ZOOM_START_MS + 480;
const CHROME_FADE_MS = 280;
const HANDOFF_MS = ZOOM_END_MS - 300;
const OVERLAY_FADE_START_MS = ZOOM_END_MS - 280;
const OVERLAY_FADE_MS = 340;

function getIntroVariant(): IntroVariant {
  return window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`).matches
    ? "mobile"
    : "desktop";
}

function subscribeBrowserIntroVisibility(callback: () => void) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  reducedMotion.addEventListener("change", callback);
  window.addEventListener(HOME_BROWSER_INTRO_VISIBILITY_CHANGE, callback);
  return () => {
    reducedMotion.removeEventListener("change", callback);
    window.removeEventListener(HOME_BROWSER_INTRO_VISIBILITY_CHANGE, callback);
  };
}

function getBrowserIntroVisibilitySnapshot() {
  return (
    sessionStorage.getItem(HOME_BROWSER_INTRO_KEY) !== "1" &&
    !prefersReducedMotion()
  );
}

function getBrowserIntroVisibilityServerSnapshot() {
  return true;
}

function getZoomScales(stage: HTMLElement, variant: IntroVariant) {
  const targetSelector =
    variant === "mobile" ? ".browser-intro-mobile-phone" : ".browser-intro-window";
  const windowEl = stage.querySelector<HTMLElement>(targetSelector);
  const isMobile = variant === "mobile";
  const start = isMobile ? 0.58 : 0.38;

  if (!windowEl) {
    return { start, end: isMobile ? 3.45 : 3.15 };
  }

  const prevTransform = stage.style.transform;
  stage.style.transform = "scale(1)";
  const { width, height } = windowEl.getBoundingClientRect();
  stage.style.transform = prevTransform;

  if (!width || !height) {
    return { start, end: isMobile ? 3.45 : 3.15 };
  }

  const padX = isMobile ? 0.96 : 0.9;
  const padY = isMobile ? 0.92 : 0.86;
  const fit = Math.max(
    (window.innerWidth * padX) / width,
    (window.innerHeight * padY) / height,
  );
  const cap = isMobile ? 3.85 : 3.75;
  const floor = isMobile ? 2.85 : 2.75;

  return { start, end: Math.min(cap, Math.max(floor, fit)) };
}

function handoffToEntrance() {
  window.dispatchEvent(new CustomEvent(HOME_BROWSER_INTRO_COMPLETE));
}

function completeBrowserIntro() {
  sessionStorage.setItem(HOME_BROWSER_INTRO_KEY, "1");
  document.documentElement.classList.remove("browser-intro-lock");
  window.dispatchEvent(new Event(HOME_BROWSER_INTRO_VISIBILITY_CHANGE));
}

function runIntroAnimation(variant: IntroVariant) {
  const overlay = document.querySelector<HTMLElement>(".browser-intro-overlay");
  const stage = document.querySelector<HTMLElement>(
    variant === "mobile" ? ".browser-intro-mobile-stage" : ".browser-intro-desktop-stage",
  );
  const loader = document.querySelector<HTMLElement>(".browser-intro-loader-fill");
  const status = document.querySelector<HTMLElement>(".browser-intro-status");
  const loaderTrack = document.querySelector<HTMLElement>(".browser-intro-loader");
  const chrome =
    variant === "mobile"
      ? document.querySelectorAll<HTMLElement>(
          ".browser-intro-mobile-chrome, .browser-intro-mobile-home-indicator",
        )
      : document.querySelectorAll<HTMLElement>(".browser-intro-chrome");

  if (!overlay || !stage) {
    completeBrowserIntro();
    handoffToEntrance();
    return { cleanup: () => undefined, done: Promise.resolve() };
  }

  const { start: startScale, end: endScale } = getZoomScales(stage, variant);
  stage.style.transform = `scale(${startScale})`;

  const timeline = createTimeline({ defaults: { ease: "outCubic" } });

  if (loader) {
    timeline.add(
      loader,
      {
        scaleX: [0, 1],
        duration: ZOOM_DURATION_MS,
        ease: "out(3)",
      },
      ZOOM_START_MS - 40,
    );
  }

  timeline.add(
    stage,
    {
      scale: [startScale, endScale],
      duration: ZOOM_DURATION_MS,
      ease: "out(3)",
    },
    ZOOM_START_MS,
  );

  const chromeFadeTargets = [...chrome, status, loaderTrack].filter(
    (el): el is HTMLElement => Boolean(el),
  );

  if (chromeFadeTargets.length) {
    timeline.add(
      chromeFadeTargets,
      { opacity: [1, 0], duration: CHROME_FADE_MS, ease: "outCubic" },
      CHROME_FADE_START_MS,
    );
  }

  timeline.call(handoffToEntrance, HANDOFF_MS);

  timeline.add(
    overlay,
    {
      opacity: [1, 0],
      duration: OVERLAY_FADE_MS,
      ease: "outCubic",
    },
    OVERLAY_FADE_START_MS,
  );

  return {
    cleanup: () => timeline.pause(),
    done: timeline.then(() => {
      completeBrowserIntro();
    }),
  };
}

export function HomeBrowserIntro({
  siteName,
  siteUrl = "mylesdesignsthings.com",
}: HomeBrowserIntroProps) {
  const visible = useSyncExternalStore(
    subscribeBrowserIntroVisibility,
    getBrowserIntroVisibilitySnapshot,
    getBrowserIntroVisibilityServerSnapshot,
  );

  useLayoutEffect(() => {
    const seen = sessionStorage.getItem(HOME_BROWSER_INTRO_KEY) === "1";
    const reduced = prefersReducedMotion();

    if (!visible) {
      if (!seen && reduced) {
        sessionStorage.setItem(HOME_BROWSER_INTRO_KEY, "1");
      }
      window.dispatchEvent(new CustomEvent(HOME_BROWSER_INTRO_COMPLETE));
      return;
    }

    document.documentElement.classList.add("browser-intro-lock");

    const variant = getIntroVariant();
    const { cleanup } = runIntroAnimation(variant);

    return () => {
      cleanup();
      document.documentElement.classList.remove("browser-intro-lock");
    };
  }, [visible]);

  if (!visible) {
    return null;
  }

  return (
    <div className="browser-intro-overlay" aria-hidden="true" data-nosnippet>
      <div className="browser-intro-desktop">
        <div className="browser-intro-desktop-stage browser-intro-stage">
          <div className="browser-intro-window">
            <div className="browser-intro-chrome">
              <div className="browser-intro-traffic" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <p className="browser-intro-url">{siteUrl}</p>
            </div>
            <div className="browser-intro-viewport">
              <div className="browser-intro-preview">
                <div className="browser-intro-preview-header">
                  <span className="browser-intro-preview-kicker">Portfolio</span>
                  <span className="browser-intro-preview-nav">01 · 02 · 03</span>
                </div>
                <p className="browser-intro-preview-name">{siteName}</p>
                <p className="browser-intro-preview-line">
                  Focused on the balance between interaction design &amp; social
                  responsibility.
                </p>
                <div className="browser-intro-preview-blocks">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="browser-intro-mobile">
        <div className="browser-intro-mobile-stage browser-intro-stage">
          <div className="browser-intro-mobile-phone">
            <div className="browser-intro-mobile-chrome">
              <span className="browser-intro-mobile-island" aria-hidden="true" />
              <span className="browser-intro-mobile-time" aria-hidden="true">
                9:41
              </span>
              <span className="browser-intro-mobile-signal" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </div>
            <div className="browser-intro-mobile-screen">
              <div className="browser-intro-mobile-preview">
                <p className="browser-intro-mobile-url">{siteUrl}</p>
                <p className="browser-intro-mobile-name">{siteName}</p>
                <p className="browser-intro-mobile-line">
                  Focused on the balance between interaction design &amp; social
                  responsibility.
                </p>
                <div className="browser-intro-mobile-blocks">
                  <span />
                  <span />
                </div>
              </div>
            </div>
            <div className="browser-intro-mobile-home-indicator" aria-hidden="true" />
          </div>
        </div>
      </div>

      <p className="browser-intro-status">Loading</p>
      <div className="browser-intro-loader" aria-hidden="true">
        <div className="browser-intro-loader-fill" />
      </div>
    </div>
  );
}
