// Client component: next/dynamic with ssr:false requires the directive here.
"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

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
  fitToMarkers,
  deferUntilVisible = false,
}: {
  center: [number, number];
  zoom: number;
  markers: MapMarker[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  currentLocation?: [number, number];
  active?: boolean;
  fitToMarkers?: boolean;
  deferUntilVisible?: boolean;
}) {
  const regionRef = useRef<HTMLElement>(null);
  const [shouldRender, setShouldRender] = useState(!deferUntilVisible);

  useEffect(() => {
    if (!deferUntilVisible || shouldRender) return;
    const region = regionRef.current;
    if (!region || typeof IntersectionObserver === "undefined") {
      setShouldRender(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldRender(true);
        observer.disconnect();
      },
      { rootMargin: "300px" },
    );
    observer.observe(region);
    return () => observer.disconnect();
  }, [deferUntilVisible, shouldRender]);

  return (
    <section ref={regionRef} className="nv-map" aria-label="Map of nearby results">
      {shouldRender ? (
        <MapClient
          center={center}
          zoom={zoom}
          markers={markers}
          selectedId={selectedId}
          onSelect={onSelect}
          currentLocation={currentLocation}
          active={active}
          fitToMarkers={fitToMarkers}
        />
      ) : (
        <div className="nv-map-skeleton" aria-hidden="true" />
      )}
    </section>
  );
}
