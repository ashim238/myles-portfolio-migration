"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

import { keyboardMoveOffset, type DesktopPoint } from "@/lib/myles-97/state";

const PERSONAL_REMINDERS = [
  "catch up on house of the dragon",
  "touch up portfolio",
  "meal prep for the week",
] as const;

function keepWidgetOnDesktop(button: HTMLButtonElement, x: number, y: number): DesktopPoint {
  const { width, height } = button.getBoundingClientRect();
  const taskbar = button.closest(".myles97-desktop")?.querySelector(".myles97-taskbar");
  const desktopBottom = taskbar?.getBoundingClientRect().top ?? window.innerHeight;
  return {
    x: Math.max(0, Math.min(x, window.innerWidth - width)),
    y: Math.max(0, Math.min(y, desktopBottom - height)),
  };
}

export function RemindersWidget({
  onOpen,
  triggerRef,
  position,
  onMove,
}: {
  onOpen: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
  position: DesktopPoint | null;
  onMove: (position: DesktopPoint) => void;
}) {
  const [preview, setPreview] = useState<DesktopPoint | null>(null);
  const gesture = useRef<{
    pointerId: number;
    start: DesktopPoint;
    grab: DesktopPoint;
    moved: boolean;
  } | null>(null);
  const suppressClick = useRef(false);
  const displayed = preview ?? position;

  useEffect(() => {
    const button = triggerRef.current;
    if (!position || !button || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => {
      const next = keepWidgetOnDesktop(button, position.x, position.y);
      if (next.x !== position.x || next.y !== position.y) onMove(next);
    });
    observer.observe(button);
    observer.observe(document.documentElement);
    const taskbar = button.closest(".myles97-desktop")?.querySelector(".myles97-taskbar");
    if (taskbar) observer.observe(taskbar);
    return () => observer.disconnect();
  }, [position, onMove, triggerRef]);

  return (
    <button
      ref={triggerRef}
      type="button"
      className="myles97-reminders-widget"
      aria-label="Open Reminders"
      aria-describedby="reminders-widget-help"
      data-moved={displayed ? true : undefined}
      data-dragging={preview ? true : undefined}
      style={displayed ? { left: displayed.x, top: displayed.y } : undefined}
      onPointerDown={(event) => {
        if (event.button !== 0 || !event.isPrimary) return;
        const box = event.currentTarget.getBoundingClientRect();
        suppressClick.current = false;
        gesture.current = {
          pointerId: event.pointerId,
          start: { x: event.clientX, y: event.clientY },
          grab: { x: event.clientX - box.left, y: event.clientY - box.top },
          moved: false,
        };
        event.currentTarget.setPointerCapture?.(event.pointerId);
      }}
      onPointerMove={(event) => {
        const drag = gesture.current;
        if (!drag || drag.pointerId !== event.pointerId) return;
        if (!drag.moved && Math.hypot(event.clientX - drag.start.x, event.clientY - drag.start.y) < 5) return;
        drag.moved = true;
        setPreview(keepWidgetOnDesktop(event.currentTarget, event.clientX - drag.grab.x, event.clientY - drag.grab.y));
      }}
      onPointerUp={(event) => {
        const drag = gesture.current;
        if (!drag || drag.pointerId !== event.pointerId) return;
        if (drag.moved) {
          suppressClick.current = true;
          onMove(keepWidgetOnDesktop(event.currentTarget, event.clientX - drag.grab.x, event.clientY - drag.grab.y));
        }
        gesture.current = null;
        setPreview(null);
      }}
      onLostPointerCapture={(event) => {
        if (gesture.current?.pointerId === event.pointerId) {
          gesture.current = null;
          setPreview(null);
        }
      }}
      onKeyDown={(event) => {
        const delta = keyboardMoveOffset(event.key, event.shiftKey);
        if (!delta) return;
        event.preventDefault();
        const box = event.currentTarget.getBoundingClientRect();
        onMove(keepWidgetOnDesktop(event.currentTarget, box.left + delta.x, box.top + delta.y));
      }}
      onClick={(event) => {
        if (!suppressClick.current || event.detail === 0) onOpen();
        suppressClick.current = false;
      }}
    >
      <span hidden id="reminders-widget-help">
        Drag to move, or use the arrow keys. Hold Shift for larger steps.
      </span>
      <span className="myles97-reminders-widget-title">Reminders</span>
      <strong>3 things on my list</strong>
      <span>house of the dragon · portfolio · meal prep</span>
    </button>
  );
}

export function RemindersProgram() {
  const firstReminderRef = useRef<HTMLInputElement>(null);
  const [completed, setCompleted] = useState(() =>
    PERSONAL_REMINDERS.map(() => false),
  );

  useEffect(() => {
    firstReminderRef.current?.focus();
  }, []);

  return (
    <article className="myles97-reminders-program">
      <header>
        <p className="myles97-eyebrow">Personal notes</p>
        <h2>A couple of notes</h2>
        <p>The small stuff I keep meaning to get back to.</p>
      </header>

      <ol>
        {PERSONAL_REMINDERS.map((reminder, index) => (
          <li
            key={reminder}
            data-completed={completed[index] ? "true" : "false"}
          >
            <label>
              <input
                ref={index === 0 ? firstReminderRef : undefined}
                className="myles97-reminder-checkbox"
                type="checkbox"
                checked={completed[index]}
                onChange={() => {
                  setCompleted((current) =>
                    current.map((value, itemIndex) =>
                      itemIndex === index ? !value : value,
                    ),
                  );
                }}
              />
              <span>
                <strong>{reminder}</strong>
              </span>
            </label>
          </li>
        ))}
      </ol>
    </article>
  );
}
