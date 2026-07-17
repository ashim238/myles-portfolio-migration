import { existsSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import * as tiktokComponents from "@/components/tiktok-dsa";
import { TikTokTemplateSystem } from "@/components/tiktok-dsa";
import { TIKTOK_TEMPLATES } from "@/lib/tiktok-data";

describe("TikTokTemplateSystem", () => {
  it("is available to the TikTok preview", () => {
    expect(tiktokComponents).toHaveProperty("TikTokTemplateSystem");
  });

  it("delivers compact raster derivatives while preserving the SVG sources", () => {
    for (const template of TIKTOK_TEMPLATES) {
      expect(template.fullTemplate).toMatch(/\.webp$/);
      expect(template.fullTemplateSource).toMatch(/\.svg$/);

      const rasterPath = resolve(process.cwd(), "public", template.fullTemplate.slice(1));
      const sourcePath = resolve(
        process.cwd(),
        "public",
        template.fullTemplateSource.slice(1),
      );

      expect(existsSync(rasterPath)).toBe(true);
      expect(existsSync(sourcePath)).toBe(true);
      expect(statSync(rasterPath).size).toBeLessThan(statSync(sourcePath).size);
    }
  });

  it("uses responsive Next Image delivery for chooser and selected templates", () => {
    const { container } = render(<TikTokTemplateSystem />);
    const chooserImages = container.querySelectorAll(".tt-template-choice-image img");
    const selectedImage = screen.getByAltText(
      "#DopamineDressing static Dynamic Showcase Ad template",
    );

    expect(chooserImages).toHaveLength(3);
    chooserImages.forEach((image) => {
      expect(image).toHaveAttribute("sizes", "(max-width: 720px) 9rem, 20rem");
      expect(image).toHaveAttribute("srcset");
      expect(image.getAttribute("src")).toContain(".webp");
    });
    expect(chooserImages[0]).toHaveAttribute("loading", "eager");
    expect(chooserImages[1]).toHaveAttribute("loading", "lazy");
    expect(chooserImages[2]).toHaveAttribute("loading", "lazy");
    expect(selectedImage).toHaveAttribute(
      "sizes",
      "(max-width: 720px) 17rem, 20rem",
    );
    expect(selectedImage).toHaveAttribute("loading", "eager");
    expect(selectedImage).toHaveAttribute("srcset");
    expect(selectedImage.getAttribute("src")).toContain(".webp");
  });

  it("shows the three original templates and marks only Light Academia as shipped", () => {
    render(<TikTokTemplateSystem />);

    const chooser = screen.getByRole("group", { name: "Choose a template" });
    expect(within(chooser).getAllByRole("button")).toHaveLength(3);
    expect(within(chooser).getByText("#DopamineDressing")).toBeInTheDocument();
    expect(within(chooser).getByText("#e-Boy/#e-Girl")).toBeInTheDocument();
    expect(within(chooser).getByText("#LightAcademia")).toBeInTheDocument();
    expect(within(chooser).getAllByText("Shipped")).toHaveLength(1);
    expect(
      within(
        screen.getByRole("button", {
          name: "View #LightAcademia template, shipped",
        }),
      ).getByText("Shipped"),
    ).toBeInTheDocument();
  });

  it("changes the detailed template when a contact-sheet item is selected", () => {
    render(<TikTokTemplateSystem />);

    const dopamine = screen.getByRole("button", {
      name: "View #DopamineDressing template",
    });
    const academia = screen.getByRole("button", {
      name: "View #LightAcademia template, shipped",
    });

    expect(dopamine).toHaveAttribute("aria-pressed", "true");
    expect(academia).toHaveAttribute("aria-pressed", "false");
    expect(
      screen.getByRole("figure", {
        name: "Selected template: #DopamineDressing",
      }),
    ).toBeInTheDocument();

    fireEvent.click(academia);

    expect(dopamine).toHaveAttribute("aria-pressed", "false");
    expect(academia).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("figure", {
        name: "Selected template: #LightAcademia",
      }),
    ).toBeInTheDocument();
  });

  it("shows only source-supported regions for each template", () => {
    render(<TikTokTemplateSystem />);

    const controls = screen.getByRole("group", {
      name: "Inspect template parts",
    });
    expect(within(controls).getAllByRole("button")).toHaveLength(2);
    expect(
      within(controls).queryByRole("button", { name: "Supporting graphics" }),
    ).not.toBeInTheDocument();
    expect(
      within(controls).queryByRole("button", { name: "TikTok interface" }),
    ).not.toBeInTheDocument();

    const title = within(controls).getByRole("button", { name: "Title" });
    const catalog = within(controls).getByRole("button", {
      name: "Catalog slot",
    });

    expect(catalog).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Source-aligned region overlay")).toBeInTheDocument();

    fireEvent.click(title);

    expect(title).toHaveAttribute("aria-pressed", "true");
    expect(catalog).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByText("Original title asset")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "View #e-Boy/#e-Girl template" }),
    );

    expect(within(controls).getAllByRole("button")).toHaveLength(1);
    expect(
      within(controls).getByRole("button", { name: "Catalog slot" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.queryByRole("button", { name: "Title" }),
    ).not.toBeInTheDocument();
  });

  it("uses artifact-specific boxes and asset highlights", () => {
    const { container } = render(<TikTokTemplateSystem />);

    const dopamineOverlay = container.querySelector(
      ".tt-template-region-overlay[data-template-region='dopamine-catalog']",
    );
    expect(dopamineOverlay).toHaveStyle({
      left: "12.45%",
      top: "19.18%",
      width: "64.48%",
      height: "41.97%",
    });

    fireEvent.click(
      screen.getByRole("button", { name: "View #e-Boy/#e-Girl template" }),
    );
    const eboyOverlay = container.querySelector(
      ".tt-template-region-overlay[data-template-region='eboy-catalog']",
    );
    expect(eboyOverlay).toHaveStyle({
      left: "11.11%",
      top: "13.33%",
      width: "66.67%",
      height: "48.33%",
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "View #LightAcademia template, shipped",
      }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Supporting graphics" }),
    );

    expect(
      container.querySelector(".tt-template-region-overlay"),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Original barcode asset")).toBeInTheDocument();
  });
});
