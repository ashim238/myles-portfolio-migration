import Link from "next/link";
import { notFound } from "next/navigation";
import { use } from "react";
import { Avatar } from "@/components/navi/ui";
import { ExperienceCard } from "@/components/navi/demo/ExperienceCard";
import { Map } from "@/components/navi/demo/Map";
import {
  getNeighborhoodBySlug,
  experiencesByNeighborhood,
  neighborhoodCentroid,
  hostsByNeighborhood,
  type Neighborhood,
} from "@/lib/navi/neighborhoods";

export default function NeighborhoodPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const neighborhood = getNeighborhoodBySlug(slug);
  if (!neighborhood) notFound();
  return <NeighborhoodView neighborhood={neighborhood} />;
}

export function NeighborhoodView({ neighborhood: n }: { neighborhood: Neighborhood }) {
  const experiences = experiencesByNeighborhood(n.slug);
  const hosts = hostsByNeighborhood(n.slug);
  const centroid = neighborhoodCentroid(n.slug);
  return (
    <article className="nv-neighborhood">
      <p className="nv-neighborhood-back">
        <Link href="/work/navi/demo/search">&larr; Back to results</Link>
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
            markers={experiences.map((e) => ({
              id: e.slug,
              lat: e.lat,
              lng: e.lng,
              label: e.title,
            }))}
          />
        </div>
      )}
      <section aria-labelledby="nb-experiences-heading" className="nv-neighborhood-experiences">
        <h2 id="nb-experiences-heading">Experiences in {n.name}</h2>
        <ul className="nv-feed-grid" aria-label={`Experiences in ${n.name}`}>
          {experiences.map((e) => (
            <li key={e.slug}>
              <ExperienceCard
                experience={e}
                href={`/work/navi/demo/experience/${e.slug}`}
              />
            </li>
          ))}
        </ul>
      </section>
      {hosts.length > 0 && (
        <section aria-labelledby="nb-hosts-heading" className="nv-neighborhood-hosts">
          <h2 id="nb-hosts-heading">Hosts based here</h2>
          <ul className="nv-neighborhood-hosts-row" aria-label={`Hosts based in ${n.name}`}>
            {hosts.map((h) => (
              <li key={h.slug}>
                <Link href={`/work/navi/demo/host/${h.slug}`} className="nv-neighborhood-host">
                  <Avatar name={h.name} size="md" src={h.avatarSrc} />
                  <span>{h.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
