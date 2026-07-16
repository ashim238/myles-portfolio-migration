import {
  NAVI_ARCHETYPES,
  NAVI_BOOKING_STEPS,
  NAVI_JOURNEY_STAGES,
} from "@/lib/navi/research-artifacts";

export function NaviResearchArtifacts(): React.JSX.Element {
  return (
    <div className="nv-research-artifacts nv-reveal">
      <figure aria-label="Research-informed archetypes" className="nv-research-artifact">
        <figcaption>Research-informed archetypes</figcaption>
        <ol className="nv-research-archetypes">
          {NAVI_ARCHETYPES.map((archetype) => (
            <li
              data-archetype-id={archetype.id}
              data-scope={archetype.scope}
              key={archetype.id}
            >
              <h3>{archetype.name}</h3>
              <p>{archetype.need}</p>
              <p>{archetype.productArea}</p>
              <span>{archetype.scope}</span>
            </li>
          ))}
        </ol>
      </figure>

      <figure aria-label="Journey-map excerpt" className="nv-research-artifact">
        <figcaption>
          Journey-map excerpt
          <span>Internal planning artifact</span>
        </figcaption>
        <div className="nv-research-route" aria-hidden="true">
          <span />
          <span />
        </div>
        <ol className="nv-research-journey">
          {NAVI_JOURNEY_STAGES.map((stage) => (
            <li data-stage-id={stage.id} key={stage.id}>
              <h3>{stage.label}</h3>
              <p>{stage.action}</p>
              <p>{stage.productNeed}</p>
            </li>
          ))}
        </ol>
      </figure>

      <figure aria-label="Individual booking-flow excerpt" className="nv-research-artifact">
        <figcaption>Individual booking-flow excerpt</figcaption>
        <div className="nv-research-route" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
        <ol className="nv-research-booking">
          {NAVI_BOOKING_STEPS.map((step) => (
            <li data-step-id={step.id} key={step.id}>
              <h3>{step.label}</h3>
              <p>{step.detail}</p>
            </li>
          ))}
        </ol>
      </figure>
    </div>
  );
}
