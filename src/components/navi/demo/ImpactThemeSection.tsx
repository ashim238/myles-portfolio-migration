import { ImpactSignal } from "@/components/navi/ui";
import { ExperienceCard } from "@/components/navi/demo/ExperienceCard";
import type { ImpactSection } from "@/lib/navi/impact";

export function ImpactThemeSection({ section }: { section: ImpactSection }) {
  const count = section.experiences.length;
  return (
    <section aria-labelledby={section.anchor} className="nv-impact-theme">
      <h2 id={section.anchor} className="nv-impact-theme-head">
        {section.label}
      </h2>
      <p className="nv-impact-count">
        {count} {count === 1 ? "experience contributes" : "experiences contribute"}
      </p>
      <ul className="nv-impact-statements" aria-label={`What ${section.label} bookings fund`}>
        {section.experiences.map((e) => (
          <li key={e.slug}>
            <ImpactSignal as="div">{e.impactPhrase}</ImpactSignal>
          </li>
        ))}
      </ul>
      <ul className="nv-feed-grid" aria-label={`${section.label} experiences`}>
        {section.experiences.map((e) => (
          <li key={e.slug}>
            <ExperienceCard
              experience={e}
              href={`/work/navi/demo/experience/${e.slug}`}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
