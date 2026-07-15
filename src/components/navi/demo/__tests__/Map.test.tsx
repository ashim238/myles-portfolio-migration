import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import type React from "react";

// Mock the Leaflet client so jsdom never touches it.
vi.mock("@/components/navi/demo/Map.client", () => ({
  default: ({
    markers,
    center,
    zoom,
    selectedId,
  }: {
    markers: { id: string; label: string }[];
    center: [number, number];
    zoom: number;
    selectedId?: string;
  }) => (
    <div data-testid="map-mock" data-center={center.join(",")} data-zoom={zoom} data-selected={selectedId ?? ""}>
      {markers.map((m) => (
        <span key={m.id} data-marker={m.id}>
          {m.label}
        </span>
      ))}
    </div>
  ),
}));

// Mock next/dynamic to render the component synchronously (no lazy loading in jsdom).
// The factory fn is called immediately and the resolved default export is returned directly.
vi.mock("next/dynamic", () => ({
  default: (
    factory: () => Promise<{ default: React.ComponentType<Record<string, unknown>> }>,
    opts?: unknown,
  ) => {
    void opts;
    // Build a synchronous wrapper: capture the resolved component via a closure.
    // Because vi.mock hoisting runs before module evaluation and the Map.client mock
    // is already registered, the dynamic import below resolves in the same microtask.
    let ResolvedComponent: React.ComponentType<Record<string, unknown>> | null = null;

    // Start the resolution immediately at define-time.
    factory().then((mod) => {
      ResolvedComponent = mod.default;
    });

    const DynamicStub = (props: Record<string, unknown>) => {
      if (!ResolvedComponent) return null;
      return <ResolvedComponent {...props} />;
    };
    DynamicStub.displayName = "DynamicStub";
    return DynamicStub;
  },
}));

// Import AFTER mocks are in place.
import { Map } from "@/components/navi/demo/Map";

describe("Map", () => {
  it("renders an accessible container with the marker list as the keyboard-equivalent", async () => {
    const markers = [
      { id: "a", lat: 40.7, lng: -73.9, label: "$48" },
      { id: "b", lat: 40.71, lng: -73.92, label: "$19" },
    ];
    render(<Map center={[40.7, -73.9]} zoom={12} markers={markers} />);
    expect(screen.getByRole("region", { name: /map/i })).toBeInTheDocument();
    // The mock renders markers so we can assert props flowed through.
    expect(screen.getByTestId("map-mock").getAttribute("data-center")).toBe("40.7,-73.9");
    expect(screen.getByTestId("map-mock").getAttribute("data-zoom")).toBe("12");
    expect(screen.getAllByText(/\$/)).toHaveLength(2);
  });

  it("passes selectedId through to the client", () => {
    const markers = [
      { id: "a", lat: 40.7, lng: -73.9, label: "$48" },
      { id: "b", lat: 40.71, lng: -73.92, label: "$19" },
    ];
    render(<Map center={[40.7, -73.9]} zoom={12} markers={markers} selectedId="b" />);
    expect(screen.getByTestId("map-mock").getAttribute("data-selected")).toBe("b");
  });
});
