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
        <p className="fg-reminder-kicker">Interview insight → feature</p>
        <h3 id="fg-reminder-title">
          Taking one thing off the driver&apos;s plate.
        </h3>
        <p>
          People told me about families leaving a few hours before sunrise on
          long-haul trips so they could spend more of the drive in daylight.
          “Make sure you&apos;re home before dark” came up in different forms often
          enough that the product needed to account for it.
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

        <div className="fg-reminder-decision">
          <p>
            Long-haul planning has a lot of unknowns, and those unknowns can be
            anxiety-inducing. Once Fresh Greens finds a better daylight window,
            the driver can schedule it and move on.
          </p>

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

          <div className="fg-reminder-permission">
            <strong>Ask when the value is clear.</strong>
            <p>
              Location and microphone access were essential enough to explain
              during onboarding. Notifications were different. Asking for every
              permission up front felt deceptive, so Fresh Greens waits until the
              driver presses Schedule, when the reason is clear.
            </p>
          </div>
        </div>
      </div>

      <figcaption>
        Implemented in the prototype. It shows that the reminder exists; it
        doesn&apos;t show that people leave at that time or have a safer trip.
      </figcaption>
    </figure>
  );
}
