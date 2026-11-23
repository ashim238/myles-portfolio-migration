import Image from "next/image";
import { SYNTHESIS } from "@/lib/fresh-greens/research-synthesis-data";

const participants = 6;
const routeConditions = SYNTHESIS.filter(({ key }) => key !== "community")
  .sort((a, b) => b.raisedBy - a.raisedBy);
const community = SYNTHESIS.find(({ key }) => key === "community")!;

export function InterviewFindings() {
  return (
    <figure className="fg-interview-findings" aria-label="What six drivers told me">
      <div className="fg-evidence-boundaries">
        <section className="fg-evidence-boundary fg-finding-plan" aria-labelledby="fg-finding-plan">
          <h3 className="fg-evidence-label" id="fg-finding-plan">Plan</h3>
          <p className="fg-finding-title">Conditions drivers wanted to compare</p>
          <ul className="fg-condition-counts" aria-label="Drivers who mentioned each condition" role="list">
            {routeConditions.map(({ key, label, raisedBy }) => (
              <li key={key}>
                <span>{key === "light" ? "Daylight" : label}</span>
                <span className="fg-count-track" aria-hidden="true">
                  {Array.from({ length: participants }, (_, i) => (
                    <i key={i} className={i < raisedBy ? "fg-count-filled" : undefined} />
                  ))}
                </span>
                <span className="fg-count-total">{raisedBy} of {participants}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="fg-evidence-boundary fg-finding-respond" aria-labelledby="fg-finding-respond">
          <h3 className="fg-evidence-label" id="fg-finding-respond">Respond</h3>
          <Image src="/projects/fresh-greens/process/safety-pulled-over.svg" width={48} height={48} alt="" />
          <p>Drivers described preparing for <strong>police encounters</strong> and keeping help within reach.</p>
        </section>
        <section className="fg-evidence-boundary fg-finding-trust" aria-labelledby="fg-finding-trust">
          <h3 className="fg-evidence-label" id="fg-finding-trust">Trust</h3>
          <p><strong className="fg-trust-count">{community.raisedBy} <small>of {participants}</small></strong>{" "}
            asked <strong>family or friends</strong> before trusting an unfamiliar place.</p>
        </section>
      </div>
      <figcaption>Six interviews can&apos;t represent every Black driver.</figcaption>
    </figure>
  );
}
