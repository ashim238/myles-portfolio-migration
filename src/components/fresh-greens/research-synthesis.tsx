"use client";

import Image from "next/image";
import { useRef, useState, useSyncExternalStore } from "react";
import { SYNTHESIS } from "@/lib/fresh-greens/research-synthesis-data";

const GLYPH: Record<string, string> = {
  light: "/projects/fresh-greens/process/glyph-light.svg",
  police: "/projects/fresh-greens/process/glyph-police.svg",
  wildlife: "/projects/fresh-greens/process/glyph-wildlife.svg",
  road: "/projects/fresh-greens/process/glyph-road.svg",
};

const subscribeToHydration = () => () => {};

/**
 * The honest synthesis: recurring trends pulled from six driver interviews,
 * clustered into the four routing markers plus the community-data bet. Every
 * snippet is anonymized. Static and visible by default — no JS-gated reveal.
 */
export function ResearchSynthesis() {
  const markers = SYNTHESIS.filter((c) => c.key !== "community");
  const community = SYNTHESIS.find((c) => c.key === "community")!;
  const [activeKey, setActiveKey] = useState(markers[0].key);
  const tabsRef = useRef<HTMLDivElement>(null);
  const enhanced = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );

  function moveTab(currentIndex: number, direction: 1 | -1) {
    const nextIndex = (currentIndex + direction + markers.length) % markers.length;
    tabsRef.current
      ?.querySelectorAll<HTMLButtonElement>("[role='tab']")
      [nextIndex]?.focus();
    setActiveKey(markers[nextIndex].key);
  }

  return (
    <div
      className="fg-synth"
      aria-label="What the six interviews surfaced"
      data-enhanced={enhanced ? "true" : undefined}
    >
      <div
        className="fg-synth-tabs"
        role={enhanced ? "tablist" : undefined}
        aria-label="Interview signals"
        hidden={!enhanced}
        ref={tabsRef}
      >
        {markers.map((marker, index) => {
          const selected = marker.key === activeKey;
          return (
            <button
              type="button"
              role={enhanced ? "tab" : undefined}
              id={`fg-synth-tab-${marker.key}`}
              aria-controls={
                enhanced ? `fg-synth-panel-${marker.key}` : undefined
              }
              aria-selected={enhanced ? selected : undefined}
              tabIndex={enhanced && selected ? 0 : -1}
              className="fg-synth-tab"
              key={marker.key}
              onClick={() => setActiveKey(marker.key)}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight") {
                  event.preventDefault();
                  moveTab(index, 1);
                }
                if (event.key === "ArrowLeft") {
                  event.preventDefault();
                  moveTab(index, -1);
                }
              }}
              aria-label={`${marker.label}, ${marker.raisedBy} of 6 interviews`}
            >
              {GLYPH[marker.key] ? (
                <Image
                  src={GLYPH[marker.key]}
                  alt=""
                  width={26}
                  height={26}
                  className="fg-synth-glyph"
                />
              ) : null}
              <span className="fg-synth-tab-copy">
                <span className="fg-synth-label">{marker.label}</span>
                <span className="fg-synth-count">{marker.raisedBy}/6</span>
              </span>
            </button>
          );
        })}
      </div>

      {markers.map((marker) => {
        const selected = marker.key === activeKey;
        return (
          <div
            className="fg-synth-panel"
            role={enhanced ? "tabpanel" : "group"}
            id={`fg-synth-panel-${marker.key}`}
            aria-labelledby={
              enhanced ? `fg-synth-tab-${marker.key}` : undefined
            }
            aria-label={
              enhanced
                ? undefined
                : `${marker.label}, raised by ${marker.raisedBy} of 6 interviews`
            }
            hidden={enhanced && !selected}
            key={marker.key}
          >
            <div className="fg-synth-evidence">
              <p className="fg-synth-panel-label">What I heard</p>
              <p className="fg-synth-insight">{marker.insight}</p>
              <ul className="fg-synth-snippets" role="list">
                {marker.snippets.map((snippet) => (
                  <li key={snippet}>{snippet}</li>
                ))}
              </ul>
            </div>
            <span className="fg-synth-transform-arrow" aria-hidden="true">→</span>
            <div className="fg-synth-response">
              <p className="fg-synth-panel-label">What I designed</p>
              <p>{marker.designResponse}</p>
            </div>
          </div>
        );
      })}

      <div className="fg-synth-community">
        <div>
          <p className="fg-synth-panel-label">
            Raised by {community.raisedBy} of 6 Black drivers
          </p>
          <p className="fg-synth-label">{community.label}</p>
          <p className="fg-synth-insight">{community.insight}</p>
        </div>
        <span className="fg-synth-transform-arrow" aria-hidden="true">→</span>
        <p className="fg-synth-community-response">{community.designResponse}</p>
      </div>
    </div>
  );
}
