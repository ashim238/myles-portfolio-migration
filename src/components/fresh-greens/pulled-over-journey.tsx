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
      "Four safety paths stay behind one thumb-reachable control, so navigation remains the default state.",
    alt: "The Fresh Greens safety toolkit asking What's going on? above Pulled-over, Roadside assistance, Unfamiliar area, and Share location options.",
  },
  {
    key: "reassurance",
    label: "Reassurance",
    image: "pulled-over-guidance",
    decision: "Recording starts quietly before the next decision.",
    detail:
      "The first response is reassurance, not a form. A trusted contact remains one step away.",
    alt: "The pulled-over guidance screen saying We'll walk you through what to do and confirming that recording has started.",
  },
  {
    key: "question",
    label: "Question",
    image: "pulled-over-armed",
    decision: "Regular weight keeps a necessary question from reading like an accusation.",
    detail:
      "Yes, No, and Prefer not to answer are given equal visual weight under the Held-Question rule.",
    alt: "The pulled-over flow asking Are you armed? in regular weight with Yes, No, and Prefer not to answer options.",
  },
  {
    key: "contact",
    label: "Contact",
    image: "pulled-over-contact",
    decision: "A trusted contact and the recording stay one tap away.",
    detail:
      "The final state keeps Call and Text available while making it clear that no message or location has been sent.",
    alt: "The pulled-over contact screen showing a live recording timer, the message You're not alone, a note that no message or location has been sent, and Call and Text actions for trusted contact Jordan Lee.",
  },
] as const;

const subscribeToHydration = () => () => {};

export function PulledOverJourney() {
  const [activeIndex, setActiveIndex] = useState(0);
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

  return (
    <div
      className="fg-pulled-journey"
      aria-label="The pulled-over safety sequence"
      data-enhanced={enhanced ? "true" : undefined}
    >
      <div
        className="fg-pulled-tabs"
        role="tablist"
        aria-label="Pulled-over sequence"
        ref={tabsRef}
      >
        {STEPS.map((item, index) => {
          const selected = index === activeIndex;
          return (
            <button
              type="button"
              role="tab"
              id={`fg-pulled-tab-${item.key}`}
              aria-controls={`fg-pulled-panel-${item.key}`}
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
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
            role="tabpanel"
            id={`fg-pulled-panel-${step.key}`}
            aria-labelledby={`fg-pulled-tab-${step.key}`}
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
            </div>
          </div>
        );
      })}
    </div>
  );
}
