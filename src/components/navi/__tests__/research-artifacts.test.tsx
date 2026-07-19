import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NaviResearchArtifacts } from "@/components/navi/research-artifacts";

const naviSource = readFileSync(
  resolve(process.cwd(), "src/components/navi.tsx"),
  "utf8",
);
const portfolioSurfacesCss = readFileSync(
  resolve(process.cwd(), "src/app/styles/portfolio-surfaces.css"),
  "utf8",
);
const naviAnimReadySource = naviSource.slice(
  naviSource.indexOf("export function NaviAnimReady()"),
  naviSource.indexOf("/* ── Heuristic insight cards"),
);

describe("NaviResearchArtifacts", () => {
  it("presents one traceable research board with explicit provenance", () => {
    render(<NaviResearchArtifacts />);

    expect(
      screen.getByRole("heading", { name: "Research and product scope" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Each row connects a finding to the product area it affected.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Resident survey, platform audits, and secondary research"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Airbnb audit and secondary research"),
    ).toBeInTheDocument();
  });

  it("names the three research-informed archetypes and their scope", () => {
    render(<NaviResearchArtifacts />);
    const archetypes = screen.getByLabelText("Research-informed archetypes");
    expect(within(archetypes).getByText("Cain")).toBeInTheDocument();
    expect(within(archetypes).getByText("Ororo")).toBeInTheDocument();
    expect(within(archetypes).getByText("Selina")).toBeInTheDocument();
    expect(within(archetypes).getByText("Future opportunity")).toBeInTheDocument();
    expect(within(archetypes).getAllByText("Need")).toHaveLength(3);
    expect(within(archetypes).getAllByText("Product area")).toHaveLength(3);
  });

  it("keeps the journey and individual booking sequence available as text", () => {
    render(<NaviResearchArtifacts />);
    const journey = screen.getByLabelText("Journey-map excerpt");
    for (const stage of ["Awareness", "Consideration", "Decision"]) {
      expect(within(journey).getByText(stage)).toBeInTheDocument();
    }
    const booking = screen.getByLabelText("Individual booking-flow excerpt");
    for (const step of ["Neighborhood discovery", "Activity detail", "Date and time", "Cost review", "Confirmation"]) {
      expect(within(booking).getByText(step)).toBeInTheDocument();
    }
    expect(
      booking.querySelector('[data-decision-point="cost-review"]'),
    ).not.toBeNull();
  });

  it("draws each research route as one continuous rail through its waypoints", () => {
    render(<NaviResearchArtifacts />);

    for (const [label, modifier] of [
      ["Journey-map excerpt", "nv-research-route--journey"],
      ["Individual booking-flow excerpt", "nv-research-route--booking"],
    ]) {
      const artifact = screen.getByLabelText(label);
      const route = artifact.querySelector(".nv-research-route");
      expect(route).not.toBeNull();
      expect(route).toBeEmptyDOMElement();
      expect(route).toHaveClass(modifier);
    }

    expect(portfolioSurfacesCss).toMatch(
      /\.nv-research-route\s*\{[\s\S]*?margin:\s*0;[\s\S]*?background:\s*var\(--nv-accent\);/,
    );
    expect(portfolioSurfacesCss).not.toMatch(/\.nv-research-route span\s*\{/);
    expect(portfolioSurfacesCss).toContain(
      "margin-inline: calc((100% - 1.5rem) / 6);",
    );
    expect(portfolioSurfacesCss).toContain(
      "margin-inline: calc((100% - 3rem) / 10);",
    );
    expect(portfolioSurfacesCss).toContain(
      "margin: 1.6rem 0 1rem 1rem;",
    );
  });

  it("labels the diagrams as internal planning rather than validation", () => {
    render(<NaviResearchArtifacts />);
    expect(screen.getByText("Internal planning artifact")).toBeInTheDocument();
    expect(screen.queryByText(/validated/i)).not.toBeInTheDocument();
  });

  it("makes only the research artifacts reveal one-shot", () => {
    expect(naviAnimReadySource).toMatch(
      /if \(entry\.isIntersecting\) \{[\s\S]*?classList\.add\("nv-reveal--visible"\);[\s\S]*?classList\.contains\("nv-research-artifacts"\)[\s\S]*?io\.unobserve\(entry\.target\);/,
    );
    expect(naviAnimReadySource).toMatch(
      /\} else \{\s*entry\.target\.classList\.remove\("nv-reveal--visible"\);/,
    );
  });
});
