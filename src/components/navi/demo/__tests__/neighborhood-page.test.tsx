import { render, screen, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { NeighborhoodView } from "@/app/work/navi/(minisite)/demo/neighborhood/[slug]/page";
import {
  getNeighborhoodBySlug,
  experiencesByNeighborhood,
  hostsByNeighborhood,
} from "@/lib/navi/neighborhoods";

describe("Neighborhood page", () => {
  const nb = getNeighborhoodBySlug("park-slope");
  if (!nb) throw new Error("test fixture: park-slope missing");

  it("renders the neighborhood name as h1 and the borough", () => {
    render(<NeighborhoodView neighborhood={nb} />);
    expect(screen.getByRole("heading", { level: 1, name: "Park Slope" })).toBeInTheDocument();
    expect(screen.getByText("Brooklyn")).toBeInTheDocument();
  });

  it("renders the intro paragraph", () => {
    render(<NeighborhoodView neighborhood={nb} />);
    expect(screen.getByText(nb.intro)).toBeInTheDocument();
  });

  it("has a back link to results", () => {
    render(<NeighborhoodView neighborhood={nb} />);
    expect(screen.getByRole("link", { name: /Back/ })).toHaveAttribute(
      "href",
      "/work/navi/demo/search",
    );
  });

  it("renders one ExperienceCard per experience in the neighborhood", () => {
    const { container } = render(<NeighborhoodView neighborhood={nb} />);
    const expected = experiencesByNeighborhood("park-slope");
    const cards = container.querySelectorAll("a.nv-exp-card");
    expect(cards.length).toBe(expected.length);
  });

  it("renders a hosts-based-here row linking each host to their page", () => {
    render(<NeighborhoodView neighborhood={nb} />);
    const hosts = hostsByNeighborhood("park-slope");
    const row = screen.getByLabelText(/Hosts based in Park Slope/);
    for (const h of hosts) {
      const link = within(row).getByRole("link", { name: h.name });
      expect(link).toHaveAttribute("href", `/work/navi/demo/host/${h.slug}`);
    }
  });
});
