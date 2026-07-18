"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { ExperienceCard } from "@/components/navi/demo/ExperienceCard";
import { Map } from "@/components/navi/demo/Map";
import { Avatar } from "@/components/navi/ui";
import { motionSafeScrollBehavior } from "@/lib/navi/motion";
import {
  experiencesByNeighborhood,
  hostsByNeighborhood,
  neighborhoodCentroid,
  type Neighborhood,
} from "@/lib/navi/neighborhoods";

export function NeighborhoodView({ neighborhood: n }: { neighborhood: Neighborhood }) {
  const experiences = experiencesByNeighborhood(n.slug);
  const hosts = hostsByNeighborhood(n.slug);
  const centroid = neighborhoodCentroid(n.slug);
  // Sticky selection from a pin click. Persists so users still see which card
  // the pin maps to after the scroll lands.
  const [picked, setPicked] = useState<string | undefined>(undefined);
  const pulseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onPinSelect = useCallback((id: string) => {
    setPicked(id);
    const el = document.getElementById(`nb-experience-${id}`);
    if (!el) return;
    el.scrollIntoView({ behavior: motionSafeScrollBehavior(), block: "center" });
    el.dataset.pulse = "true";
    if (pulseTimer.current) clearTimeout(pulseTimer.current);
    pulseTimer.current = setTimeout(() => {
      delete el.dataset.pulse;
    }, 1400);
  }, []);

  return (
    <article className="nv-neighborhood">
      <p className="nv-neighborhood-back">
        <Link href="/work/navi/demo/search">← Back to results</Link>
      </p>
      <header className="nv-neighborhood-head">
        <h1>{n.name}</h1>
        <p className="nv-neighborhood-borough">{n.borough}</p>
      </header>
      <p className="nv-neighborhood-intro">{n.intro}</p>
      {centroid && (
        <div className="nv-neighborhood-map">
          <Map
            center={centroid}
            zoom={14}
            markers={experiences.map((experience) => ({
              id: experience.slug,
              lat: experience.lat,
              lng: experience.lng,
              label: experience.title,
              accessibleLabel: `${experience.title} location`,
            }))}
            selectedId={picked}
            onSelect={onPinSelect}
          />
        </div>
      )}
      <section aria-labelledby="nb-experiences-heading" className="nv-neighborhood-experiences">
        <h2 id="nb-experiences-heading">Experiences in {n.name}</h2>
        <ul className="nv-feed-grid" aria-label={`Experiences in ${n.name}`}>
          {experiences.map((experience) => (
            <li key={experience.slug} id={`nb-experience-${experience.slug}`}>
              <ExperienceCard
                experience={experience}
                href={`/work/navi/demo/experience/${experience.slug}`}
              />
            </li>
          ))}
        </ul>
      </section>
      {hosts.length > 0 && (
        <section aria-labelledby="nb-hosts-heading" className="nv-neighborhood-hosts">
          <h2 id="nb-hosts-heading">Hosts based here</h2>
          <ul className="nv-neighborhood-hosts-row" aria-label={`Hosts based in ${n.name}`}>
            {hosts.map((host) => (
              <li key={host.slug}>
                <Link
                  href={`/work/navi/demo/host/${host.slug}`}
                  className="nv-neighborhood-host"
                >
                  <Avatar name={host.name} size="md" src={host.avatarSrc} decorative />
                  <span>{host.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
