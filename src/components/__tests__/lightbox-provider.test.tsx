import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ExpandableImage } from "@/components/expandable-image";
import { LightboxProvider } from "@/components/lightbox-provider";

describe("LightboxProvider", () => {
  it("owns every global interactive layer that must become inert", () => {
    const layout = readFileSync(resolve(process.cwd(), "src/app/layout.tsx"), "utf8");
    const provider = layout.match(/<LightboxProvider>([\s\S]*?)<\/LightboxProvider>/)?.[1];

    expect(provider).toBeDefined();
    expect(provider).toContain("skip-link");
    expect(provider).toContain("<ProjectEnterTransition>");
    expect(provider).toContain("<MobileNav />");
    expect(provider).toContain("<DotCursor />");
    expect(provider).toContain("<ScrollRevealFallback />");
  });

  it("serves the expanded image through the responsive image optimizer", async () => {
    render(
      <LightboxProvider>
        <ExpandableImage
          src="/projects/fresh-greens/cover.png"
          alt="Fresh Greens welcome screen"
          width={1200}
          height={800}
          sizes="50vw"
        />
      </LightboxProvider>,
    );

    await userEvent.click(
      screen.getByRole("button", {
        name: "Expand image: Fresh Greens welcome screen",
      }),
    );

    const dialog = screen.getByRole("dialog", {
      name: "Fresh Greens welcome screen",
    });
    const expandedImage = within(dialog).getByRole("img", {
      name: "Fresh Greens welcome screen",
    });

    expect(expandedImage).toHaveAttribute("sizes", "92vw");
    expect(expandedImage).toHaveAttribute("srcset");
    expect(expandedImage).toHaveAttribute("width", "1200");
    expect(expandedImage).toHaveAttribute("height", "800");
  });

  it("sizes the inline drawing and the full phone screen independently", async () => {
    render(
      <LightboxProvider>
        <ExpandableImage
          src="/projects/fresh-greens/process/onboarding/permissions-screen.webp"
          previewSrc="/projects/fresh-greens/process/onboarding/permissions-car.svg"
          previewSize={{ width: 116, height: 81 }}
          width={1290}
          height={2796}
          alt="Permissions car"
          expandedAlt="Permissions screen with the location and microphone requests"
          unoptimized
        />
      </LightboxProvider>,
    );

    const preview = screen.getByRole("img", { name: "Permissions car" });
    expect(preview).toHaveAttribute("width", "116");
    expect(preview).toHaveAttribute("height", "81");
    await userEvent.click(screen.getByRole("button", { name: /open full screen: permissions screen/i }));
    const original = within(screen.getByRole("dialog")).getByRole("img");
    expect(original).toHaveAttribute("width", "1290");
    expect(original).toHaveAttribute("height", "2796");
    expect(original).toHaveAccessibleName("Permissions screen with the location and microphone requests");
  });

  it("preserves lossless delivery when an image is enlarged", async () => {
    const src = "/projects/fresh-greens/process/pivot-google-v1-screen.png";
    render(
      <LightboxProvider>
        <ExpandableImage
          src={src}
          alt="First pass"
          width={390}
          height={844}
          unoptimized
        />
      </LightboxProvider>,
    );

    expect(screen.getByRole("img", { name: "First pass" })).toHaveAttribute("src", src);
    await userEvent.click(screen.getByRole("button", { name: "Expand image: First pass" }));
    const expanded = within(screen.getByRole("dialog", { name: "First pass" }))
      .getByRole("img", { name: "First pass" });
    expect(expanded).toHaveAttribute("src", src);
    expect(expanded).not.toHaveAttribute("srcset");
  });

  it("makes provider content inert while open and restores it on close", async () => {
    const user = userEvent.setup();

    render(
      <LightboxProvider>
        <ExpandableImage
          src="/projects/fresh-greens/cover.png"
          alt="Fresh Greens welcome screen"
          width={1200}
          height={800}
        />
      </LightboxProvider>,
    );

    const trigger = screen.getByRole("button", {
      name: "Expand image: Fresh Greens welcome screen",
    });
    const providerContent = trigger.closest(".lb-content");

    expect(providerContent).toBeInstanceOf(HTMLElement);
    if (!(providerContent instanceof HTMLElement)) return;
    expect(providerContent).not.toHaveAttribute("inert");
    expect(providerContent).not.toHaveAttribute("aria-hidden");

    trigger.focus();
    await user.click(trigger);

    expect(providerContent).toHaveAttribute("inert");
    expect(providerContent).toHaveAttribute("aria-hidden", "true");

    await user.click(screen.getByRole("button", { name: "Close" }));

    expect(providerContent).not.toHaveAttribute("inert");
    expect(providerContent).not.toHaveAttribute("aria-hidden");
    expect(trigger).toHaveFocus();
  });

  it("supports fit, actual-size, and bounded zoom states", async () => {
    const user = userEvent.setup();

    render(
      <LightboxProvider>
        <ExpandableImage
          src="/projects/understandingfafsa/cover.png"
          alt="UnderstandingFAFSA newsletter"
          width={4000}
          height={3000}
        />
      </LightboxProvider>,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Expand image: UnderstandingFAFSA newsletter",
      }),
    );

    const dialog = screen.getByRole("dialog", {
      name: "UnderstandingFAFSA newsletter",
    });
    const frame = dialog;

    expect(frame).toHaveAttribute("data-lb-view", "fit");
    expect(screen.getByRole("button", { name: "Fit" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    const viewport = screen.getByRole("region", {
      name: "Image viewing area. Use arrow keys or scroll to inspect the image.",
    });
    expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();
    await user.tab();
    expect(viewport).toHaveFocus();
    await user.tab({ shift: true });
    expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();

    await user.click(screen.getByRole("button", { name: "Actual size" }));
    expect(frame).toHaveAttribute("data-lb-view", "actual");
    const original = within(dialog).getByRole("img", { name: "UnderstandingFAFSA newsletter" });
    expect(original).toHaveAttribute("src", "/projects/understandingfafsa/cover.png");
    expect(original).not.toHaveAttribute("srcset");
    expect(screen.getByText("100%")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Zoom in" }));
    expect(screen.getByText("125%")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Fit" }));
    expect(frame).toHaveAttribute("data-lb-view", "fit");
    expect(screen.getByText("100%")).toBeInTheDocument();
  });
});
