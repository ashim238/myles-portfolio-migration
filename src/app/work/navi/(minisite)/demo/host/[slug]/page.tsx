import Link from "next/link";
import { notFound } from "next/navigation";
import { use } from "react";
import { Avatar, Rating } from "@/components/navi/ui";
import { ExperienceCard } from "@/components/navi/demo/ExperienceCard";
import {
  getHostBySlug,
  hostAggregate,
  experiencesByHost,
  type Host,
} from "@/lib/navi/hosts";

function neighborhoodSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function HostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const host = getHostBySlug(slug);
  if (!host) notFound();
  return <HostView host={host} />;
}

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
        <Avatar name={host.name} size="lg" src={host.avatarSrc} />
        <div className="nv-host-headtext">
          <h1>{host.name}</h1>
          <p className="nv-host-meta">
            {host.neighborhood} &nbsp;·&nbsp; Hosting for {host.yearsHosting} years &nbsp;·&nbsp;{" "}
            {host.responseRate}% reply rate
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
      <p className="nv-host-footer">
        <Link href={`/work/navi/demo/neighborhood/${nbSlug}`}>
          Based in {host.neighborhood} →
        </Link>
      </p>
    </article>
  );
}
