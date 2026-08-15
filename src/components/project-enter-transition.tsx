"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Myles97Icon } from "@/components/myles-97/icons";
import { TikTokCoverBlobs } from "@/components/tiktok-dsa";
import { prefersReducedMotion } from "@/lib/home-intro";
import {
  PROJECT_ENTER_COMPLETE,
  PROJECT_ENTER_REQUEST,
  PROJECT_ENTER_SETTLE_MS,
  PROJECT_RETURN_REQUEST,
  queryProjectCover,
  queryProjectReturnTarget,
  readProjectReturnSnapshot,
  waitForProjectCover,
  waitForProjectReturnTarget,
  type ProjectCoverVisual,
  type ProjectEnterRequestDetail,
  type ProjectEnterRect,
  type ProjectEnterVisual,
  type ProjectReturnRequestDetail,
  type ProjectReturnSnapshot,
} from "@/lib/project-enter";

const EASE_OUT_CUBIC = "cubic-bezier(0.33, 1, 0.68, 1)";
const FLIP_ASPECT_TOLERANCE = 0.005;
const FLIP_IDENTITY = "translate3d(0px, 0px, 0) scale(1)";
const TRANSITION_FAILSAFE_MS = 4500;

type OverlayPhase = "holding" | "navigating" | "settling";
type OverlayDirection = "enter" | "return";

type RouteFocusIntent =
  | { kind: "destination"; pathname: string }
  | { kind: "return"; pathname: "/"; snapshot: ProjectReturnSnapshot };

type OverlayState = {
  id: number;
  direction: OverlayDirection;
  phase: OverlayPhase;
  slug: string;
  href: string;
  visual: ProjectEnterVisual;
  borderRadius: string;
  startRect: ProjectEnterRect;
  snapshot?: ProjectReturnSnapshot;
  crossfade: boolean;
};

function lockProjectEnter() {
  document.documentElement.classList.add("project-enter-lock");
}

function unlockProjectEnter() {
  document.documentElement.classList.remove("project-enter-lock");
  document.documentElement.classList.remove("project-enter-settling");
  window.dispatchEvent(new CustomEvent(PROJECT_ENTER_COMPLETE));
}

function validRect(rect: DOMRect): boolean {
  return (
    Number.isFinite(rect.top) &&
    Number.isFinite(rect.left) &&
    Number.isFinite(rect.width) &&
    Number.isFinite(rect.height) &&
    rect.width > 0 &&
    rect.height > 0
  );
}

function toRect(rect: DOMRect): ProjectEnterRect {
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };
}

function formatScale(value: number): string {
  return Number(value.toFixed(6)).toString();
}

function uniformFlipScale(
  start: ProjectEnterRect,
  target: ProjectEnterRect,
): number | null {
  const scaleX = start.width / target.width;
  const scaleY = start.height / target.height;
  const largestScale = Math.max(Math.abs(scaleX), Math.abs(scaleY));

  if (
    !Number.isFinite(scaleX) ||
    !Number.isFinite(scaleY) ||
    largestScale === 0 ||
    Math.abs(scaleX - scaleY) / largestScale > FLIP_ASPECT_TOLERANCE
  ) {
    return null;
  }

  // Matching width exactly keeps the horizontal edges anchored. The aspect
  // tolerance only admits minor layout rounding on the vertical edge.
  return scaleX;
}

function inverseFlipTransform(
  start: ProjectEnterRect,
  target: ProjectEnterRect,
  scale: number,
): string {
  const translateX = start.left - target.left;
  const translateY = start.top - target.top;

  return `translate3d(${translateX}px, ${translateY}px, 0) scale(${formatScale(scale)})`;
}

function counterScaledPixelRadius(radius: string, scale: number): string {
  const match = radius.trim().match(/^(-?(?:\d+|\d*\.\d+))px$/);
  if (!match) return radius;

  const value = Number(match[1]);
  if (!Number.isFinite(value)) return radius;

  return `${formatScale(value / scale)}px`;
}

