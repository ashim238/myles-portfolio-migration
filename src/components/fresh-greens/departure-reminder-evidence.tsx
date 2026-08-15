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
        <h3 id="fg-reminder-title">A daylight departure reminder.</h3>
        <p>
          I built the reminder around that pattern.
        </p>
      </div>

      <div className="fg-reminder-layout">
        <div
          className="fg-reminder-state-scroll"
          role="group"
          aria-label="Schedule, permission, and departure notification states"
          tabIndex={0}
        >
          <ol className="fg-reminder-state-strip" role="list">
            <li className="fg-reminder-state fg-reminder-state--schedule">
              <span className="fg-reminder-state-label">1. Pick a time</span>
              <strong>Leave before the light fades</strong>
              <span className="fg-reminder-schedule-action">Schedule</span>
            </li>

            <li className="fg-reminder-state fg-reminder-state--permission">
              <span className="fg-reminder-state-label">2. Ask in context</span>
              <strong>Allow notifications?</strong>
              <span className="fg-reminder-permission-actions">
                <span>Not now</span>
                <span>Allow</span>
              </span>
            </li>

            <li className="fg-reminder-state fg-reminder-state--notification">
              <span className="fg-reminder-state-label">3. Remind</span>
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
            </li>
          </ol>
        </div>
      </div>

      <div className="fg-reminder-permission">
        <strong>Notification access comes after Schedule.</strong>
        <p>Asking up front felt deceptive.</p>
      </div>

      <figcaption>
        Portfolio reconstruction of the implemented Schedule, permission, and
        notification states. The reminder is built in the prototype. It
        hasn&apos;t shown that people leave then or that a trip is safer.
      </figcaption>
    </figure>
  );
}
