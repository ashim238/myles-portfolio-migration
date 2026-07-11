"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/home-intro";
import {
  PROJECT_ENTER_COMPLETE,
  PROJECT_ENTER_REQUEST,
  PROJECT_ENTER_SETTLE_MS,
  PROJECT_ENTER_ZOOM_IN_MS,
  computeCenterOffset,
  computeCoverScale,
  waitForProjectCover,
  type ProjectEnterRequestDetail,
  type ProjectEnterRect,
} from "@/lib/project-enter";

const EASE_OUT_CUBIC = "cubic-bezier(0.33, 1, 0.68, 1)";

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
  const failsafeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const finishTransition = useCallback(() => {
    if (failsafeRef.current) {
      clearTimeout(failsafeRef.current);
      failsafeRef.current = null;
    }
    pendingSlugRef.current = null;
    navigatingRef.current = false;
    zoomRanRef.current = false;
    settleRanRef.current = false;
    unlockProjectEnter();
    setOverlay(null);
  }, []);

  const runSettle = useCallback(
    async (state: OverlayState) => {
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

      const frameAnim = frame.animate(
        [
          {
            transform: `translate(${zoomOffset.x}px, ${zoomOffset.y}px) scale(${coverScale})`,
            borderRadius: state.borderRadius,
          },
          {
            transform: `translate(${endX}px, ${endY}px) scale(${endScale})`,
            borderRadius: targetRadius,
          },
        ],
        {
          duration: PROJECT_ENTER_SETTLE_MS,
          easing: EASE_OUT_CUBIC,
          fill: "forwards",
        },
      );

      const shellAnim = shell.animate(
        [{ opacity: 1 }, { opacity: 0 }],
        {
          duration: 220,
          delay: PROJECT_ENTER_SETTLE_MS - 180,
          easing: EASE_OUT_CUBIC,
          fill: "forwards",
        },
      );

      // Same guarantee as the zoom-in phase: settle on real completion when
      // the timeline runs, but fall back to a timer so a frozen timeline can
      // never leave the overlay and scroll lock hanging.
      await Promise.race([
        Promise.all([frameAnim.finished, shellAnim.finished]).catch(() => undefined),
        new Promise((resolve) => window.setTimeout(resolve, PROJECT_ENTER_SETTLE_MS + 250)),
      ]);
      finishTransition();
    },
    [finishTransition],
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

      // Failsafe: never hold the scroll lock / overlay longer than this,
      // even if the destination route is slow to load or the cover never
      // resolves. The navigation itself still completes in the background.
      if (failsafeRef.current) clearTimeout(failsafeRef.current);
      failsafeRef.current = setTimeout(() => finishTransition(), 4500);

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
    [router, finishTransition],
  );

  useEffect(() => {
    return () => {
      unlockProjectEnter();
    };
  }, []);

  // Escape releases the overlay and scroll lock immediately; the in-app
  // navigation it kicked off still resolves underneath.
  useEffect(() => {
    if (!overlay) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finishTransition();
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
    if (!overlay || overlay.phase !== "zoom-in") return;
    if (zoomRanRef.current) return;
    if (!shellRef.current || !frameRef.current) return;

    zoomRanRef.current = true;

    const frame = frameRef.current;
    const { startRect } = overlay;
    const coverScale = computeCoverScale(startRect);
    const offset = computeCenterOffset(startRect);

    frame.style.transform = "translate(0px, 0px) scale(1)";

    const zoomAnim = frame.animate(
      [
        { transform: "translate(0px, 0px) scale(1)" },
        {
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${coverScale})`,
        },
      ],
      {
        duration: PROJECT_ENTER_ZOOM_IN_MS,
        easing: EASE_OUT_CUBIC,
        fill: "forwards",
      },
    );

    // Navigate when the zoom finishes, but never depend on the animation
    // timeline alone. A backgrounded or throttled tab freezes
    // document.timeline, so finished() would stay pending forever, and the
    // card's native link was already preventDefault()-ed. The timeout
    // backstop guarantees the push always fires and the user is never stranded.
    let navigated = false;
    const advance = () => {
      if (navigated) return;
      navigated = true;
      setOverlay((current) =>
        current ? { ...current, phase: "navigating" } : current,
      );
      router.push(overlay.href);
    };
    zoomAnim.finished.then(advance, advance);
    const navBackstop = window.setTimeout(advance, PROJECT_ENTER_ZOOM_IN_MS + 150);

    return () => window.clearTimeout(navBackstop);
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
