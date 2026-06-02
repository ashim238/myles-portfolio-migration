"use client";

import { createTimeline } from "animejs";
import { useLayoutEffect, useState } from "react";
import {
  HOME_BROWSER_INTRO_COMPLETE,
  HOME_BROWSER_INTRO_KEY,
  prefersReducedMotion,
} from "@/lib/home-intro";

type HomeBrowserIntroProps = {
  siteName: string;
  siteUrl?: string;
};

const ZOOM_START_MS = 360;
const ZOOM_DURATION_MS = 1600;
const ZOOM_END_MS = ZOOM_START_MS + ZOOM_DURATION_MS;
const CHROME_FADE_START_MS = ZOOM_START_MS + 720;
const CHROME_FADE_MS = 360;
const HANDOFF_MS = ZOOM_END_MS - 320;
const OVERLAY_FADE_START_MS = ZOOM_END_MS - 320;
const OVERLAY_FADE_MS = 420;

function getZoomScales(stage: HTMLElement) {
  const windowEl = stage.querySelector<HTMLElement>(".browser-intro-window");
  const narrow = window.innerWidth < 640;
  const start = narrow ? 0.44 : 0.38;

  if (!windowEl) {
    return { start, end: narrow ? 2.85 : 3.15 };
  }

  const prevTransform = stage.style.transform;
  stage.style.transform = "scale(1)";
  const { width, height } = windowEl.getBoundingClientRect();
  stage.style.transform = prevTransform;

  if (!width || !height) {
    return { start, end: narrow ? 2.85 : 3.15 };
  }

  const padX = narrow ? 0.94 : 0.9;
  const padY = narrow ? 0.9 : 0.86;
  const fit = Math.max(
    (window.innerWidth * padX) / width,
    (window.innerHeight * padY) / height,
  );
  const cap = narrow ? 3.35 : 3.75;
  const floor = narrow ? 2.5 : 2.75;

  return { start, end: Math.min(cap, Math.max(floor, fit)) };
}

function handoffToEntrance() {
  window.dispatchEvent(new CustomEvent(HOME_BROWSER_INTRO_COMPLETE));
}

function completeBrowserIntro() {
  sessionStorage.setItem(HOME_BROWSER_INTRO_KEY, "1");
  document.documentElement.classList.remove("browser-intro-lock");
}

export function HomeBrowserIntro({
  siteName,
  siteUrl = "mylesdesignsthings.com",
}: HomeBrowserIntroProps) {
  const [visible, setVisible] = useState(true);

  useLayoutEffect(() => {
    const seen = sessionStorage.getItem(HOME_BROWSER_INTRO_KEY) === "1";
    const reduced = prefersReducedMotion();

    if (seen || reduced) {
      setVisible(false);
      if (!seen && reduced) {
        sessionStorage.setItem(HOME_BROWSER_INTRO_KEY, "1");
      }
      window.dispatchEvent(new CustomEvent(HOME_BROWSER_INTRO_COMPLETE));
      return;
    }

    document.documentElement.classList.add("browser-intro-lock");

    const overlay = document.querySelector<HTMLElement>(".browser-intro-overlay");
    const stage = document.querySelector<HTMLElement>(".browser-intro-stage");
    const loader = document.querySelector<HTMLElement>(".browser-intro-loader-fill");
    const chrome = document.querySelector<HTMLElement>(".browser-intro-chrome");
    const status = document.querySelector<HTMLElement>(".browser-intro-status");
    const loaderTrack = document.querySelector<HTMLElement>(".browser-intro-loader");

    if (!overlay || !stage) {
      completeBrowserIntro();
      handoffToEntrance();
      setVisible(false);
      return;
    }

    const { start: startScale, end: endScale } = getZoomScales(stage);
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

    const chromeFadeTargets = [chrome, status, loaderTrack].filter(
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

    timeline.then(() => {
      completeBrowserIntro();
      setVisible(false);
    });

    return () => {
      timeline.pause();
      document.documentElement.classList.remove("browser-intro-lock");
    };
  }, []);

  if (!visible) {
    return null;
  }

  const firstName = siteName.split(" ")[0] ?? siteName;

  return (
    <div
      className="browser-intro-overlay"
      aria-hidden="true"
      data-nosnippet
    >
      <div className="browser-intro-stage">
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
                {firstName} builds useful digital experiences.
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
      <p className="browser-intro-status">Loading</p>
      <div className="browser-intro-loader" aria-hidden="true">
        <div className="browser-intro-loader-fill" />
      </div>
    </div>
  );
}
