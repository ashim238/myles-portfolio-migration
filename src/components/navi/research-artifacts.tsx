import {
  evidenceSurfaceData,
  NAVI_RESEARCH_EVIDENCE_SURFACE,
} from "@/lib/project-evidence";
import {
  NAVI_ARCHETYPES,
  NAVI_BOOKING_STEPS,
  NAVI_JOURNEY_STAGES,
} from "@/lib/navi/research-artifacts";

export function NaviResearchArtifacts(): React.JSX.Element {
  return (
    <section
      className="nv-research-artifacts nv-reveal"
      aria-labelledby="nv-research-board-title"
      {...evidenceSurfaceData(NAVI_RESEARCH_EVIDENCE_SURFACE)}
    >
      <div className="nv-research-board">
        <header className="nv-research-board-head">
          <h3 id="nv-research-board-title">Research and product scope</h3>
          <p>Each row connects a finding to the product area it affected.</p>
        </header>

        <figure
          aria-label="Research-informed archetypes"
          className="nv-research-artifact"
        >
          <figcaption>
            Research-informed archetypes
            <span>
              Resident and stakeholder survey, platform audits, and secondary
              research
            </span>
          </figcaption>
          <ol className="nv-research-archetypes">
            {NAVI_ARCHETYPES.map((archetype) => (
              <li
                data-archetype-id={archetype.id}
                data-scope={archetype.scope}
                key={archetype.id}
              >
                <h4>{archetype.name}</h4>
                <dl className="nv-research-archetype-details">
                  <div>
                    <dt>Need</dt>
                    <dd>{archetype.need}</dd>
                  </div>
                  <div>
                    <dt>Product area</dt>
                    <dd>{archetype.productArea}</dd>
                  </div>
                  <div>
                    <dt>Scope</dt>
                    <dd>
                      <span>{archetype.scope}</span>
                    </dd>
                  </div>
                </dl>
              </li>
            ))}
          </ol>
        </figure>

        <figure aria-label="Journey-map excerpt" className="nv-research-artifact">
          <figcaption>
            Journey-map excerpt
            <span>Internal planning artifact</span>
          </figcaption>
          <div
            className="nv-research-route nv-research-route--journey"
            aria-hidden="true"
          />
          <ol className="nv-research-journey">
            {NAVI_JOURNEY_STAGES.map((stage) => (
              <li data-stage-id={stage.id} key={stage.id}>
                <h4>{stage.label}</h4>
                <dl className="nv-research-lane-details">
                  <div>
                    <dt>Traveler moment</dt>
                    <dd>{stage.action}</dd>
                  </div>
                  <div>
                    <dt>Product need</dt>
                    <dd>{stage.productNeed}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ol>
        </figure>

        <figure
          aria-label="Individual booking-flow excerpt"
          className="nv-research-artifact"
        >
          <figcaption>
            Individual booking-flow excerpt
            <span>Airbnb audit and secondary research</span>
          </figcaption>
          <div
            className="nv-research-route nv-research-route--booking"
            aria-hidden="true"
          />
          <ol className="nv-research-booking">
            {NAVI_BOOKING_STEPS.map((step, index) => (
              <li
                data-step-id={step.id}
                data-decision-point={
                  step.id === "cost" ? "cost-review" : undefined
                }
                key={step.id}
              >
                <span className="nv-research-step" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h4>{step.label}</h4>
                <p>{step.detail}</p>
              </li>
            ))}
          </ol>
        </figure>
      </div>
    </section>
  );
}
