import Image from "next/image";
import { getExperienceBySlug } from "@/lib/navi/demo-data";

export function GuideSample({ stage }: { stage: "Learn" | "Plan" | "Go" }) {
  const listing = getExperienceBySlug("prospect-park-carriage");
  if (!listing) return null;
  if (stage === "Learn") {
    return <div className="nv-sample nv-sample-photo">
      <Image src={listing.photos[0].src} alt={listing.photos[0].alt} fill sizes="(max-width: 650px) 80vw, 270px" />
      <span>{listing.neighborhood} · {listing.borough}</span>
    </div>;
  }
  if (stage === "Plan") {
    return <div className="nv-sample nv-sample-list">
      <strong>What to bring</strong><p>{listing.plan.bring}</p>
    </div>;
  }
  return <div className="nv-sample nv-sample-transit">
    <strong>Getting there</strong>
    <dl>{listing.go.transit.filter(option => option.mode === "subway" || option.mode === "walk").map(option =>
      <div key={option.mode}><dt>{option.mode === "subway" ? "Subway" : "Walk"}</dt><dd>{option.detail}</dd></div>
    )}</dl>
  </div>;
}
