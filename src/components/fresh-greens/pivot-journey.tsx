import { PhoneFrame } from "@/components/fresh-greens";
import { ExpandableImage } from "@/components/expandable-image";

/**
 * The design-direction pivot: v1 borrowed Google Maps (Fresh Greens imagined
 * as a plugin), then broke away into its own build. Two staged shots, the
 * borrowed idiom against the distinct result, each with a one-line rationale.
 */
export function PivotJourney() {
  return (
    <div
      className="fg-pivot"
      aria-label="From a Google Maps feature to a standalone app"
    >
      <ol className="fg-pivot-steps" role="list">
        <li className="fg-pivot-step fg-pivot-step--v1">
          <p className="fg-pivot-step-label">First pass</p>
          <div className="fg-pivot-canvas">
            <ExpandableImage
              src="/projects/fresh-greens/process/pivot-google-v1-tile.png"
              alt="An early Figma flow from when Fresh Greens was designed as a Google Maps feature: a route-overview card beside six turn-by-turn screens with a green Head South banner and Google's map chrome."
              width={790}
              height={250}
              sizes="(max-width: 768px) 92vw, 680px"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>
          <p className="fg-pivot-caption">
            At first I imagined Fresh Greens as a feature inside Google Maps, so
            v1 was built in Google&apos;s own turn cards and chrome. That moved
            fast, and it capped the whole idea at Google Maps with a few extra
            pins.
          </p>
        </li>

        <li className="fg-pivot-step fg-pivot-step--v2">
          <p className="fg-pivot-step-label">The break</p>
          <div className="fg-pivot-phone">
            <PhoneFrame variant="screenshot">
              <ExpandableImage
                src="/projects/fresh-greens/v2/route-preview.png"
                alt="The distinct Fresh Greens route preview: a daylight-graded route line with a sun-to-moon legend, an All clear safety chip, a note that a station you trust is on the route, and a green Go button on a warm surface."
                width={1290}
                height={2796}
                sizes="(max-width: 768px) 62vw, 300px"
                className="fg-feature-shot"
              />
            </PhoneFrame>
          </div>
          <p className="fg-pivot-caption">
            Rebuilding it as its own app is what let the safety signals become
            the interface. The route preview grades the road by daylight, reads
            safety at a glance, flags a station you trust, and carries its own
            glyphs on the warm surfaces.
          </p>
        </li>
      </ol>
    </div>
  );
}
