"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

const PERSONAL_REMINDERS = [
  {
    title: "Catch up on World’s Finest",
    detail: "See what Daniel Mora’s been drawing.",
  },
  {
    title: "Plan the next hike",
    detail: "Check the pollen count before choosing a trail.",
  },
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
      <strong>2 things on my list</strong>
      <span>World’s Finest · Next hike</span>
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
            key={reminder.title}
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
                <strong>{reminder.title}</strong>
                <span>{reminder.detail}</span>
              </span>
            </label>
          </li>
        ))}
      </ol>
    </article>
  );
}
