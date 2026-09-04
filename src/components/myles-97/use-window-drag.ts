"use client";

import { useCallback, useRef, useState } from "react";
import type { PointerEventHandler } from "react";
import { animate } from "motion";
import {
  clampWindowGeometry,
  type ViewportBounds,
  type WindowGeometry,
} from "@/lib/myles-97/state";

type WindowDragOptions = {
  geometry: WindowGeometry;
  useRenderedOrigin?: boolean;
  reduceMotion?: boolean;
  onCommit: (geometry: WindowGeometry) => void;
};

type DragSession = {
  pointerId: number;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
  deltaX: number;
  deltaY: number;
  displayX: number;
  displayY: number;
};

function browserViewport(): ViewportBounds {
  return {
    width: Math.max(window.innerWidth, 320),
    height: Math.max(window.innerHeight, 240),
  };
}

function rubberband(overshoot: number, dimension: number, constant = 0.35) {
  return (overshoot * dimension * constant) /
    (dimension + constant * Math.abs(overshoot));
}

export function useWindowDrag({
  geometry,
  useRenderedOrigin = false,
  reduceMotion = false,
  onCommit,
}: WindowDragOptions) {
  const drag = useRef<DragSession | null>(null);
  const [preview, setPreview] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const clearDrag = useCallback((element?: HTMLElement, pointerId?: number) => {
    if (element && typeof pointerId === "number") {
      try {
        if (element.hasPointerCapture?.(pointerId)) {
          element.releasePointerCapture(pointerId);
        }
      } catch {
        // Pointer capture support varies across browsers and test environments.
      }
    }
    drag.current = null;
    setPreview({ x: 0, y: 0 });
    setDragging(false);
  }, []);

  const onPointerDown = useCallback<PointerEventHandler<HTMLElement>>((event) => {
    if (event.button !== 0) return;
    const target = event.target as HTMLElement;
    if (target.closest("button, a, input, select, textarea")) return;
    const windowElement = event.currentTarget.closest<HTMLElement>(".myles97-window");

    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: useRenderedOrigin ? (windowElement?.offsetLeft ?? geometry.x) : geometry.x,
      originY: useRenderedOrigin ? (windowElement?.offsetTop ?? geometry.y) : geometry.y,
      deltaX: 0,
      deltaY: 0,
      displayX: 0,
      displayY: 0,
    };
    setDragging(true);
    event.preventDefault();
    try {
      event.currentTarget.setPointerCapture?.(event.pointerId);
    } catch {
      // Dragging still works when pointer capture is unavailable.
    }
  }, [geometry, useRenderedOrigin]);

  const onPointerMove = useCallback<PointerEventHandler<HTMLElement>>((event) => {
    const session = drag.current;
    if (!session || session.pointerId !== event.pointerId) return;

    session.deltaX = event.clientX - session.startX;
    session.deltaY = event.clientY - session.startY;

    const viewport = browserViewport();
    const proposed = {
      ...geometry,
      x: session.originX + session.deltaX,
      y: session.originY + session.deltaY,
    };
    const clamped = clampWindowGeometry(proposed, viewport);
    session.displayX = clamped.x - session.originX +
      rubberband(proposed.x - clamped.x, viewport.width);
    session.displayY = clamped.y - session.originY +
      rubberband(proposed.y - clamped.y, viewport.height);
    setPreview({ x: session.displayX, y: session.displayY });
  }, [geometry]);

  const onPointerUp = useCallback<PointerEventHandler<HTMLElement>>(
    async (event) => {
      const session = drag.current;
      if (!session || session.pointerId !== event.pointerId) return;

      if (session.deltaX === 0 && session.deltaY === 0) {
        clearDrag(event.currentTarget, event.pointerId);
        return;
      }

      const next = clampWindowGeometry(
        {
          ...geometry,
          x: session.originX + session.deltaX,
          y: session.originY + session.deltaY,
        },
        browserViewport(),
      );
      const targetX = next.x - session.originX;
      const targetY = next.y - session.originY;
      const hasBoundaryReturn =
        Math.abs(targetX - session.displayX) > 0.5 ||
        Math.abs(targetY - session.displayY) > 0.5;

      if (!reduceMotion && hasBoundaryReturn) {
        const windowElement = event.currentTarget.closest<HTMLElement>(".myles97-window");
        if (windowElement) {
          const returnAnimation = animate(
            windowElement,
            {
              transform: `translate3d(${targetX}px, ${targetY}px, 0)`,
            },
            { type: "spring", bounce: 0, duration: 0.32 },
          );
          try {
            await returnAnimation.finished;
          } catch {
            // A new gesture may intentionally interrupt the boundary return.
          }
        }
      }

      onCommit(next);
      clearDrag(event.currentTarget, event.pointerId);
    },
    [clearDrag, geometry, onCommit, reduceMotion],
  );

  const onPointerCancel = useCallback<PointerEventHandler<HTMLElement>>(
    (event) => clearDrag(event.currentTarget, event.pointerId),
    [clearDrag],
  );

  return {
    dragHandleProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
    },
    dragging,
    previewTransform:
      preview.x === 0 && preview.y === 0
        ? undefined
        : `translate3d(${preview.x}px, ${preview.y}px, 0)`,
  };
}
