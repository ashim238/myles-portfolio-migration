import { CountUp } from "@/components/count-up";

type RecruiterCutProps = {
  problem: string;
  role: string;
  contribution?: string;
  team?: string;
  feedback?: string;
  timeline: string;
  stack: string;
  stackLabel?: string;
  outcomeValue?: string;
  outcomeLabel?: string;
  moves: string[];
};

export function RecruiterCut({
  problem, role, contribution, team, feedback, timeline, stack, stackLabel = "Stack", outcomeValue, outcomeLabel, moves,
}: RecruiterCutProps) {
  return (
    <section className="case-cut" aria-label="At a glance">
      <dl className="case-cut-facts">
        <div className="case-cut-row"><dt>Problem</dt><dd>{problem}</dd></div>
        <div className="case-cut-row"><dt>Role</dt><dd>{role}</dd></div>
        {contribution ? (
          <div className="case-cut-row"><dt>Contribution</dt><dd>{contribution}</dd></div>
        ) : null}
        {team ? (
          <div className="case-cut-row"><dt>Team</dt><dd>{team}</dd></div>
        ) : null}
        {feedback ? (
          <div className="case-cut-row"><dt>Feedback</dt><dd>{feedback}</dd></div>
        ) : null}
        <div className="case-cut-row"><dt>Timeline</dt><dd>{timeline}</dd></div>
        <div className="case-cut-row"><dt>{stackLabel}</dt><dd>{stack}</dd></div>
        {outcomeValue && outcomeLabel ? (
          <div className="case-cut-row case-cut-outcome">
            <dt>Outcome</dt>
            <dd>
              <span className="case-cut-metric"><CountUp value={outcomeValue} /></span> {outcomeLabel}
            </dd>
          </div>
        ) : null}
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
