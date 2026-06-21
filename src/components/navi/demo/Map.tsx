// Client component: next/dynamic with ssr:false requires the directive here.
"use client";

import dynamic from "next/dynamic";

const MapClient = dynamic(() => import("./Map.client"), {
  ssr: false,
  loading: () => <div className="nv-map-skeleton" aria-hidden="true" />,
});

export type MapMarker = { id: string; lat: number; lng: number; label: string };

export function Map({
  center,
  zoom,
  markers,
  selectedId,
  onSelect,
  currentLocation,
  active,
}: {
  center: [number, number];
  zoom: number;
  markers: MapMarker[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  currentLocation?: [number, number];
  active?: boolean;
}) {
  return (
    <section className="nv-map" aria-label="Map of nearby results">
      <MapClient
        center={center}
        zoom={zoom}
        markers={markers}
        selectedId={selectedId}
        onSelect={onSelect}
        currentLocation={currentLocation}
        active={active}
      />
    </section>
  );
}
