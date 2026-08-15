import { ExpandableImage } from "@/components/expandable-image";
import { PhoneFrame } from "@/components/fresh-greens";

export function DepartureReminderEvidence() {
  return (
    <figure
      className="fg-reminder-evidence"
      aria-labelledby="fg-reminder-title"
      data-evidence-proof="fg-departure-reminder"
      data-evidence-role="supporting"
      data-evidence-kind="interaction"
      data-evidence-chapter="fg-design"
    >
      <div className="fg-reminder-copy">
        <p className="fg-reminder-kicker">Daylight came up in all six interviews</p>
        <h3 id="fg-reminder-title">
          A departure reminder tied to daylight.
        </h3>
        <p>
          I built a local reminder around that pattern.
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
            <strong>Notification access comes after Schedule.</strong>
            <p>
              Asking for every permission up front felt deceptive.
            </p>
          </div>
        </div>
      </div>

      <figcaption>
        Implemented in the prototype. It doesn&apos;t show that people leave at
        that time or have a safer trip.
      </figcaption>
    </figure>
  );
}
