import { CountUp } from "@/components/count-up";

type RecruiterCutProps = {
  role: string;
  contribution?: string;
  team?: string;
  timeline: string;
  stack?: string;
  stackLabel?: string;
  outcomeValue?: string;
  outcomeLabel?: string;
  moves: string[];
};

export function RecruiterCut({
  role, contribution, team, timeline, stack, stackLabel = "Stack", outcomeValue, outcomeLabel, moves,
}: RecruiterCutProps) {
  const supportingFact = team
    ? { label: "Team", value: team }
    : contribution
      ? { label: "Contribution", value: contribution }
      : stack
        ? { label: stackLabel, value: stack }
        : null;
  const facts = [
    { label: "Role", value: role },
    supportingFact,
    { label: "Timeline", value: timeline },
    outcomeValue && outcomeLabel
      ? {
          label: "Outcome",
          value: (
            <>
              <span className="case-cut-metric"><CountUp value={outcomeValue} /></span>{" "}
              {outcomeLabel}
            </>
          ),
        }
      : supportingFact?.label !== stackLabel && stack
        ? { label: stackLabel, value: stack }
        : null,
  ].filter((fact): fact is NonNullable<typeof fact> => fact !== null);

  return (
    <section className="case-cut" aria-label="At a glance">
      <dl className="case-cut-facts">
        {facts.map((fact) => (
          <div
            className={`case-cut-row${fact.label === "Outcome" ? " case-cut-outcome" : ""}`}
            key={fact.label}
          >
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
