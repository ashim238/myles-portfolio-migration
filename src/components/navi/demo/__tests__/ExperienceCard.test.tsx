import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ExperienceCard } from "@/components/navi/demo/ExperienceCard";
import { EXPERIENCES } from "@/lib/navi/demo-data";

describe("ExperienceCard", () => {
  const e = EXPERIENCES[0];

  it("renders title, neighborhood, price, rating, tag, and impact signal", () => {
    render(<ExperienceCard experience={e} href={`/work/navi/demo/experience/${e.slug}`} />);
    expect(screen.getByRole("link", { name: new RegExp(e.title, "i") })).toBeInTheDocument();
    expect(screen.getByText(new RegExp(e.neighborhood))).toBeInTheDocument();
    expect(screen.getByText(`$${e.price} per person`)).toBeInTheDocument();
    expect(screen.getByText(/rated/i)).toHaveClass("nv-sr-only");
    expect(screen.getByText(e.impactPhrase)).toBeInTheDocument();
  });

  it("the cover image has descriptive alt text", () => {
    render(<ExperienceCard experience={e} href="#" />);
    const img = screen.getByRole("img");
    expect(img.getAttribute("alt")).toBe(e.photos[0].alt);
    expect(img).toHaveAttribute(
      "sizes",
      "(max-width: 720px) calc(100vw - 32px), 340px",
    );
  });

  it("can preload a measured above-fold candidate", () => {
    render(<ExperienceCard experience={e} href="#" preload />);
    expect(screen.getByRole("img")).toHaveAttribute("loading", "eager");
  });
});
