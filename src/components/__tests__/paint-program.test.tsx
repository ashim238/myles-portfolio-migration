import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PaintProgram } from "@/components/myles-97/paint-program";

describe("PaintProgram", () => {
  const context = {
    fillStyle: "",
    strokeStyle: "",
    lineWidth: 0,
    lineCap: "",
    lineJoin: "",
    fillRect: vi.fn(),
    getImageData: vi.fn(() => ({} as ImageData)),
    putImageData: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
  } as unknown as CanvasRenderingContext2D;

  beforeEach(() => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(context);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("provides a usable canvas, tools, and palette", () => {
    render(<PaintProgram />);

    const canvas = screen.getByLabelText("Paint canvas");
    Object.defineProperty(canvas, "setPointerCapture", {
      configurable: true,
      value: vi.fn(),
    });
    vi.spyOn(canvas, "getBoundingClientRect").mockReturnValue({
      width: 304,
      height: 208,
      top: 0,
      left: 0,
      bottom: 208,
      right: 304,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    expect(canvas).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Pencil" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Eraser" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Clear" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Undo" })).toBeDisabled();

    context.stroke = vi.fn();
    fireEvent.pointerDown(canvas, { clientX: 152, clientY: 104, pointerId: 1 });
    expect(context.stroke).toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Undo" })).toBeEnabled();
    expect(screen.queryByRole("button", { name: "Stamp MDT" })).not.toBeInTheDocument();
  });
});
