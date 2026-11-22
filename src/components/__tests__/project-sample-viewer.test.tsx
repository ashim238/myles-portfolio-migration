import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { projectSamples } from "@/lib/myles-97/preview-originals";
import { ProjectSampleViewer } from "@/components/myles-97/project-sample-viewer";
vi.mock("next/image", () => ({
  default: ({
    alt = "",
    src,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} src={String(src)} alt={alt} />;
  },
}));

describe("Project sample viewer", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.spyOn(window, "matchMedia").mockReturnValue({
      matches: false,
    } as MediaQueryList);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each(["fresh-greens", "navi", "tiktok"] as const)(
    "registers each %s detail against its own source", (id) => {
      const { container } = render(<ProjectSampleViewer project={id} title={id} reduced />);
      const samples = projectSamples[id];
      expect(screen.getAllByRole("radio")).toHaveLength(samples.length + 1);
      for (const [index, sample] of samples.entries()) {
        const select = screen.getByRole("radio", { name: sample.label });
        fireEvent.click(select);
        expect(select).toBeChecked();
        expect(screen.getByRole("figure", { name: sample.alt })).toHaveTextContent(sample.detail);
        expect(screen.getByRole("button", { name: `Enlarge ${sample.label} original` })).toBeVisible();
        expect(screen.getByText(new RegExp(`${index + 1} of ${samples.length}`))).toBeVisible();
        expect(container.querySelector(".sample-page img")).toHaveAttribute("src", sample.src);
        expect(container.querySelector(".artwork-crop img")).toHaveAttribute("src", sample.src);
      }
    },
  );

  it("keeps the same evening route when switching from Plan to Drive", () => {
    const { container } = render(<ProjectSampleViewer project="fresh-greens" title="Fresh Greens" reduced />);
    fireEvent.change(screen.getByRole("combobox", { name: "Route" }), { target: { value: "brixton" } });
    expect(container.querySelector(".artwork-crop img")).toHaveAttribute("src", expect.stringContaining("brixton-evening-preview.png"));
    fireEvent.click(screen.getByRole("radio", { name: "Drive" }));
    expect(container.querySelector(".artwork-crop img")).toHaveAttribute("src", expect.stringContaining("04-brixton-evening-navigation.png"));
    fireEvent.click(screen.getByRole("radio", { name: "Map key" }));
    expect(container.querySelector(".artwork-crop img")).toHaveAttribute("src", expect.stringContaining("01-weeksville-daylight-preview.png"));
    fireEvent.change(screen.getByRole("combobox", { name: "Map key view" }), { target: { value: "drive" } });
    expect(container.querySelector(".artwork-crop img")).toHaveAttribute("src", expect.stringContaining("05-brixton-navigation-key-reopened.png"));
  });

  it("opens the FAFSA preview with both original sends and offers the built Mailchimp sample", () => {
    const { container } = render(<ProjectSampleViewer project="understandingfafsa" title="UnderstandingFAFSA" reduced />);
    expect(screen.getByRole("radio", { name: "Compare sends" })).toBeChecked();
    for (const sample of projectSamples.understandingfafsa.slice(0, 2)) {
      const button = screen.getByRole("button", { name: `Enlarge ${sample.label} original` });
      expect(button.querySelector("img")).toHaveAttribute("src", sample.src);
    }
    fireEvent.click(screen.getByRole("radio", { name: "Mailchimp" }));
    expect(container.querySelector(".artwork-crop img")).toHaveAttribute("src", projectSamples.understandingfafsa[2].src);
    expect(screen.getByText(/2 of 2/)).toBeVisible();
  });

  it("reassembles the projected parts and returns to the original sample", () => {
    render(<ProjectSampleViewer project="fresh-greens" title="Fresh Greens" reduced />);
    fireEvent.click(screen.getByRole("radio", { name: "Layers" }));
    const drawing = screen.getByRole("button", { name: /View layers/ });
    expect(drawing).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(drawing);
    expect(drawing).toHaveAttribute("aria-pressed", "true");
    expect(drawing).toHaveAccessibleDescription(expect.stringContaining("Street map"));
    fireEvent.click(drawing);
    expect(drawing).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(screen.getByRole("radio", { name: "Plan" }));
    expect(screen.getByRole("button", { name: "Enlarge Plan original" })).toBeVisible();
  });

});
