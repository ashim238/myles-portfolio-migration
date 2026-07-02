"use client";

import { createTimeline, stagger } from "animejs";
import { useLayoutEffect } from "react";
import {
  HOME_BROWSER_INTRO_COMPLETE,
  HOME_BROWSER_INTRO_KEY,
  HOME_ENTRANCE_COMPLETE,
  HOME_ENTRANCE_KEY,
  prefersReducedMotion,
} from "@/lib/home-intro";

function finishEntrance(main: HTMLElement, skipAnimation: boolean) {
  document.documentElement.classList.remove("home-intro-wait");
  main.classList.remove("home-entrance-active");
  main.classList.add("home-entrance-done");
  if (skipAnimation) {
    main.classList.add("home-entrance-skipped");
    window.dispatchEvent(new CustomEvent(HOME_ENTRANCE_COMPLETE));
  } else {
    sessionStorage.setItem(HOME_ENTRANCE_KEY, "1");
  }
}

function runEntranceTimeline(main: HTMLElement, settle: (skipAnimation: boolean) => void) {
  main.classList.add("home-entrance-active");

  const kicker = main.querySelector(".site-kicker");
  const navItems = main.querySelectorAll(".site-nav-list li");
  const heroName = main.querySelector(".hero-name");
  const heroTyper = main.querySelector(".hero-typer");
  const heroTagline = main.querySelector(".hero-tagline");
  const heroCredentials = main.querySelector(".hero-credentials");
  const workHeading = main.querySelector("#work > h2");
  const workLede = main.querySelector("#work > .work-lede");
  const workItems = main.querySelectorAll("#work > .work-list > .work-item");

  const fadeIn = {
    opacity: [0, 1],
    ease: "outCubic",
  };

  const timeline = createTimeline({
    defaults: { ease: "outCubic" },
  });

  if (kicker) {
    timeline.add(kicker, { ...fadeIn, y: [8, 0], duration: 340 }, 0);
  }

  if (navItems.length) {
    timeline.add(
      navItems,
      { ...fadeIn, x: [12, 0], duration: 320, delay: stagger(44) },
      100,
    );
  }

  if (heroName) {
    timeline.add(heroName, { ...fadeIn, y: [10, 0], duration: 460 }, 240);
  }

  if (heroTyper) {
    timeline.add(heroTyper, { ...fadeIn, y: [8, 0], duration: 340 }, 420);
  }

  timeline.call(() => {
    window.dispatchEvent(new CustomEvent(HOME_ENTRANCE_COMPLETE));
  }, 500);

  if (heroTagline) {
    timeline.add(heroTagline, { ...fadeIn, y: [6, 0], duration: 320 }, 600);
  }

  if (heroCredentials) {
    timeline.add(heroCredentials, { ...fadeIn, y: [4, 0], duration: 280 }, 720);
  }

  if (workHeading) {
    timeline.add(workHeading, { ...fadeIn, y: [8, 0], duration: 320 }, 800);
  }

  if (workLede) {
    timeline.add(workLede, { ...fadeIn, y: [6, 0], duration: 320 }, 840);
  }

  if (workItems.length) {
    timeline.add(
      workItems,
      { ...fadeIn, y: [10, 0], duration: 380, delay: stagger(58) },
      900,
    );
  }

  timeline.then(() => {
    settle(false);
  });
}

export function HomeEntrance() {
  useLayoutEffect(() => {
    const main = document.querySelector<HTMLElement>(".home-page");
    if (!main) return;

    let completed = false;
    const settle = (skipAnimation: boolean) => {
      if (completed) return;
      completed = true;
      finishEntrance(main, skipAnimation);
    };

    const entranceSeen = sessionStorage.getItem(HOME_ENTRANCE_KEY) === "1";
    const reduced = prefersReducedMotion();

    if (entranceSeen || reduced) {
      settle(true);
      return;
    }

    const startEntrance = () => {
      document.documentElement.classList.remove("home-intro-wait");
      runEntranceTimeline(main, settle);
    };

    const browserSeen = sessionStorage.getItem(HOME_BROWSER_INTRO_KEY) === "1";

    if (browserSeen) {
      startEntrance();
    } else {
      window.addEventListener(HOME_BROWSER_INTRO_COMPLETE, startEntrance, { once: true });
    }

    // Failsafe: if the choreography stalls (slow bundle, anime.js failure, a
    // dropped browser-intro event), force the final visible state so the hero
    // is never left hidden by the entrance classes.
    const failsafe = window.setTimeout(() => settle(true), 3500);

    return () => {
      window.removeEventListener(HOME_BROWSER_INTRO_COMPLETE, startEntrance);
      window.clearTimeout(failsafe);
    };
  }, []);

  return null;
}
