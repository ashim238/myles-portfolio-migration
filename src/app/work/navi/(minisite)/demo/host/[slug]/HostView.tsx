import Link from "next/link";
import { ExperienceCard } from "@/components/navi/demo/ExperienceCard";
import { Avatar, Rating } from "@/components/navi/ui";
import {
  experiencesByHost,
  hostAggregate,
  type Host,
} from "@/lib/navi/hosts";
import { neighborhoodSlug } from "@/lib/navi/neighborhoods";

export function HostView({ host }: { host: Host }) {
  const agg = hostAggregate(host.slug);
  const experiences = experiencesByHost(host.slug);
  const nbSlug = neighborhoodSlug(host.neighborhood);

  return (
    <article className="nv-host">
      <p className="nv-host-back">
        <Link href="/work/navi/demo/search">← Back to results</Link>
      </p>
      <header className="nv-host-head">
        <Avatar name={host.name} size="lg" src={host.avatarSrc} decorative />
        <div className="nv-host-headtext">
          <h1>{host.name}</h1>
          <p className="nv-host-meta">
            <span>{host.neighborhood}</span>
            <span aria-hidden="true"> · </span>
            <span>Hosting for {host.yearsHosting} years</span>
            <span aria-hidden="true"> · </span>
            <span>{host.responseRate}% reply rate</span>
          </p>
        </div>
      </header>
      <p className="nv-host-bio">{host.bio}</p>
      {agg.reviewCount > 0 && (
        <p className="nv-host-rating">
          <Rating value={Number(agg.averageRating.toFixed(2))} reviews={agg.reviewCount} />{" "}
          average across {agg.experienceCount}{" "}
          {agg.experienceCount === 1 ? "experience" : "experiences"}
        </p>
      )}
      <section aria-labelledby="host-experiences-heading" className="nv-host-experiences">
        <h2 id="host-experiences-heading">Experiences from {host.name}</h2>
        <ul className="nv-feed-grid" aria-label={`Experiences from ${host.name}`}>
          {experiences.map((experience) => (
            <li key={experience.slug}>
              <ExperienceCard
                experience={experience}
                href={`/work/navi/demo/experience/${experience.slug}`}
              />
            </li>
          ))}
        </ul>
      </section>
      <p className="nv-host-footer">
        <Link href={`/work/navi/demo/neighborhood/${nbSlug}`}>
          Based in {host.neighborhood} →
        </Link>
      </p>
    </article>
  );
}
