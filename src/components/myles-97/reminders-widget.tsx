"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

const PERSONAL_REMINDERS = [
  "catch up on house of the dragon",
  "touch up portfolio",
  "meal prep for the week",
] as const;

export function RemindersWidget({
  onOpen,
  triggerRef,
}: {
  onOpen: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
}) {
  return (
    <button
      ref={triggerRef}
      type="button"
      className="myles97-reminders-widget"
      onClick={onOpen}
      aria-label="Open Reminders"
    >
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
