import { CountUp } from "@/components/count-up";

type ProjectHighlightProps = {
  quote?: string;
  metricLabel?: string;
  metricValue?: string;
};

export function ProjectHighlight({
  quote,
  metricLabel,
  metricValue,
}: ProjectHighlightProps) {
  if (!quote && !(metricLabel && metricValue)) {
    return null;
  }

  return (
    <section className="project-highlight" aria-label="Project highlight">
      {quote ? (
        <figure className="project-highlight-quote">
          <blockquote>{quote}</blockquote>
        </figure>
      ) : null}
      {metricLabel && metricValue ? (
        <p className="project-highlight-metric">
          <span className="project-highlight-metric-value">
            <CountUp value={metricValue} />
          </span>
          <span className="project-highlight-metric-label">{metricLabel}</span>
        </p>
      ) : null}
    </section>
  );
}
