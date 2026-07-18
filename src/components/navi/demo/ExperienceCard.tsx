import Link from "next/link";
import { Tag, Rating, ImpactSignal } from "@/components/navi/ui";
import { DemoPhoto } from "@/components/navi/demo/DemoPhoto";
import type { ExperienceSummary } from "@/lib/navi/experience-summary";

function statusBadge(tone: ExperienceSummary["tone"]) {
  if (tone === "popular") return "Popular";
  if (tone === "local") return "Locally-owned";
  return null;
}

export function ExperienceCard({
  experience: e,
  href,
}: {
  experience: ExperienceSummary;
  href: string;
}) {
  const badge = statusBadge(e.tone);
  return (
    <Link href={href} className="nv-exp-card">
      <div className="nv-exp-card-photo">
        {badge && <span className={`nv-card-badge nv-card-badge--${e.tone}`}>{badge}</span>}
        <DemoPhoto
          src={e.photos[0].src}
          alt={e.photos[0].alt}
          sizes="(max-width: 720px) calc(100vw - 32px), 340px"
        />
      </div>
      <div className="nv-exp-card-body">
        <Tag tone="neutral">{e.category}</Tag>
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
