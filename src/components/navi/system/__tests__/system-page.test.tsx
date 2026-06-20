import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import SystemPage from "@/app/work/navi/(minisite)/system/page";

describe("System page", () => {
  it("opens with the foundations (Color, Type, Spacing)", () => {
    render(<SystemPage />);
    expect(screen.getByRole("heading", { name: "Color" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Type" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Spacing" })).toBeInTheDocument();
  });


  it("renders the gallery heading and a documented correction note", () => {
    render(<SystemPage />);
    expect(screen.getByRole("heading", { name: /design system/i })).toBeInTheDocument();
    expect(screen.getByText(/accessible derivation/i)).toBeInTheDocument();
  });

  it("renders specimens for the core components", () => {
    render(<SystemPage />);
    expect(screen.getByRole("heading", { name: "Button" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Rating" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Impact signal" })).toBeInTheDocument();
  });

  it("renders the interactive Button playground", () => {
    render(<SystemPage />);
    expect(screen.getByTestId("nv-playground-code")).toHaveTextContent("<Button");
  });
});
