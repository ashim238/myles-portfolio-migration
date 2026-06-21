"use client";

import Link from "next/link";
import { Tag, Rating, ImpactSignal } from "@/components/navi/ui";
import { DemoPhoto } from "@/components/navi/demo/DemoPhoto";
import type { Experience } from "@/lib/navi/demo-data";

function statusBadge(tone: Experience["tone"]) {
  if (tone === "popular") return "Popular";
  if (tone === "local") return "Locally-owned";
  return null;
}

export function ResultCard({
  experience: e,
  href,
  onHover,
}: {
  experience: Experience;
  href: string;
  onHover?: (slug: string | undefined) => void;
}) {
  const badge = statusBadge(e.tone);
  return (
    <Link
      href={href}
      className="nv-result"
      onMouseEnter={() => onHover?.(e.slug)}
      onMouseLeave={() => onHover?.(undefined)}
      onFocus={() => onHover?.(e.slug)}
      onBlur={() => onHover?.(undefined)}
    >
      <div className="nv-result-photo">
        {badge && <span className={`nv-card-badge nv-card-badge--${e.tone}`}>{badge}</span>}
        <DemoPhoto src={e.photos[0].src} alt={e.photos[0].alt} />
      </div>
      <div className="nv-result-body">
        <Tag tone="neutral">{e.category}</Tag>
        <h3 className="nv-result-title">{e.title}</h3>
        <p className="nv-result-loc">
          {e.neighborhood}, {e.borough}
        </p>
        <Rating value={e.rating} reviews={e.reviews} />
        <ImpactSignal>{e.impactPhrase}</ImpactSignal>
        <p className="nv-result-price">
          {e.price === 0 ? "Free" : `$${e.price} per person`}
        </p>
      </div>
    </Link>
  );
}
