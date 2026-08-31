"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Undo, Trash2, Plus, Minus, MapPin, Compass } from "lucide-react";

interface RouteMapEditorProps {
  coordinates: [number, number][];
  onChangeCoordinates: (coords: [number, number][]) => void;
  center?: [number, number];
}

export const RouteMapEditor: React.FC<RouteMapEditorProps> = ({
  coordinates,
  onChangeCoordinates,
  center = [42.58, 74.56],
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const trailLayerRef = useRef<L.FeatureGroup | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: center,
      zoom: 12,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    const trailLayer = L.featureGroup().addTo(map);
    trailLayerRef.current = trailLayer;
    mapInstanceRef.current = map;

    // Click handler to add coordinate point
    map.on("click", (e: L.LeafletMouseEvent) => {
      const newPt: [number, number] = [
        Number(e.latlng.lat.toFixed(5)),
        Number(e.latlng.lng.toFixed(5)),
      ];
      // Access current coordinates via callback
      onChangeCoordinates([...coordinates, newPt]);
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [center]);

  // Update map click handler with latest coordinates
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.off("click");
    map.on("click", (e: L.LeafletMouseEvent) => {
      const newPt: [number, number] = [
        Number(e.latlng.lat.toFixed(5)),
        Number(e.latlng.lng.toFixed(5)),
      ];
      onChangeCoordinates([...coordinates, newPt]);
    });
  }, [coordinates, onChangeCoordinates]);

  // Redraw Trail & Start/Finish Markers whenever coordinates change
  useEffect(() => {
    const trailLayer = trailLayerRef.current;
    if (!trailLayer) return;

    trailLayer.clearLayers();

    if (coordinates.length > 0) {
      // Polyline
      const polyline = L.polyline(coordinates, {
        color: "#07626A",
        weight: 5,
        opacity: 0.9,
        lineCap: "round",
        lineJoin: "round",
      });
      trailLayer.addLayer(polyline);

      // Start Marker (A)
      const start = coordinates[0];
      const startIcon = L.divIcon({
        className: "trail-start-marker",
        html: `
          <div style="background-color: #07626A; color: #FFFFFF; width: 26px; height: 26px; border-radius: 50%; border: 2.5px solid #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800;">
            A
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });
      trailLayer.addLayer(L.marker(start, { icon: startIcon }));

      // Intermediate Points (small dots)
      for (let i = 1; i < coordinates.length - 1; i++) {
        const pt = coordinates[i];
        const dotIcon = L.divIcon({
          className: "trail-dot",
          html: `<div style="background-color: #07626A; width: 8px; height: 8px; border-radius: 50%; border: 1.5px solid #FFFFFF;"></div>`,
          iconSize: [8, 8],
          iconAnchor: [4, 4],
        });
        trailLayer.addLayer(L.marker(pt, { icon: dotIcon }));
      }

      // Finish Marker (B) if more than 1 point
      if (coordinates.length > 1) {
        const finish = coordinates[coordinates.length - 1];
        const finishIcon = L.divIcon({
          className: "trail-finish-marker",
          html: `
            <div style="background-color: #0D0D0D; color: #FFFFFF; width: 26px; height: 26px; border-radius: 50%; border: 2.5px solid #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800;">
              B
            </div>
          `,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
        });
        trailLayer.addLayer(L.marker(finish, { icon: finishIcon }));
      }
    }
  }, [coordinates]);

  const handleUndo = () => {
    if (coordinates.length === 0) return;
    onChangeCoordinates(coordinates.slice(0, -1));
  };

  const handleClear = () => {
    if (confirm("Очистить все точки маршрута?")) {
      onChangeCoordinates([]);
    }
  };

  // Approximate distance calculation
  const calculateDistance = () => {
    if (coordinates.length < 2) return 0;
    let totalMeters = 0;
    for (let i = 0; i < coordinates.length - 1; i++) {
      const p1 = L.latLng(coordinates[i][0], coordinates[i][1]);
      const p2 = L.latLng(coordinates[i + 1][0], coordinates[i + 1][1]);
      totalMeters += p1.distanceTo(p2);
    }
    return Number((totalMeters / 1000).toFixed(1));
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <label className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider block">
            Трек на карте (Leaflet OSM)
          </label>
          <span className="text-[11px] text-[#0D0D0D]/60">
            Кликайте по карте для добавления точек пути (A → B)
          </span>
        </div>

        {/* Stats & Actions */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-xl bg-[#F3F3F3] border border-[#E1E1E1] text-xs font-bold text-[#07626A]">
            {coordinates.length} точек • ~{calculateDistance()} км
          </div>

          <button
            type="button"
            onClick={handleUndo}
            disabled={coordinates.length === 0}
            className="p-1.5 rounded-lg bg-white border border-[#E1E1E1] hover:border-[#07626A] text-[#0D0D0D] disabled:opacity-40 transition-colors cursor-pointer"
            title="Отменить последнюю точку"
          >
            <Undo className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleClear}
            disabled={coordinates.length === 0}
            className="p-1.5 rounded-lg bg-white border border-[#E1E1E1] hover:border-rose-500 hover:text-rose-600 text-[#0D0D0D] disabled:opacity-40 transition-colors cursor-pointer"
            title="Очистить весь трек"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Map Canvas Container */}
      <div className="relative w-full h-[400px] sm:h-[460px] rounded-2xl border border-[#E1E1E1] overflow-hidden">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Custom Zoom Controls in Top Right */}
        <div className="absolute top-3 right-3 z-10 flex flex-col rounded-xl bg-white border border-[#E1E1E1] overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="p-2 hover:bg-[#F3F3F3] text-[#07626A] transition-colors border-b border-[#E1E1E1] cursor-pointer"
            title="Приблизить"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="p-2 hover:bg-[#F3F3F3] text-[#07626A] transition-colors cursor-pointer"
            title="Отдалить"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Helper Prompt */}
        <div className="absolute bottom-3 left-3 z-10 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-xs border border-[#E1E1E1] text-[11px] text-[#0D0D0D]/80 font-medium flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#07626A]" />
          <span>Кликните на карту, чтобы поставить следующую точку</span>
        </div>
      </div>
    </div>
  );
};
