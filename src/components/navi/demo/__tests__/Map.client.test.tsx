import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import MapClient from "@/components/navi/demo/Map.client";

class ResizeObserverStub implements ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

const marker = {
  id: "prospect-park-pottery",
  lat: 40.7,
  lng: -73.9,
  label: "$48",
  accessibleLabel: "Prospect Park pottery, $48",
};

describe("MapClient rendered marker accessibility", () => {
  beforeEach(() => {
    vi.stubGlobal("ResizeObserver", ResizeObserverStub);
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(640);
    vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(480);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("puts each result label on the rendered Leaflet divIcon after cluster re-adds", async () => {
    const { rerender } = render(
      <MapClient center={[40.7, -73.9]} zoom={18} markers={[marker]} />,
    );

    const firstMarker = await screen.findByRole("button", {
      name: marker.accessibleLabel,
    });
    expect(firstMarker).toHaveAttribute("aria-label", marker.accessibleLabel);

    rerender(<MapClient center={[40.7, -73.9]} zoom={18} markers={[]} />);
    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: marker.accessibleLabel }),
      ).not.toBeInTheDocument();
    });

    rerender(<MapClient center={[40.7, -73.9]} zoom={18} markers={[marker]} />);
    const readdedMarker = await screen.findByRole("button", {
      name: marker.accessibleLabel,
    });
    expect(readdedMarker).toHaveAttribute("aria-label", marker.accessibleLabel);
  });
});