function commitFrameDestination(
  frame: HTMLDivElement,
  target: ProjectEnterRect,
  borderRadius: string,
) {
  frame.style.top = `${target.top}px`;
  frame.style.left = `${target.left}px`;
  frame.style.width = `${target.width}px`;
  frame.style.height = `${target.height}px`;
  frame.style.borderRadius = borderRadius;
}

function caseStudyPath(slug: string): string {
  return `/work/${slug}`;
}

function routeMain(): HTMLElement | null {
  return (
    document.querySelector<HTMLElement>("main#main-content") ??
    document.querySelector<HTMLElement>("main")
  );
}

function routeTitle(main: HTMLElement | null): string {
  const heading = main?.querySelector<HTMLElement>("h1");
  const headingText = heading?.textContent?.replace(/\s+/g, " ").trim();
  if (headingText) return headingText;

  return document.title.replace(/\s*\|.*$/, "").trim();
}

function focusElement(
  element: HTMLElement | null,
  ensureVisible = false,
): void {
  if (!element) return;
  if (element.tabIndex < 0 && !element.hasAttribute("tabindex")) {
    element.setAttribute("tabindex", "-1");
  }
  if (ensureVisible) {
    element.scrollIntoView?.({ block: "nearest", inline: "nearest" });
  }
  element.focus({ preventScroll: true });
}

function focusSettledRoute(
  intent: RouteFocusIntent | null,
  resolvedReturnTarget: HTMLElement | null = null,
): string {
  const main = routeMain();

  if (intent?.kind === "return") {
    const returnTarget =
      resolvedReturnTarget ?? queryProjectReturnTarget(intent.snapshot);
    const linkSelector = `a[href="${caseStudyPath(intent.snapshot.slug)}"]`;
    const trigger = returnTarget?.querySelector<HTMLElement>(linkSelector);
    focusElement(trigger ?? returnTarget ?? main, true);
  } else {
    focusElement(main);
  }

  return routeTitle(main);
}

function CoverVisual({ visual }: { visual: ProjectCoverVisual }) {
  if (visual.type === "tiktok") {
    return (
      <div className="project-enter-tiktok work-thumb--tiktok-logo tt-cover--preview">
        <TikTokCoverBlobs deferUntilVisible={false} />
      </div>
    );
  }

  return (
    <Image
      className="project-enter-image"
      src={visual.src}
      alt=""
      width={1400}
      height={900}
      priority
      draggable={false}
    />
  );
}

function TransitionVisual({ visual }: { visual: ProjectEnterVisual }) {
  if (visual.type !== "program") {
    return <CoverVisual visual={visual} />;
  }

  return (
    <div className="project-enter-program">
      <div className="project-enter-program-titlebar">
        <Myles97Icon name="app" size={16} aria-hidden="true" />
        <strong className="project-enter-program-title">{visual.appName}</strong>
        <span className="project-enter-program-control" aria-hidden="true">
          ×
        </span>
      </div>
      <div className="project-enter-program-cover">
        <CoverVisual visual={visual.cover} />
      </div>
    </div>
  );
}

type ProjectEnterTransitionProps = {
  children: React.ReactNode;
};

