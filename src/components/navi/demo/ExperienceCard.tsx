import Link from "next/link";
import { Tag, Rating, ImpactSignal } from "@/components/navi/ui";
import { DemoPhoto } from "@/components/navi/demo/DemoPhoto";
import { tagLabelFor } from "@/lib/navi/demo-data";
import type { Experience } from "@/lib/navi/demo-data";

export function ExperienceCard({
  experience: e,
  href,
}: {
  experience: Experience;
  href: string;
}) {
  return (
    <Link href={href} className="nv-exp-card">
      <div className="nv-exp-card-photo">
        <DemoPhoto src={e.photos[0].src} alt={e.photos[0].alt} />
      </div>
      <div className="nv-exp-card-body">
        <Tag tone={e.tone}>
          {tagLabelFor(e)}
        </Tag>
        <h3 className="nv-exp-card-title">{e.title}</h3>
        <p className="nv-exp-card-loc">
          {e.neighborhood}, {e.borough}
        </p>
        <p className="nv-exp-card-facts">
          {e.duration} · {e.groupSize}
        </p>
        <Rating value={e.rating} reviews={e.reviews} />
        <ImpactSignal>{e.impactPhrase}</ImpactSignal>
        <p className="nv-exp-card-price">
          {e.price === 0 ? "Free" : `$${e.price} per person`}
        </p>
      </div>
    </Link>
  );
}
