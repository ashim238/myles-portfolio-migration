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
  readProjectReturnSnapshot,
  waitForProjectCover,
  waitForProjectProgram,
  type ProjectCoverVisual,
  type ProjectEnterRequestDetail,
  type ProjectEnterRect,
  type ProjectEnterVisual,
  type ProjectReturnRequestDetail,
  type ProjectReturnSnapshot,
} from "@/lib/project-enter";

const EASE_OUT_CUBIC = "cubic-bezier(0.33, 1, 0.68, 1)";
const TRANSITION_FAILSAFE_MS = 4500;

type OverlayPhase = "holding" | "navigating" | "settling";
type OverlayDirection = "enter" | "return";

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

function caseStudyPath(slug: string): string {
  return `/work/${slug}`;
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
  const shellRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const navigatingRef = useRef(false);
  const settleRanRef = useRef(false);
  const failsafeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const settleTimeoutRef = useRef<number | null>(null);
  const animationsRef = useRef<Animation[]>([]);
  const transitionSequenceRef = useRef(0);
  const activeTransitionIdRef = useRef<number | null>(null);

  const finishTransition = useCallback((transitionId: number | null) => {
    if (
      transitionId === null ||
      activeTransitionIdRef.current !== transitionId
    ) {
      return;
    }

    activeTransitionIdRef.current = null;
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
    navigatingRef.current = false;
    settleRanRef.current = false;
    unlockProjectEnter();
    setOverlay(null);
  }, []);

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

      const targetRect = cover.getBoundingClientRect();
      const targetRadius = getComputedStyle(cover).borderRadius || "0.65rem";
      const frameAnim = frame.animate(
        [
          {
            top: `${state.startRect.top}px`,
            left: `${state.startRect.left}px`,
            width: `${state.startRect.width}px`,
            height: `${state.startRect.height}px`,
            borderRadius: state.borderRadius,
          },
          {
            top: `${targetRect.top}px`,
            left: `${targetRect.left}px`,
            width: `${targetRect.width}px`,
            height: `${targetRect.height}px`,
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

      const target = await waitForProjectProgram(state.snapshot.slug);
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
      const targetRadius =
        getComputedStyle(target).borderRadius || state.snapshot.borderRadius;
      const frameAnim = frame.animate(
        [
          {
            top: `${state.startRect.top}px`,
            left: `${state.startRect.left}px`,
            width: `${state.startRect.width}px`,
            height: `${state.startRect.height}px`,
            borderRadius: state.borderRadius,
          },
          {
            top: `${targetRect.top}px`,
            left: `${targetRect.left}px`,
            width: `${targetRect.width}px`,
            height: `${targetRect.height}px`,
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
      failsafeRef.current = setTimeout(
        () => finishTransition(transitionId),
        TRANSITION_FAILSAFE_MS,
      );
    },
    [finishTransition],
  );

  const startEnterTransition = useCallback(
    (detail: ProjectEnterRequestDetail) => {
      if (prefersReducedMotion()) {
        router.push(detail.href);
        return;
      }
      if (navigatingRef.current) return;

      const transitionId = ++transitionSequenceRef.current;
      activeTransitionIdRef.current = transitionId;
      navigatingRef.current = true;
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
    [armFailsafe, router],
  );

  const startReturnTransition = useCallback(
    (detail: ProjectReturnRequestDetail, navigationAlreadyStarted = false) => {
      if (prefersReducedMotion()) {
        if (!navigationAlreadyStarted) router.push(detail.href);
        return;
      }
      if (navigatingRef.current) return;

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
      navigatingRef.current = true;
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
    [armFailsafe, router],
  );

  useEffect(() => {
    return () => {
      activeTransitionIdRef.current = null;
      if (failsafeRef.current) clearTimeout(failsafeRef.current);
      if (settleTimeoutRef.current) clearTimeout(settleTimeoutRef.current);
      for (const animation of animationsRef.current) animation.cancel();
      unlockProjectEnter();
    };
  }, []);

  useEffect(() => {
    if (!overlay) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") finishTransition(overlay.id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [overlay, finishTransition]);

  useEffect(() => {
    const onEnterRequest = (event: Event) => {
      const detail = (event as CustomEvent<ProjectEnterRequestDetail>).detail;
      if (detail) startEnterTransition(detail);
    };
    const onReturnRequest = (event: Event) => {
      const detail = (event as CustomEvent<ProjectReturnRequestDetail>).detail;
      if (detail) startReturnTransition(detail);
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
      startReturnTransition({ href: "/", snapshot }, true);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [pathname, startReturnTransition]);

  useEffect(() => {
    if (!overlay || overlay.phase !== "holding") return;
    if (!shellRef.current) return;
    if (!overlay.crossfade && !frameRef.current) return;

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

    const transitionId = overlay.id;
    const animationFrame = window.requestAnimationFrame(() => {
      setOverlay((current) =>
        current?.id === transitionId && current.phase === "navigating"
          ? { ...current, phase: "settling" }
          : current,
      );
    });

    return () => window.cancelAnimationFrame(animationFrame);
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

  return (
    <>
      {children}
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
