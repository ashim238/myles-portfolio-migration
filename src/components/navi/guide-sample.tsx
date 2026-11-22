import Image from "next/image";
import { getExperienceBySlug } from "@/lib/navi/demo-data";

export function GuideSample({ stage }: { stage: "Learn" | "Plan" | "Go" }) {
  const listing = getExperienceBySlug("prospect-park-carriage");
  if (!listing) return null;

  if (stage === "Learn") {
    const photo = listing.photos[0];
    return <div className="nv-sample nv-sample-photo">
      <div className="nv-sample-scene">
        <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 700px) 90vw, 290px" />
      </div>
      <div className="nv-sample-caption">{listing.neighborhood} · {listing.borough}</div>
    </div>;
  }

  if (stage === "Plan") {
    return <div className="nv-sample nv-sample-ticket">
      <div className="nv-ticket-face">
        <div className="nv-ticket-price"><strong>${listing.price}</strong> per guest</div>
        <p><b>What to bring</b> {listing.plan.bring}</p>
      </div>
      <div className="nv-sample-caption">{listing.duration} · {listing.groupSize}</div>
    </div>;
  }

  const subway = listing.go.transit.find(option => option.mode === "subway");
  const walk = listing.go.transit.find(option => option.mode === "walk");
  return <div className="nv-sample nv-sample-sign">
    <div className="nv-sign-face">
      {subway && <>
        <span className="nv-sign-heading">By subway</span>
        <div className="nv-sign-lines" aria-hidden="true">
          {subway.detail.split(" or ").map(line => <span key={line}>{line}</span>)}
        </div>
        <span className="sr-only">{subway.detail}</span>
      </>}
    </div>
    {walk && <div className="nv-sample-caption">{walk.label} · {walk.detail}</div>}
  </div>;
}
