"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { MapMarker } from "./Map";

export default function MapClient({
  center,
  zoom,
  markers,
  selectedId,
  onSelect,
}: {
  center: [number, number];
  zoom: number;
  markers: MapMarker[];
  selectedId?: string;
  onSelect?: (id: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, { zoomControl: true, attributionControl: true }).setView(
      center,
      zoom,
    );
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    mapRef.current = map;
    markerLayerRef.current = L.layerGroup().addTo(map);
    return () => {
      map.remove();
      mapRef.current = null;
      markerLayerRef.current = null;
    };
  }, [center, zoom]);

  useEffect(() => {
    const layer = markerLayerRef.current;
    if (!layer) return;
    layer.clearLayers();
    for (const m of markers) {
      const selected = m.id === selectedId;
      const icon = L.divIcon({
        className: "nv-pin-leaflet",
        html: `<span class="nv-pin nv-pin--place${selected ? " nv-pin--selected" : ""}"><span class="nv-pin-value">${m.label}</span></span>`,
        iconSize: [48, 28],
        iconAnchor: [24, 28],
      });
      const marker = L.marker([m.lat, m.lng], { icon, keyboard: true, alt: `${m.label}, select` });
      if (onSelect) marker.on("click", () => onSelect(m.id));
      marker.addTo(layer);
    }
  }, [markers, selectedId, onSelect]);

  return <div ref={containerRef} className="nv-map-canvas" role="application" aria-label="Interactive map" />;
}
