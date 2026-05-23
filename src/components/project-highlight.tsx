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
      {quote ? <blockquote>{quote}</blockquote> : null}
      {metricLabel && metricValue ? (
        <p className="project-highlight-metric">
          <span>{metricValue}</span> {metricLabel}
        </p>
      ) : null}
    </section>
  );
}
