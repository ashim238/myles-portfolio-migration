import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TemplateAnatomy } from "@/components/tiktok-dsa";

describe("TikTok artifact copy", () => {
  it("keeps the retained anatomy caption within the candidate-facing house style", () => {
    render(<TemplateAnatomy />);

    expect(screen.getByText(/540×960 frame/)).not.toHaveTextContent(";");
  });
});
