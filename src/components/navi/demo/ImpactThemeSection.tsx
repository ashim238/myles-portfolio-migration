import { ImpactSignal } from "@/components/navi/ui";
import { ExperienceCard } from "@/components/navi/demo/ExperienceCard";
import type { ImpactSection } from "@/lib/navi/impact";

export function ImpactThemeSection({ section }: { section: ImpactSection }) {
  const count = section.experiences.length;
  return (
    <section aria-labelledby={`${section.anchor}-heading`} className="nv-impact-theme">
      <h2 id={section.anchor} className="nv-impact-theme-head">
        {section.label}
      </h2>
      {/* visually-hidden duplicate so the region's accessible name is the label,
          while the visible heading carries the cross-link anchor id */}
      <span id={`${section.anchor}-heading`} hidden>
        {section.label}
      </span>
      <p className="nv-impact-count">
        {count} {count === 1 ? "experience contributes" : "experiences contribute"}
      </p>
      <ul className="nv-impact-statements" aria-label={`What ${section.label} bookings fund`}>
        {section.experiences.map((e) => (
          <li key={e.slug}>
            <ImpactSignal as="div">{e.impactStatement}</ImpactSignal>
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
