"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { ExpandableImage } from "@/components/expandable-image";
import { PhoneFrame } from "@/components/fresh-greens";

const STEPS = [
  {
    key: "toolkit",
    label: "Toolkit",
    image: "safety-toolkit",
    decision: "Starts with the driver's question.",
    detail:
      "Four paths stay behind one thumb-reachable control.",
    alt: "The Fresh Greens safety toolkit asking What's going on? above Pulled-over, Roadside assistance, Unfamiliar area, and Share location options.",
  },
  {
    key: "reassurance",
    label: "Reassurance",
    image: "pulled-over-guidance",
    decision: "Recording begins before the next decision.",
    detail:
      "Reassurance comes first, with a trusted contact one step away.",
    alt: "The pulled-over guidance screen saying We'll walk you through what to do and confirming that recording has started.",
  },
  {
    key: "question",
    label: "Question",
    image: "pulled-over-armed",
    decision: "Regular weight keeps a necessary question from reading like an accusation.",
    detail:
      "All three answers carry equal visual weight.",
    alt: "The pulled-over flow asking Are you armed? in regular weight with Yes, No, and Prefer not to answer options.",
  },
  {
    key: "contact",
    label: "Contact",
    image: "pulled-over-contact",
    decision: "Recording and trusted-contact actions remain visible.",
    detail:
      "The screen confirms that nothing has been sent.",
    alt: "The pulled-over contact screen showing a live recording timer, the message You're not alone, a note that no message or location has been sent, and Call and Text actions for trusted contact Jordan Lee.",
  },
] as const;

const ANSWERS = ["Yes", "No", "Prefer not to answer"] as const;

const subscribeToHydration = () => () => {};

export function PulledOverJourney() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [answer, setAnswer] = useState<(typeof ANSWERS)[number] | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const enhanced = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );

  function selectStep(nextIndex: number) {
    const normalized = (nextIndex + STEPS.length) % STEPS.length;
    tabsRef.current
      ?.querySelectorAll<HTMLButtonElement>("[role='tab']")
      [normalized]?.focus();
    setActiveIndex(normalized);
  }

  function restartJourney() {
    setAnswer(null);
    selectStep(0);
  }

  return (
    <div
      className="fg-pulled-journey"
      aria-label="The pulled-over safety sequence"
      data-enhanced={enhanced ? "true" : undefined}
    >
      <div className="fg-pulled-reconstruction">
        <h4 className="fg-pulled-reconstruction-title">
          Interactive case-study reconstruction
        </h4>
        <p className="fg-pulled-reconstruction-note">
          This web reconstruction shows one representative path. The native
          prototype contains the full flow.
        </p>
      </div>
      <div
        className="fg-pulled-tabs"
        role={enhanced ? "tablist" : undefined}
        aria-label="Pulled-over sequence"
        hidden={!enhanced}
        ref={tabsRef}
      >
        {STEPS.map((item, index) => {
          const selected = index === activeIndex;
          return (
            <button
              type="button"
              role={enhanced ? "tab" : undefined}
              id={`fg-pulled-tab-${item.key}`}
              aria-controls={
                enhanced ? `fg-pulled-panel-${item.key}` : undefined
              }
              aria-selected={enhanced ? selected : undefined}
              tabIndex={enhanced && selected ? 0 : -1}
              className="fg-pulled-tab"
              key={item.key}
              onClick={() => setActiveIndex(index)}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                  event.preventDefault();
                  selectStep(activeIndex + 1);
                }
                if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                  event.preventDefault();
                  selectStep(activeIndex - 1);
                }
              }}
            >
              <span className="fg-pulled-tab-number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {STEPS.map((step, index) => {
        const selected = index === activeIndex;
        return (
          <div
            className="fg-pulled-panel"
            role={enhanced ? "tabpanel" : "group"}
            id={`fg-pulled-panel-${step.key}`}
            aria-labelledby={
              enhanced ? `fg-pulled-tab-${step.key}` : undefined
            }
            aria-label={
              enhanced
                ? undefined
                : `${String(index + 1).padStart(2, "0")}. ${step.label}`
            }
            hidden={enhanced && !selected}
            key={step.key}
          >
            <div className="fg-pulled-phone">
              <PhoneFrame variant="screenshot">
                <ExpandableImage
                  src={`/projects/fresh-greens/v2/${step.image}.png`}
                  alt={step.alt}
                  width={1290}
                  height={2796}
                  sizes="(max-width: 720px) 66vw, 300px"
                  className="fg-feature-shot"
                />
              </PhoneFrame>
            </div>
            <div className="fg-pulled-copy">
              <p className="fg-pulled-state">{step.label}</p>
              <p className="fg-pulled-decision">{step.decision}</p>
              <p className="fg-pulled-detail">{step.detail}</p>
              <p className="fg-pulled-progress" aria-hidden="true">
                {String(index + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
              </p>
              <div className="fg-pulled-interaction" hidden={!enhanced}>
                {step.key === "question" ? (
                  <>
                    <fieldset className="fg-pulled-answer-options">
                      <legend className="fg-pulled-answer-legend">
                        Are you armed?
                      </legend>
                      {ANSWERS.map((option) => (
                        <label className="fg-pulled-answer-choice" key={option}>
                          <input
                            checked={answer === option}
                            className="fg-pulled-answer-input"
                            name="fg-pulled-answer"
                            onChange={() => setAnswer(option)}
                            type="radio"
                            value={option}
                          />
                          <span className="fg-pulled-answer-label">{option}</span>
                        </label>
                      ))}
                    </fieldset>
                    <p
                      aria-live="polite"
                      className="fg-pulled-answer-status"
                      role="status"
                    >
                      {answer
                        ? `You selected ${answer}.`
                        : "Choose an answer to continue."}
                    </p>
                  </>
                ) : null}
                {step.key === "contact" ? (
                  <p className="fg-pulled-contact-note">
                    This web reconstruction does not place a call, send a message,
                    or share location.
                  </p>
                ) : null}
                <div
                  aria-label={`${step.label} controls`}
                  className="fg-pulled-controls"
                  role="group"
                >
                  {index > 0 ? (
                    <button
                      className="fg-pulled-control fg-pulled-control--back"
                      onClick={() => selectStep(index - 1)}
                      type="button"
                    >
                      Back
                    </button>
                  ) : null}
                  {step.key === "contact" ? (
                    <button
                      className="fg-pulled-control fg-pulled-control--restart"
                      onClick={restartJourney}
                      type="button"
                    >
                      Restart
                    </button>
                  ) : (
                    <button
                      className="fg-pulled-control fg-pulled-control--continue"
                      disabled={step.key === "question" && answer === null}
                      onClick={() => selectStep(index + 1)}
                      type="button"
                    >
                      Continue
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
