import { ExpandableImage } from "@/components/expandable-image";
import { PhoneFrame } from "@/components/fresh-greens";
import {
  evidenceSurfaceData,
  FRESH_GREENS_REMINDER_EVIDENCE_SURFACE,
} from "@/lib/project-evidence";

export function DepartureReminderEvidence() {
  return (
    <figure
      className="fg-reminder-evidence"
      aria-labelledby="fg-reminder-title"
      {...evidenceSurfaceData(FRESH_GREENS_REMINDER_EVIDENCE_SURFACE)}
    >
      <div className="fg-reminder-copy">
        <p className="fg-reminder-kicker">Reminders</p>
        <h3 id="fg-reminder-title">
          The route should still be useful after the app closes.
        </h3>
        <p>
          When a different departure time preserves more daylight, the route
          preview offers a Schedule action. Fresh Greens asks for notification
          access only after the driver chooses it, then stores one local
          reminder for that time.
        </p>
      </div>

      <div className="fg-reminder-layout">
        <div className="fg-reminder-device">
          <PhoneFrame variant="screenshot">
            <ExpandableImage
              src="/projects/fresh-greens/v2/route-preview.png"
              alt="Fresh Greens route preview showing route conditions, daylight timing, and a Schedule action beneath the recommended route."
              width={1290}
              height={2796}
              sizes="(max-width: 720px) 68vw, 260px"
              className="fg-feature-shot"
            />
          </PhoneFrame>
        </div>

        <div className="fg-reminder-sequence">
          <ol aria-label="How the departure reminder works">
            <li>
              <span className="fg-reminder-step" aria-hidden="true">
                1
              </span>
              <div>
                <strong>Find a useful window</strong>
                <p>
                  The route model compares daylight across the trip and only
                  suggests another departure when the timing changes the plan.
                </p>
              </div>
            </li>
            <li>
              <span className="fg-reminder-step" aria-hidden="true">
                2
              </span>
              <div>
                <strong>Choose Schedule</strong>
                <p>
                  Permission is requested at the moment of intent, not during
                  onboarding for a feature the driver may never use.
                </p>
              </div>
            </li>
            <li>
              <span className="fg-reminder-step" aria-hidden="true">
                3
              </span>
              <div>
                <strong>Leave the app</strong>
                <p>
                  A one-time notification fires from the phone at the suggested
                  departure, without a push server or an open app session.
                </p>
              </div>
            </li>
          </ol>

          <div
            className="fg-reminder-notification"
            role="group"
            aria-label="Reconstruction of the implemented Fresh Greens departure notification"
          >
            <div className="fg-reminder-notification-head">
              <span className="fg-reminder-app-mark" aria-hidden="true">
                FG
              </span>
              <span>Fresh Greens</span>
              <span>now</span>
            </div>
            <strong>Time to head out</strong>
            <p>Leaving now gives you more daylight.</p>
          </div>

          <p className="fg-reminder-secondary">
            The same local-notification layer also supports recurring and
            distance-triggered refuel or recharge reminders.
          </p>
        </div>
      </div>

      <figcaption>
        Implemented prototype behavior. It shows how Fresh Greens carries a
        planning decision beyond the foreground app; it does not prove that a
        reminder changes behavior or makes a trip safer.
      </figcaption>
    </figure>
  );
}
