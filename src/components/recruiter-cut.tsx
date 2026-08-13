type RecruiterCutProps = {
  team?: string;
  timeline: string;
  tools?: string;
  moves: string[];
};

export function RecruiterCut({
  team,
  timeline,
  tools,
  moves,
}: RecruiterCutProps) {
  const facts = [
    team ? { label: "Team", value: team } : null,
    { label: "Timeline", value: timeline },
    tools ? { label: "Tools", value: tools } : null,
  ].filter((fact): fact is NonNullable<typeof fact> => fact !== null);

  return (
    <section className="case-cut" aria-label="At a glance">
      <dl className="case-cut-facts">
        {facts.map((fact) => (
          <div className="case-cut-row" key={fact.label}>
            <dt>{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>
      {moves.length > 0 ? (
        <div className="case-cut-moves">
          <p className="case-cut-moves-label">Key moves</p>
          <ul role="list">
            {moves.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
