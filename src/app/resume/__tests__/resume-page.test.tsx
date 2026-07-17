import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ResumePage from "../page";

vi.mock("@/components/site-nav", () => ({ SiteNav: () => null }));

describe("ResumePage semantics", () => {
  it("renders public contact details as real links without exposing a phone number", () => {
    render(<ResumePage />);

    const renderedText = document.body.textContent || "";
    const phonePattern = /(?:\+?1[\s.-]?)?\(?[2-9]\d{2}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;

    expect(renderedText).not.toMatch(phonePattern);
    expect(document.querySelector('a[href^="tel:"]')).toBeNull();
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      "https://linkedin.com/in/myles-ashitey",
    );
    expect(screen.getByRole("link", { name: "mylesashitey@gmail.com" })).toHaveAttribute(
      "href",
      "mailto:mylesashitey@gmail.com",
    );
  });

  it("offers the verified public resume PDF as a semantic download link", () => {
    render(<ResumePage />);

    const download = screen.getByRole("link", { name: "Download résumé PDF" });
    expect(download).toHaveAttribute("href", "/myles-ashitey-resume.pdf");
    expect(download).toHaveAttribute("download", "myles-ashitey-resume.pdf");
  });

  it("uses a labeled section for quick details so print export gets a standard structure role", () => {
    render(<ResumePage />);

    expect(screen.getByRole("region", { name: "Quick details" })).toBeInTheDocument();
    expect(screen.queryByRole("complementary", { name: "Quick details" })).toBeNull();
  });

  it("renders the UMG merchandise work as a second nested list item", () => {
    render(<ResumePage />);
    const heading = screen.getByRole("heading", { name: "Creative Strategy Assistant" });
    const role = heading.closest("li");

    expect(role).not.toBeNull();
    const bullets = within(role as HTMLElement).getAllByRole("listitem");
    expect(bullets).toHaveLength(2);
    expect(bullets[1]).toHaveTextContent(
      "custom-merch rollout for charlieonnafriday on Tate McRae’s tour",
    );
  });

  it("describes research broadly without claiming resident interviews", () => {
    render(<ResumePage />);

    expect(document.body).toHaveTextContent(
      "projects from interviews and usability tests through visual systems and working React Native builds",
    );
    expect(document.body).not.toHaveTextContent("resident interviews");
  });

  it("links each independent project heading to its production case study", () => {
    render(<ResumePage />);

    expect(screen.getByRole("link", { name: "Fresh Greens" })).toHaveAttribute(
      "href",
      "https://www.mylesdesignsthings.com/work/fresh-greens",
    );
    expect(screen.getByRole("link", { name: "UnderstandingFAFSA" })).toHaveAttribute(
      "href",
      "https://www.mylesdesignsthings.com/work/understandingfafsa",
    );
    expect(screen.getByRole("link", { name: "Navi" })).toHaveAttribute(
      "href",
      "https://www.mylesdesignsthings.com/work/navi",
    );
  });
});
