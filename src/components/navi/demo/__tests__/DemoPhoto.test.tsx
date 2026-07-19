import { render, screen, fireEvent } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, it, expect } from "vitest";
import { DemoPhoto } from "@/components/navi/demo/DemoPhoto";

describe("DemoPhoto", () => {
  it("serves a responsive optimized image at the caller-provided slot size", () => {
    render(
      <DemoPhoto
        src="/x.jpg"
        alt="A harbor at dusk"
        sizes="(max-width: 720px) calc(100vw - 32px), 340px"
      />,
    );

    const image = screen.getByRole("img", { name: "A harbor at dusk" });
    expect(image).toHaveAttribute(
      "sizes",
      "(max-width: 720px) calc(100vw - 32px), 340px",
    );
    expect(image).toHaveAttribute("srcset");
  });

  it("accepts a more specific responsive size for narrower slots", () => {
    render(
      <DemoPhoto
        src="/x.jpg"
        alt="A harbor at dusk"
        sizes="(max-width: 720px) 100vw, 160px"
      />,
    );

    expect(screen.getByRole("img", { name: "A harbor at dusk" })).toHaveAttribute(
      "sizes",
      "(max-width: 720px) 100vw, 160px",
    );
  });

  it("renders an image with the given alt text", () => {
    render(
      <DemoPhoto
        src="/x.jpg"
        alt="A harbor at dusk"
        sizes="100vw"
        className="photo-slot"
        dataTestId="demo-photo"
      />,
    );

    const image = screen.getByTestId("demo-photo");
    expect(image).toHaveAccessibleName("A harbor at dusk");
    expect(image).toHaveClass("photo-slot");
    expect(image).toHaveAttribute("loading", "lazy");
    expect(image).toHaveAttribute("decoding", "async");
  });

  it("falls back to a pending panel when the image fails to load", () => {
    render(<DemoPhoto src="/missing.jpg" alt="A harbor at dusk" sizes="100vw" />);
    fireEvent.error(screen.getByRole("img"));
    expect(screen.getByText(/photo coming soon/i)).toBeInTheDocument();
    // The panel keeps the alt text as its accessible name.
    expect(screen.getByRole("img", { name: "A harbor at dusk" })).toBeInTheDocument();
  });

  it("preloads a designated hero and marks the rendered image eager", () => {
    render(
      <DemoPhoto
        src="/hero.jpg"
        alt="A workshop in progress"
        sizes="(max-width: 720px) 100vw, min(70vw, 960px)"
        preload
      />,
    );

    expect(screen.getByRole("img", { name: "A workshop in progress" })).toHaveAttribute(
      "loading",
      "eager",
    );
  });

  it("forwards the hero preload resource hint through Next Image", () => {
    const markup = renderToStaticMarkup(
      <DemoPhoto
        src="/hero.jpg"
        alt="A workshop in progress"
        sizes="(max-width: 720px) 100vw, min(70vw, 960px)"
        preload
      />,
    );

    expect(markup).toContain('rel="preload"');
    expect(markup).toContain("%2Fhero.jpg");
    expect(markup).toContain('loading="eager"');
  });
});
