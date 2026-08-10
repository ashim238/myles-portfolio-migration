"use client";

import { useEffect, useRef, type RefObject } from "react";
import { siteConfig } from "@/lib/site-config";

const VISITOR_REMINDERS = [
  {
    title: "Open Selected Work",
    detail: "Choose any case study and skim the opening facts.",
    href: "/#selected-work",
  },
  {
    title: "Read About Myles",
    detail: "The short version of how I got here.",
    href: "/about",
  },
  {
    title: "Send a note",
    detail: "Email me if something sparks a question.",
    href: `mailto:${siteConfig.email}`,
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
      <strong>3 things to see</strong>
      <span>Selected Work · About · E-mail</span>
    </button>
  );
}

export function RemindersProgram() {
  const firstReminderRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    firstReminderRef.current?.focus();
  }, []);

  return (
    <article className="myles97-reminders-program">
      <header>
        <p className="myles97-eyebrow">Visitor checklist</p>
        <h2>A few things to see</h2>
        <p>Three shortcuts if you want the quick version.</p>
      </header>

      <ol>
        {VISITOR_REMINDERS.map((reminder, index) => (
          <li key={reminder.title}>
            <a
              ref={index === 0 ? firstReminderRef : undefined}
              href={reminder.href}
            >
              <span className="myles97-reminder-check" aria-hidden="true">
                □
              </span>
              <span>
                <strong>{reminder.title}</strong>
                <span>{reminder.detail}</span>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </article>
  );
}
