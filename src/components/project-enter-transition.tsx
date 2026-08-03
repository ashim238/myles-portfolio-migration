"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { TikTokCoverBlobs } from "@/components/tiktok-dsa";
import { prefersReducedMotion } from "@/lib/home-intro";
import {
  PROJECT_ENTER_COMPLETE,
  PROJECT_ENTER_REQUEST,
  PROJECT_ENTER_SETTLE_MS,
  waitForProjectCover,
  type ProjectEnterRequestDetail,
  type ProjectEnterRect,
  type ProjectEnterVisual,
} from "@/lib/project-enter";

const EASE_OUT_CUBIC = "cubic-bezier(0.33, 1, 0.68, 1)";

type OverlayPhase = "holding" | "navigating" | "settling";

type OverlayState = {
  id: number;
  phase: OverlayPhase;
  slug: string;
  href: string;
  visual: ProjectEnterVisual;
  borderRadius: string;
  startRect: ProjectEnterRect;
};

function lockProjectEnter() {
  document.documentElement.classList.add("project-enter-lock");
}

function unlockProjectEnter() {
  document.documentElement.classList.remove("project-enter-lock");
  document.documentElement.classList.remove("project-enter-settling");
  window.dispatchEvent(new CustomEvent(PROJECT_ENTER_COMPLETE));
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
  const pendingSlugRef = useRef<string | null>(null);
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
    pendingSlugRef.current = null;
    navigatingRef.current = false;
    settleRanRef.current = false;
    unlockProjectEnter();
    setOverlay(null);
  }, []);

  const runSettle = useCallback(
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
        shell.style.opacity = "0";
        finishTransition(state.id);
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

      // Fade only the neutral backdrop first. This lets the case-study title,
      // lede and destination hero appear around the still-solid shared cover
      // instead of holding the visitor on an empty canvas until the very end.
      const backdropAnim = backdrop.animate(
        [{ opacity: 1 }, { opacity: 0 }],
        {
          duration: 280,
          easing: EASE_OUT_CUBIC,
          fill: "forwards",
        },
      );

      const FRAME_FADE_MS = 220;
      const frameFadeDelay = PROJECT_ENTER_SETTLE_MS - 140;

      const shellAnim = shell.animate(
        [{ opacity: 1 }, { opacity: 0 }],
        {
          duration: FRAME_FADE_MS,
          delay: frameFadeDelay,
          easing: EASE_OUT_CUBIC,
          fill: "forwards",
        },
      );

      // The page sits at opacity:0 via `.project-enter-settling`; this WAAPI
      // fill overrides that rule to fade it up in lockstep with the overlay.
      const page = cover.closest<HTMLElement>(".project-page");
      const pageAnim = page?.animate(
        [{ opacity: 0 }, { opacity: 1 }],
        {
          duration: 380,
          delay: 60,
          easing: EASE_OUT_CUBIC,
          fill: "forwards",
        },
      );
      animationsRef.current = [
        frameAnim,
        backdropAnim,
        shellAnim,
        ...(pageAnim ? [pageAnim] : []),
      ];

      // Settle on real completion when the timeline runs, but fall back to a
      // timer so a frozen timeline can never leave the overlay and scroll lock
      // hanging.
      const settleTimeout = frameFadeDelay + FRAME_FADE_MS + 120;
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
    [finishTransition],
  );

  const startTransition = useCallback(
    (detail: ProjectEnterRequestDetail) => {
      if (prefersReducedMotion()) {
        router.push(detail.href);
        return;
      }
      if (navigatingRef.current) return;

      const transitionId = ++transitionSequenceRef.current;
      activeTransitionIdRef.current = transitionId;
      navigatingRef.current = true;
      pendingSlugRef.current = detail.slug;
      lockProjectEnter();
      document.documentElement.classList.add("project-enter-settling");

      // Failsafe: never hold the scroll lock / overlay longer than this,
      // even if the destination route is slow to load or the cover never
      // resolves. The navigation itself still completes in the background.
      if (failsafeRef.current) clearTimeout(failsafeRef.current);
      failsafeRef.current = setTimeout(
        () => finishTransition(transitionId),
        4500,
      );

      setOverlay({
        id: transitionId,
        phase: "holding",
        slug: detail.slug,
        href: detail.href,
        visual: detail.visual,
        borderRadius: detail.borderRadius,
        startRect: detail.rect,
      });
    },
    [router, finishTransition],
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

  // Escape releases the overlay and scroll lock immediately; the in-app
  // navigation it kicked off still resolves underneath.
  useEffect(() => {
    if (!overlay) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finishTransition(overlay.id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [overlay, finishTransition]);

  useEffect(() => {
    const onRequest = (event: Event) => {
      const detail = (event as CustomEvent<ProjectEnterRequestDetail>).detail;
      if (!detail) return;
      startTransition(detail);
    };

    window.addEventListener(PROJECT_ENTER_REQUEST, onRequest);
    return () => window.removeEventListener(PROJECT_ENTER_REQUEST, onRequest);
  }, [startTransition]);

  useEffect(() => {
    if (!overlay || overlay.phase !== "holding") return;
    if (!shellRef.current || !frameRef.current) return;

    // This effect runs only after the overlay has committed, so the source
    // cover is already painted before the route begins changing underneath it.
    setOverlay((current) =>
      current ? { ...current, phase: "navigating" } : current,
    );
    router.push(overlay.href);
  }, [overlay, router]);

  useEffect(() => {
    if (!overlay || overlay.phase !== "navigating") return;
    if (!pathname.startsWith("/work/")) return;

    const slug = pathname.split("/").filter(Boolean).pop();
    if (!slug || slug !== pendingSlugRef.current) return;

    setOverlay((current) =>
      current ? { ...current, phase: "settling" } : current,
    );
  }, [overlay, pathname]);

  useEffect(() => {
    if (!overlay || overlay.phase !== "settling") return;
    if (settleRanRef.current) return;
    settleRanRef.current = true;
    void runSettle(overlay);
  }, [overlay, runSettle]);

  return (
    <>
      {children}
      {overlay ? (
        <div
          ref={shellRef}
          className="project-enter-overlay"
          aria-hidden="true"
          data-phase={overlay.phase}
        >
          <div ref={backdropRef} className="project-enter-backdrop" />
          <div
            ref={frameRef}
            className="project-enter-frame"
            style={{
              top: overlay.startRect.top,
              left: overlay.startRect.left,
              width: overlay.startRect.width,
              height: overlay.startRect.height,
              borderRadius: overlay.borderRadius,
            }}
          >
            {overlay.visual.type === "tiktok" ? (
              <div className="project-enter-tiktok work-thumb--tiktok-logo tt-cover--preview">
                <TikTokCoverBlobs deferUntilVisible={false} />
              </div>
            ) : (
              <Image
                className="project-enter-image"
                src={overlay.visual.src}
                alt=""
                width={1400}
                height={900}
                priority
                draggable={false}
              />
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
