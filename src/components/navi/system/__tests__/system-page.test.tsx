import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import SystemPage from "@/app/work/navi/(minisite)/system/page";

describe("System page", () => {
  it("leads with the Live playground hero", () => {
    render(<SystemPage />);
    expect(screen.getByRole("heading", { level: 2, name: "Live" })).toBeInTheDocument();
  });

  it("organizes specimens into six chapters", () => {
    render(<SystemPage />);
    for (const name of ["Live", "Foundations", "Actions", "Forms", "Content", "Navigation"]) {
      expect(screen.getByRole("heading", { level: 2, name })).toBeInTheDocument();
    }
  });

  it("renders the foundation specimens (Color, Type, Spacing) inside Foundations", () => {
    render(<SystemPage />);
    expect(screen.getByRole("heading", { level: 3, name: "Color" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Type" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Spacing" })).toBeInTheDocument();
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
