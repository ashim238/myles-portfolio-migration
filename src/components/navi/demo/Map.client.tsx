"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import type { MapMarker } from "./Map";

export default function MapClient({
  center,
  zoom,
  markers,
  selectedId,
  onSelect,
  currentLocation,
  active = true,
  fitToMarkers = false,
}: {
  center: [number, number];
  zoom: number;
  markers: MapMarker[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  currentLocation?: [number, number];
  active?: boolean;
  fitToMarkers?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  // Place markers cluster so a dense city core stays legible; the location dot
  // lives in its own (unclustered) layer.
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const locLayerRef = useRef<L.LayerGroup | null>(null);
  // id -> marker, so selection toggles a class instead of rebuilding markers.
  const markerById = useRef<Map<string, L.Marker>>(new Map());

  // Init once. center/zoom are intentionally not deps; we use setView below for updates.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, { zoomControl: true, attributionControl: true }).setView(
      center,
      zoom,
    );
    // CARTO Voyager: a cleaner basemap than the OSM default, and {r}+detectRetina
    // request @2x tiles so the map stays crisp on high-DPI screens.
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      subdomains: "abcd",
      maxZoom: 20,
      detectRetina: true,
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
    }).addTo(map);
    mapRef.current = map;

    const cluster = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 46,
      spiderfyOnMaxZoom: true,
      iconCreateFunction: (c) =>
        L.divIcon({
          className: "nv-cluster-leaflet",
          html: `<span class="nv-cluster">${c.getChildCount()}</span>`,
          iconSize: [38, 38],
          iconAnchor: [19, 19],
        }),
    }).addTo(map);
    clusterRef.current = cluster;
    locLayerRef.current = L.layerGroup().addTo(map);

    // The map often mounts (via next/dynamic) before its flex/grid container has
    // its final width, so Leaflet loads tiles for the wrong size and leaves the
    // rest grey. Recompute on the next frame and whenever the container resizes.
    const raf = requestAnimationFrame(() => map.invalidateSize());
    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(containerRef.current);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      map.remove();
      mapRef.current = null;
      clusterRef.current = null;
      locLayerRef.current = null;
      markerById.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync center/zoom without rebuilding the map. When fitting to markers, the
  // markers effect owns the viewport, so don't fight it here.
  useEffect(() => {
    if (fitToMarkers) return;
    mapRef.current?.setView(center, zoom);
  }, [center, zoom, fitToMarkers]);

  // When the map lives in a tab/panel that starts hidden, it initializes at
  // zero size and loads a single tile. Recompute once it becomes visible.
  useEffect(() => {
    if (!active) return;
    const id = requestAnimationFrame(() => mapRef.current?.invalidateSize());
    return () => cancelAnimationFrame(id);
  }, [active]);

  // Build place markers (and the optional current-location dot) only when the
  // marker set changes, not on every hover.
  useEffect(() => {
    const cluster = clusterRef.current;
    const locLayer = locLayerRef.current;
    if (!cluster || !locLayer) return;
    cluster.clearLayers();
    locLayer.clearLayers();
    markerById.current.clear();

    for (const m of markers) {
      // A labelled marker is a priced result (pill); an unlabelled one is a
      // single venue location (a dot, not a price tag).
      const icon = m.label
        ? L.divIcon({
            className: "nv-pin-leaflet",
            html: `<span class="nv-pin nv-pin--place"><span class="nv-pin-value">${m.label}</span></span>`,
            iconSize: [48, 28],
            iconAnchor: [24, 28],
          })
        : L.divIcon({
            className: "nv-pin-leaflet",
            html: `<span class="nv-venue-pin" role="img" aria-label="Event location"></span>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });
      const marker = L.marker([m.lat, m.lng], {
        icon,
        keyboard: true,
        alt: m.label ? `${m.label}, select` : "Event location",
      });
      if (onSelect) marker.on("click", () => onSelect(m.id));
      cluster.addLayer(marker);
      markerById.current.set(m.id, marker);
    }

    if (currentLocation) {
      const locIcon = L.divIcon({
        className: "nv-pin-leaflet",
        html: `<span class="nv-loc-dot" role="img" aria-label="Current location"></span>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });
      L.marker(currentLocation, { icon: locIcon, interactive: false, keyboard: false }).addTo(
        locLayer,
      );
    }

    // Frame every result (plus the location dot) so off-screen pins aren't lost
    // and the list count matches what's on the map.
    if (fitToMarkers && markers.length > 0) {
      const pts: [number, number][] = markers.map((m) => [m.lat, m.lng]);
      if (currentLocation) pts.push(currentLocation);
      mapRef.current?.fitBounds(L.latLngBounds(pts), { padding: [48, 48], maxZoom: 14 });
    }
  }, [markers, onSelect, currentLocation, fitToMarkers]);

  // Selection toggles a class and raises the pin. A clustered (hidden) marker
  // has no element yet, so guard for null.
  useEffect(() => {
    for (const [id, marker] of markerById.current) {
      const selected = id === selectedId;
      marker.getElement()?.querySelector(".nv-pin")?.classList.toggle("nv-pin--selected", selected);
      marker.setZIndexOffset(selected ? 1000 : 0);
    }
  }, [selectedId, markers]);

  // The Leaflet canvas is a mouse-only visual aid, so it's hidden from assistive
  // tech rather than mislabelled as "interactive". The accessible equivalents
  // live in text: the result list on search, the address block on a detail page.
  return <div ref={containerRef} className="nv-map-canvas" aria-hidden="true" />;
}
