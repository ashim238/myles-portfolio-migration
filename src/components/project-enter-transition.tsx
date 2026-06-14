"use client";

import { createTimeline } from "animejs";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/home-intro";
import {
  PROJECT_ENTER_COMPLETE,
  PROJECT_ENTER_REQUEST,
  PROJECT_ENTER_CROSSFADE_MS,
  PROJECT_ENTER_SETTLE_MS,
  PROJECT_ENTER_ZOOM_IN_MS,
  computeCenterOffset,
  computeCoverScale,
  usesCrossfadeSettle,
  waitForProjectCover,
  waitForProjectPage,
  type ProjectEnterRequestDetail,
  type ProjectEnterRect,
} from "@/lib/project-enter";

type OverlayPhase = "zoom-in" | "navigating" | "settling";

type OverlayState = {
  phase: OverlayPhase;
  slug: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  borderRadius: string;
  startRect: ProjectEnterRect;
};

function lockProjectEnter() {
  document.documentElement.classList.add("project-enter-lock");
}

function unlockProjectEnter() {
  document.documentElement.classList.remove("project-enter-lock");
  document.documentElement.classList.remove("project-enter-settling");
  document.documentElement.classList.remove("project-enter-crossfading");
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
  const frameRef = useRef<HTMLDivElement>(null);
  const pendingSlugRef = useRef<string | null>(null);
  const navigatingRef = useRef(false);
  const zoomRanRef = useRef(false);
  const settleRanRef = useRef(false);

  const finishTransition = useCallback(() => {
    pendingSlugRef.current = null;
    navigatingRef.current = false;
    zoomRanRef.current = false;
    settleRanRef.current = false;
    unlockProjectEnter();
    setOverlay(null);
  }, []);

  const runCrossfadeSettle = useCallback(
    async (state: OverlayState) => {
      document.documentElement.classList.add("project-enter-settling", "project-enter-crossfading");

      const page = document.querySelector<HTMLElement>(
        `.project-page[data-project-slug="${state.slug}"]`,
      );
      const hero = page?.querySelector<HTMLElement>("[data-project-enter-cover]");
      const shell = shellRef.current;
      const frame = frameRef.current;

      if (!page || !shell || !frame) {
        finishTransition();
        return;
      }

      page.style.opacity = "0";
      if (hero) {
        hero.style.opacity = "0";
      }

      const timeline = createTimeline({ defaults: { ease: "outCubic" } });

      timeline.add(
        frame,
        { opacity: [1, 0], duration: PROJECT_ENTER_CROSSFADE_MS },
        40,
      );

      timeline.add(
        shell,
        { opacity: [1, 0], duration: PROJECT_ENTER_CROSSFADE_MS },
        40,
      );

      if (hero) {
        timeline.add(
          hero,
          { opacity: [0, 1], duration: PROJECT_ENTER_CROSSFADE_MS },
          120,
        );
      }

      timeline.add(
        page,
        { opacity: [0, 1], duration: PROJECT_ENTER_CROSSFADE_MS + 80 },
        80,
      );

      await timeline.then();

      page.style.opacity = "";
      if (hero) {
        hero.style.opacity = "";
      }
      finishTransition();
    },
    [finishTransition],
  );

  const runSettle = useCallback(
    async (state: OverlayState) => {
      const page = await waitForProjectPage(state.slug);

      if (usesCrossfadeSettle(page)) {
        await runCrossfadeSettle(state);
        return;
      }

      document.documentElement.classList.add("project-enter-settling");

      const cover = await waitForProjectCover(state.slug);
      const shell = shellRef.current;
      const frame = frameRef.current;

      if (!shell || !frame) {
        finishTransition();
        return;
      }

      if (!cover) {
        shell.style.opacity = "0";
        finishTransition();
        return;
      }

      const targetRect = cover.getBoundingClientRect();
      const coverScale = computeCoverScale(state.startRect);
      const zoomOffset = computeCenterOffset(state.startRect);
      const startCenterX = state.startRect.left + state.startRect.width / 2;
      const startCenterY = state.startRect.top + state.startRect.height / 2;
      const targetCenterX = targetRect.left + targetRect.width / 2;
      const targetCenterY = targetRect.top + targetRect.height / 2;
      const endScale = targetRect.width / state.startRect.width;
      const endX = targetCenterX - startCenterX;
      const endY = targetCenterY - startCenterY;
      const targetRadius = getComputedStyle(cover).borderRadius || "0.65rem";

      const timeline = createTimeline({ defaults: { ease: "outCubic" } });

      timeline.add(
        frame,
        {
          translateX: [zoomOffset.x, endX],
          translateY: [zoomOffset.y, endY],
          scale: [coverScale, endScale],
          duration: PROJECT_ENTER_SETTLE_MS,
        },
        0,
      );

      timeline.add(
        frame,
        {
          borderRadius: [state.borderRadius, targetRadius],
          duration: PROJECT_ENTER_SETTLE_MS,
        },
        0,
      );

      timeline.add(
        shell,
        {
          opacity: [1, 0],
          duration: 220,
          ease: "outCubic",
        },
        PROJECT_ENTER_SETTLE_MS - 180,
      );

      await timeline.then();
      finishTransition();
    },
    [finishTransition, runCrossfadeSettle],
  );

  const startTransition = useCallback(
    (detail: ProjectEnterRequestDetail) => {
      if (navigatingRef.current || prefersReducedMotion()) {
        router.push(detail.href);
        return;
      }

      navigatingRef.current = true;
      pendingSlugRef.current = detail.slug;
      lockProjectEnter();

      setOverlay({
        phase: "zoom-in",
        slug: detail.slug,
        href: detail.href,
        imageSrc: detail.imageSrc,
        imageAlt: detail.imageAlt,
        borderRadius: detail.borderRadius,
        startRect: detail.rect,
      });
    },
    [router],
  );

  useEffect(() => {
    return () => {
      unlockProjectEnter();
    };
  }, []);

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
    if (!overlay || overlay.phase !== "zoom-in") return;
    if (zoomRanRef.current) return;
    if (!shellRef.current || !frameRef.current) return;

    zoomRanRef.current = true;

    const shell = shellRef.current;
    const frame = frameRef.current;
    const { startRect } = overlay;
    const coverScale = computeCoverScale(startRect);
    const offset = computeCenterOffset(startRect);

    frame.style.transform = "translate(0px, 0px) scale(1)";

    const timeline = createTimeline({ defaults: { ease: "outCubic" } });

    timeline.add(
      frame,
      {
        translateX: [0, offset.x],
        translateY: [0, offset.y],
        scale: [1, coverScale],
        duration: PROJECT_ENTER_ZOOM_IN_MS,
      },
      0,
    );

    void timeline.then(() => {
      setOverlay((current) =>
        current ? { ...current, phase: "navigating" } : current,
      );
      router.push(overlay.href);
    });
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
            <Image
              className="project-enter-image"
              src={overlay.imageSrc}
              alt=""
              width={1400}
              height={900}
              priority
              draggable={false}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
