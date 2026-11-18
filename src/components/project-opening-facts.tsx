type ProjectOpeningFactsProps = {
  role: string;
  goal: string;
  outcome: string;
  proof: {
    label: string;
    href: string;
  };
};

export function ProjectOpeningFacts({
  role,
  goal,
  outcome,
  proof,
}: ProjectOpeningFactsProps) {
  const facts = [
    { label: "Role", value: role },
    { label: "Goal", value: goal },
    { label: "Outcome", value: outcome },
  ];

  return (
    <section className="project-opening-facts" aria-label="Project summary">
      <dl className="project-opening-facts-list">
        {facts.map((fact) => (
          <div className="project-opening-facts-row" key={fact.label}>
            <dt>{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>
      <a
        className="project-opening-facts-action reader-control"
        aria-label={`Open proof: ${proof.label}`}
        href={proof.href}
      >
        <span className="project-opening-facts-action-label">Open proof</span>
        <span className="project-opening-facts-action-text">{proof.label}</span>
        <span aria-hidden="true">→</span>
      </a>
    </section>
  );
}
