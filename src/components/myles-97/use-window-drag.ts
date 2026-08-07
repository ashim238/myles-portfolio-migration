"use client";

import { useCallback, useRef, useState } from "react";
import type { PointerEventHandler } from "react";
import {
  clampWindowGeometry,
  type ViewportBounds,
  type WindowGeometry,
} from "@/lib/myles-97/state";

type WindowDragOptions = {
  geometry: WindowGeometry;
  onCommit: (geometry: WindowGeometry) => void;
};

type DragSession = {
  pointerId: number;
  startX: number;
  startY: number;
  deltaX: number;
  deltaY: number;
};

function browserViewport(): ViewportBounds {
  return {
    width: Math.max(window.innerWidth, 320),
    height: Math.max(window.innerHeight, 240),
  };
}

export function useWindowDrag({ geometry, onCommit }: WindowDragOptions) {
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

    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      deltaX: 0,
      deltaY: 0,
    };
    setDragging(true);
    event.preventDefault();
    try {
      event.currentTarget.setPointerCapture?.(event.pointerId);
    } catch {
      // Dragging still works when pointer capture is unavailable.
    }
  }, []);

  const onPointerMove = useCallback<PointerEventHandler<HTMLElement>>((event) => {
    const session = drag.current;
    if (!session || session.pointerId !== event.pointerId) return;

    session.deltaX = event.clientX - session.startX;
    session.deltaY = event.clientY - session.startY;
    setPreview({ x: session.deltaX, y: session.deltaY });
  }, []);

  const onPointerUp = useCallback<PointerEventHandler<HTMLElement>>(
    (event) => {
      const session = drag.current;
      if (!session || session.pointerId !== event.pointerId) return;

      const next = clampWindowGeometry(
        {
          ...geometry,
          x: geometry.x + session.deltaX,
          y: geometry.y + session.deltaY,
        },
        browserViewport(),
      );
      onCommit(next);
      clearDrag(event.currentTarget, event.pointerId);
    },
    [clearDrag, geometry, onCommit],
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
