type ProjectOpeningFactsProps = {
  role: string;
  scope: string;
  outcome: string;
  proof: {
    label: string;
    href: string;
  };
};

export function ProjectOpeningFacts({
  role,
  scope,
  outcome,
  proof,
}: ProjectOpeningFactsProps) {
  const facts = [
    { label: "Role", value: role },
    { label: "Scope", value: scope },
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
        <div className="project-opening-facts-row">
          <dt>Proof</dt>
          <dd className="project-opening-facts-proof">
            <a aria-label={`Proof: ${proof.label}`} href={proof.href}>
              {proof.label}
            </a>
          </dd>
        </div>
      </dl>
    </section>
  );
}
