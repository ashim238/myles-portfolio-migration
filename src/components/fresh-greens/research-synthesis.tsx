import Image from "next/image";
import {
  SYNTHESIS,
  FEATURE_REQUESTS,
} from "@/lib/fresh-greens/research-synthesis-data";

const GLYPH: Record<string, string> = {
  light: "/projects/fresh-greens/process/glyph-light.svg",
  police: "/projects/fresh-greens/process/glyph-police.svg",
  wildlife: "/projects/fresh-greens/process/glyph-wildlife.svg",
  road: "/projects/fresh-greens/process/glyph-road.svg",
};

/**
 * The honest synthesis: recurring trends pulled from six driver interviews,
 * clustered into the four routing markers plus the community-data bet. Every
 * snippet is anonymized. Static and visible by default — no JS-gated reveal.
 */
export function ResearchSynthesis() {
  const markers = SYNTHESIS.filter((c) => c.key !== "community");
  const community = SYNTHESIS.find((c) => c.key === "community")!;

  return (
    <div className="fg-synth" aria-label="What the six interviews surfaced">
      <ul className="fg-synth-markers" role="list">
        {markers.map((c) => (
          <li key={c.key} className="fg-synth-marker">
            <div className="fg-synth-marker-head">
              {GLYPH[c.key] ? (
                <Image
                  src={GLYPH[c.key]}
                  alt=""
                  width={26}
                  height={26}
                  className="fg-synth-glyph"
                />
              ) : null}
              <p className="fg-synth-label">{c.label}</p>
              <p className="fg-synth-count">{c.raisedBy}/6</p>
            </div>
            <p className="fg-synth-insight">{c.insight}</p>
            <ul className="fg-synth-snippets" role="list">
              {c.snippets.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <div className="fg-synth-community">
        <p className="fg-synth-label">{community.label}</p>
        <p className="fg-synth-insight">{community.insight}</p>
        <ul className="fg-synth-snippets" role="list">
          {community.snippets.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>

      <div className="fg-synth-asked">
        <p className="fg-synth-asked-label">They asked for it, unprompted</p>
        <ul role="list">
          {FEATURE_REQUESTS.map((r) => (
            <li key={r.became} className="fg-synth-asked-row">
              <span className="fg-synth-asked-quote">
                &ldquo;{r.asked}&rdquo;
              </span>
              <span className="fg-synth-asked-arrow" aria-hidden="true">
                &rarr;
              </span>
              <span className="fg-synth-asked-became">{r.became}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
