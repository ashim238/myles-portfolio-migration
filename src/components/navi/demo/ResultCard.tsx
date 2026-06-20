"use client";

import Link from "next/link";
import { Tag, Rating, ImpactSignal } from "@/components/navi/ui";
import type { Experience } from "@/lib/navi/demo-data";

export function ResultCard({
  experience: e,
  href,
  onHover,
}: {
  experience: Experience;
  href: string;
  onHover?: (slug: string) => void;
}) {
  return (
    <Link
      href={href}
      className="nv-result"
      onMouseEnter={() => onHover?.(e.slug)}
      onFocus={() => onHover?.(e.slug)}
    >
      <div className="nv-result-photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={e.photos[0].src} alt={e.photos[0].alt} />
      </div>
      <div className="nv-result-body">
        <Tag tone={e.tone}>
          {e.tone === "local" ? "Locally-owned" : e.tone === "popular" ? "Popular" : e.category}
        </Tag>
        <h3 className="nv-result-title">{e.title}</h3>
        <p className="nv-result-loc">
          {e.neighborhood}, {e.borough}
        </p>
        <Rating value={e.rating} reviews={e.reviews} />
        <ImpactSignal>{e.impactPhrase}</ImpactSignal>
        <p className="nv-result-price">${e.price} per person</p>
      </div>
    </Link>
  );
}