export function ProjectEnterTransition({ children }: ProjectEnterTransitionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [overlay, setOverlay] = useState<OverlayState | null>(null);
  const [routeAnnouncement, setRouteAnnouncement] = useState("");
  const shellRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const settleRanRef = useRef(false);
  const failsafeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const routeIntentFailsafeRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const settleTimeoutRef = useRef<number | null>(null);
  const animationsRef = useRef<Animation[]>([]);
  const transitionSequenceRef = useRef(0);
  const activeTransitionIdRef = useRef<number | null>(null);
  const navigationStartedIdRef = useRef<number | null>(null);
  const previousPathnameRef = useRef(pathname);
  const pendingRoutePathnameRef = useRef<string | null>(null);
  const routeFocusIntentRef = useRef<RouteFocusIntent | null>(null);
  const currentPathnameRef = useRef(pathname);

  useEffect(() => {
    currentPathnameRef.current = pathname;
  }, [pathname]);

  const clearRouteFocusIntent = useCallback(
    (expectedIntent?: RouteFocusIntent) => {
      if (
        expectedIntent &&
        routeFocusIntentRef.current !== expectedIntent
      ) {
        return;
      }
      if (routeIntentFailsafeRef.current) {
        clearTimeout(routeIntentFailsafeRef.current);
        routeIntentFailsafeRef.current = null;
      }
      routeFocusIntentRef.current = null;
      pendingRoutePathnameRef.current = null;
    },
    [],
  );

  const setRouteFocusIntent = useCallback((intent: RouteFocusIntent) => {
    if (routeIntentFailsafeRef.current) {
      clearTimeout(routeIntentFailsafeRef.current);
    }
    routeFocusIntentRef.current = intent;
    routeIntentFailsafeRef.current = setTimeout(() => {
      routeIntentFailsafeRef.current = null;
      if (
        routeFocusIntentRef.current === intent &&
        currentPathnameRef.current !== intent.pathname
      ) {
        routeFocusIntentRef.current = null;
        pendingRoutePathnameRef.current = null;
      }
    }, TRANSITION_FAILSAFE_MS);
  }, []);

  const cancelActiveMotion = useCallback(() => {
    if (failsafeRef.current) {
      clearTimeout(failsafeRef.current);
      failsafeRef.current = null;
    }
    if (settleTimeoutRef.current) {
      clearTimeout(settleTimeoutRef.current);
      settleTimeoutRef.current = null;
    }
    for (const animation of animationsRef.current) animation.cancel();
    animationsRef.current = [];
    settleRanRef.current = false;
  }, []);

  const finishTransition = useCallback((transitionId: number | null) => {
    if (
      transitionId === null ||
      activeTransitionIdRef.current !== transitionId
    ) {
      return;
    }

    activeTransitionIdRef.current = null;
    navigationStartedIdRef.current = null;
    cancelActiveMotion();
    unlockProjectEnter();
    setOverlay(null);
  }, [cancelActiveMotion]);

  const runCrossfade = useCallback(
    async (state: OverlayState) => {
      const shell = shellRef.current;
      const backdrop = backdropRef.current;
      if (!shell || !backdrop) {
        finishTransition(state.id);
        return;
      }

      const backdropAnim = backdrop.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 220,
        easing: EASE_OUT_CUBIC,
        fill: "forwards",
      });
      const shellAnim = shell.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 240,
        easing: EASE_OUT_CUBIC,
        fill: "forwards",
      });
      animationsRef.current = [backdropAnim, shellAnim];

      await Promise.race([
        Promise.all([backdropAnim.finished, shellAnim.finished]).catch(
          () => undefined,
        ),
        new Promise((resolve) => {
          settleTimeoutRef.current = window.setTimeout(resolve, 360);
        }),
      ]);
      finishTransition(state.id);
    },
    [finishTransition],
  );

  const runEnterSettle = useCallback(
    async (state: OverlayState) => {
      const cover = await waitForProjectCover(state.slug);
      if (activeTransitionIdRef.current !== state.id) return;

      const shell = shellRef.current;
      const backdrop = backdropRef.current;
      const frame = frameRef.current;
      if (!shell || !backdrop || !frame) {
        finishTransition(state.id);
        return;
      }

      if (!cover) {
        await runCrossfade(state);
        return;
      }

      const targetBounds = cover.getBoundingClientRect();
      if (!validRect(targetBounds)) {
        await runCrossfade(state);
        return;
      }

      const targetRect = toRect(targetBounds);
      const scale = uniformFlipScale(state.startRect, targetRect);
      if (scale === null) {
        await runCrossfade(state);
        return;
      }

      const targetRadius = getComputedStyle(cover).borderRadius || "0.65rem";
      commitFrameDestination(frame, targetRect, targetRadius);
      const frameAnim = frame.animate(
        [
          {
            transform: inverseFlipTransform(state.startRect, targetRect, scale),
            borderRadius: counterScaledPixelRadius(state.borderRadius, scale),
          },
          {
            transform: FLIP_IDENTITY,
            borderRadius: targetRadius,
          },
        ],
        {
          duration: PROJECT_ENTER_SETTLE_MS,
          easing: EASE_OUT_CUBIC,
          fill: "forwards",
        },
      );
      const backdropAnim = backdrop.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 280,
        easing: EASE_OUT_CUBIC,
        fill: "forwards",
      });

      const frameFadeMs = 220;
      const frameFadeDelay = PROJECT_ENTER_SETTLE_MS - 140;
      const shellAnim = shell.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: frameFadeMs,
        delay: frameFadeDelay,
        easing: EASE_OUT_CUBIC,
        fill: "forwards",
      });
      const page = cover.closest<HTMLElement>(".project-page");
      const pageAnim = page?.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 380,
        delay: 60,
        easing: EASE_OUT_CUBIC,
        fill: "forwards",
      });
      animationsRef.current = [
        frameAnim,
        backdropAnim,
        shellAnim,
        ...(pageAnim ? [pageAnim] : []),
      ];

      const settleTimeout = frameFadeDelay + frameFadeMs + 120;
      await Promise.race([
        Promise.all([
          frameAnim.finished,
          backdropAnim.finished,
          shellAnim.finished,
          ...(pageAnim ? [pageAnim.finished] : []),
        ]).catch(() => undefined),
        new Promise((resolve) => {
          settleTimeoutRef.current = window.setTimeout(resolve, settleTimeout);
        }),
      ]);
      finishTransition(state.id);
    },
    [finishTransition, runCrossfade],
  );

  const runReturnSettle = useCallback(
    async (state: OverlayState) => {
      if (!state.snapshot || state.crossfade) {
        await runCrossfade(state);
        return;
      }

      const target = await waitForProjectReturnTarget(state.snapshot);
      if (activeTransitionIdRef.current !== state.id) return;

      const shell = shellRef.current;
      const backdrop = backdropRef.current;
      const frame = frameRef.current;
      if (!target || !shell || !backdrop || !frame) {
        await runCrossfade(state);
        return;
      }

      const targetBounds = target.getBoundingClientRect();
      if (!validRect(targetBounds)) {
        await runCrossfade(state);
        return;
      }

      const targetRect = toRect(targetBounds);
      const scale = uniformFlipScale(state.startRect, targetRect);
      if (scale === null) {
        await runCrossfade(state);
        return;
      }

      const targetRadius =
        getComputedStyle(target).borderRadius || state.snapshot.borderRadius;
      commitFrameDestination(frame, targetRect, targetRadius);
      const frameAnim = frame.animate(
        [
          {
            transform: inverseFlipTransform(state.startRect, targetRect, scale),
            borderRadius: counterScaledPixelRadius(state.borderRadius, scale),
          },
          {
            transform: FLIP_IDENTITY,
            borderRadius: targetRadius,
          },
        ],
        {
          duration: PROJECT_ENTER_SETTLE_MS,
          easing: EASE_OUT_CUBIC,
          fill: "forwards",
        },
      );
      const backdropAnim = backdrop.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 300,
        easing: EASE_OUT_CUBIC,
        fill: "forwards",
      });
      const shellAnim = shell.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 220,
        delay: PROJECT_ENTER_SETTLE_MS - 120,
        easing: EASE_OUT_CUBIC,
        fill: "forwards",
      });
      animationsRef.current = [frameAnim, backdropAnim, shellAnim];

      await Promise.race([
        Promise.all([
          frameAnim.finished,
          backdropAnim.finished,
          shellAnim.finished,
        ]).catch(() => undefined),
        new Promise((resolve) => {
          settleTimeoutRef.current = window.setTimeout(
            resolve,
            PROJECT_ENTER_SETTLE_MS + 220,
          );
        }),
      ]);
      finishTransition(state.id);
    },
    [finishTransition, runCrossfade],
  );

  const armFailsafe = useCallback(
    (transitionId: number) => {
      if (failsafeRef.current) clearTimeout(failsafeRef.current);
      failsafeRef.current = setTimeout(() => {
        finishTransition(transitionId);
      }, TRANSITION_FAILSAFE_MS);
    },
    [finishTransition],
  );

  const startEnterTransition = useCallback(
    (detail: ProjectEnterRequestDetail) => {
      if (
        detail.animate === false ||
        detail.reduceMotion ||
        prefersReducedMotion()
      ) {
        setRouteFocusIntent({
          kind: "destination",
          pathname: detail.href,
        });
        setRouteAnnouncement("");
        router.push(detail.href);
        return;
      }

      cancelActiveMotion();
      const transitionId = ++transitionSequenceRef.current;
      activeTransitionIdRef.current = transitionId;
      navigationStartedIdRef.current = null;
      setRouteFocusIntent({
        kind: "destination",
        pathname: detail.href,
      });
      setRouteAnnouncement("");
      lockProjectEnter();
      document.documentElement.classList.add("project-enter-settling");
      armFailsafe(transitionId);

      setOverlay({
        id: transitionId,
        direction: "enter",
        phase: "holding",
        slug: detail.slug,
        href: detail.href,
        visual: detail.visual,
        borderRadius: detail.borderRadius,
        startRect: detail.rect,
        crossfade: false,
      });
    },
    [armFailsafe, cancelActiveMotion, router, setRouteFocusIntent],
  );

  const startReturnTransition = useCallback(
    (detail: ProjectReturnRequestDetail, navigationAlreadyStarted = false) => {
      if (
        detail.snapshot.animate === false ||
        detail.snapshot.reduceMotion ||
        prefersReducedMotion()
      ) {
        setRouteFocusIntent({
          kind: "return",
          pathname: "/",
          snapshot: detail.snapshot,
        });
        setRouteAnnouncement("");
        if (!navigationAlreadyStarted) router.push(detail.href);
        return;
      }

      cancelActiveMotion();
      const source = queryProjectCover(detail.snapshot.slug);
      const sourceBounds = source?.getBoundingClientRect();
      const hasSource = Boolean(sourceBounds && validRect(sourceBounds));
      const startRect =
        sourceBounds && hasSource ? toRect(sourceBounds) : detail.snapshot.rect;
      const borderRadius =
        source && hasSource
          ? getComputedStyle(source).borderRadius || "0px"
          : detail.snapshot.borderRadius;
      const transitionId = ++transitionSequenceRef.current;
      activeTransitionIdRef.current = transitionId;
      navigationStartedIdRef.current = navigationAlreadyStarted
        ? transitionId
        : null;
      setRouteFocusIntent({
        kind: "return",
        pathname: "/",
        snapshot: detail.snapshot,
      });
      setRouteAnnouncement("");
      lockProjectEnter();
      document.documentElement.classList.add("project-enter-settling");
      armFailsafe(transitionId);

      setOverlay({
        id: transitionId,
        direction: "return",
        phase: navigationAlreadyStarted ? "navigating" : "holding",
        slug: detail.snapshot.slug,
        href: detail.href,
        visual: detail.snapshot.visual,
        borderRadius,
        startRect,
        snapshot: detail.snapshot,
        crossfade: !hasSource,
      });
    },
    [armFailsafe, cancelActiveMotion, router, setRouteFocusIntent],
  );

  useEffect(() => {
    return () => {
      activeTransitionIdRef.current = null;
      navigationStartedIdRef.current = null;
      cancelActiveMotion();
      clearRouteFocusIntent();
      unlockProjectEnter();
    };
  }, [cancelActiveMotion, clearRouteFocusIntent]);

  useEffect(() => {
    if (!overlay) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        if (
          navigationStartedIdRef.current !== overlay.id &&
          pathname !== overlay.href
        ) {
          navigationStartedIdRef.current = overlay.id;
          router.push(overlay.href);
        }
        finishTransition(overlay.id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [overlay, finishTransition, pathname, router]);

  useEffect(() => {
    const onEnterRequest = (event: Event) => {
      const detail = (event as CustomEvent<ProjectEnterRequestDetail>).detail;
      if (!detail) return;
      event.preventDefault();
      startEnterTransition(detail);
    };
    const onReturnRequest = (event: Event) => {
      const detail = (event as CustomEvent<ProjectReturnRequestDetail>).detail;
      if (!detail) return;
      event.preventDefault();
      startReturnTransition(detail);
    };

    window.addEventListener(PROJECT_ENTER_REQUEST, onEnterRequest);
    window.addEventListener(PROJECT_RETURN_REQUEST, onReturnRequest);
    return () => {
      window.removeEventListener(PROJECT_ENTER_REQUEST, onEnterRequest);
      window.removeEventListener(PROJECT_RETURN_REQUEST, onReturnRequest);
    };
  }, [startEnterTransition, startReturnTransition]);

  useEffect(() => {
    const onPopState = () => {
      const snapshot = readProjectReturnSnapshot();
      if (!snapshot) return;
      if (pathname !== caseStudyPath(snapshot.slug)) return;
      if (window.location.pathname !== "/") return;
      startReturnTransition({ href: "/", snapshot }, true);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [pathname, startReturnTransition]);

  useEffect(() => {
    if (!overlay || overlay.phase !== "holding") return;
    if (!shellRef.current) return;
    if (!overlay.crossfade && !frameRef.current) return;

    navigationStartedIdRef.current = overlay.id;
    setOverlay((current) =>
      current ? { ...current, phase: "navigating" } : current,
    );
    router.push(overlay.href);
  }, [overlay, router]);

  useEffect(() => {
    if (!overlay || overlay.phase !== "navigating") return;

    const reachedDestination =
      overlay.direction === "enter"
        ? pathname === overlay.href
        : pathname === "/";
    if (!reachedDestination) return;

    setOverlay((current) =>
      current ? { ...current, phase: "settling" } : current,
    );
  }, [overlay, pathname]);

  useEffect(() => {
    if (!overlay || overlay.phase !== "settling") return;
    if (settleRanRef.current) return;
    settleRanRef.current = true;

    if (overlay.direction === "enter") {
      void runEnterSettle(overlay);
    } else {
      void runReturnSettle(overlay);
    }
  }, [overlay, runEnterSettle, runReturnSettle]);

  useEffect(() => {
    if (previousPathnameRef.current !== pathname) {
      previousPathnameRef.current = pathname;
      pendingRoutePathnameRef.current = pathname;
    }
    if (overlay || pendingRoutePathnameRef.current !== pathname) return;
    if (
      routeFocusIntentRef.current &&
      routeFocusIntentRef.current.pathname !== pathname
    ) {
      return;
    }

    let cancelled = false;
    const frame = requestAnimationFrame(() => {
      void (async () => {
        if (pendingRoutePathnameRef.current !== pathname) return;
        const intent = routeFocusIntentRef.current;
        const returnTarget =
          intent?.kind === "return"
            ? await waitForProjectReturnTarget(intent.snapshot)
            : null;
        if (cancelled || pendingRoutePathnameRef.current !== pathname) return;
        if (intent && routeFocusIntentRef.current !== intent) return;

        const title = focusSettledRoute(intent, returnTarget);
        pendingRoutePathnameRef.current = null;
        clearRouteFocusIntent(intent ?? undefined);
        if (title) setRouteAnnouncement(title);
      })();
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [clearRouteFocusIntent, overlay, pathname]);

  return (
    <>
      <div
        className="project-route-surface"
        data-project-route-surface
        inert={overlay ? true : undefined}
        aria-hidden={overlay ? "true" : undefined}
      >
        {children}
      </div>
      <p
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {routeAnnouncement}
      </p>
      {overlay ? (
        <div
          ref={shellRef}
          className="project-enter-overlay"
          aria-hidden="true"
          data-phase={overlay.phase}
          data-direction={overlay.direction}
        >
          <div ref={backdropRef} className="project-enter-backdrop" />
          {!overlay.crossfade ? (
            <div
              ref={frameRef}
              className={`project-enter-frame${
                overlay.visual.type === "program"
                  ? " project-enter-frame--program"
                  : ""
              }`}
              style={{
                top: overlay.startRect.top,
                left: overlay.startRect.left,
                width: overlay.startRect.width,
                height: overlay.startRect.height,
                borderRadius: overlay.borderRadius,
              }}
            >
              <TransitionVisual visual={overlay.visual} />
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
