"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { RouteItem, RouteRegion } from "@/types/route.types";
import { useLanguage } from "@/context/LanguageContext";

interface InteractiveLeafletMapProps {
  routes: RouteItem[];
  selectedRegion: RouteRegion;
  selectedRouteId: string | null;
  onSelectRoute: (id: string) => void;
}

export const InteractiveLeafletMap: React.FC<InteractiveLeafletMapProps> = ({
  routes,
  selectedRegion,
  selectedRouteId,
  onSelectRoute,
}) => {
  const { language } = useLanguage();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<L.FeatureGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [42.58, 74.56],
      zoom: 11,
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
    }).addTo(map);

    const layersGroup = L.featureGroup().addTo(map);
    layersGroupRef.current = layersGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Routes & POIs on Map
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = layersGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    const getRouteColor = (difficulty: RouteItem["difficulty"]) => {
      switch (difficulty) {
        case "easy":
          return "#07626A";
        case "medium":
          return "#E58A2B";
        case "hard":
          return "#D9383A";
        default:
          return "#07626A";
      }
    };

    routes.forEach((route) => {
      const isSelected = selectedRouteId === route.id;
      const color = getRouteColor(route.difficulty);
      const title = route.title[language] || route.title.ru;

      // Draw Trail Polyline
      const polyline = L.polyline(route.coordinates, {
        color,
        weight: isSelected ? 6 : 4,
        opacity: isSelected ? 1 : 0.85,
        lineCap: "round",
        lineJoin: "round",
      });

      polyline.on("click", () => onSelectRoute(route.id));
      polyline.bindPopup(`
        <div style="font-family: inherit; padding: 4px;">
          <h4 style="font-weight: 700; font-size: 14px; margin-bottom: 4px; color: #0D0D0D;">${title}</h4>
          <p style="font-size: 12px; color: #07626A; margin: 0;">${route.distanceKm} км • ~${route.durationHours} ч</p>
        </div>
      `);

      group.addLayer(polyline);

      // Trailhead Marker
      if (route.coordinates.length > 0) {
        const start = route.coordinates[0];
        const icon = L.divIcon({
          className: "custom-map-pin",
          html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2.5px solid #FFFFFF;"></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });

        const marker = L.marker(start, { icon });
        marker.on("click", () => onSelectRoute(route.id));
        group.addLayer(marker);
      }

      // POIs
      if (route.pois) {
        route.pois.forEach((poi) => {
          const poiName = poi.name[language] || poi.name.ru;
          const poiColor = poi.type === "guesthouse" ? "#E58A2B" : "#07626A";

          const poiIcon = L.divIcon({
            className: "custom-poi-pin",
            html: `<div style="background-color: ${poiColor}; width: 10px; height: 10px; border-radius: 50%; border: 2px solid #FFFFFF;"></div>`,
            iconSize: [10, 10],
            iconAnchor: [5, 5],
          });

          const poiMarker = L.marker([poi.lat, poi.lng], { icon: poiIcon });
          poiMarker.bindPopup(`
            <div style="font-family: inherit; font-size: 12px; font-weight: 600; color: #0D0D0D;">
              ${poiName}
            </div>
          `);
          group.addLayer(poiMarker);
        });
      }
    });

    // Zoom to fit bounds or selected region
    if (selectedRouteId) {
      const activeRoute = routes.find((r) => r.id === selectedRouteId);
      if (activeRoute) {
        map.flyTo(activeRoute.centerCoordinates, 13, { duration: 1 });
      }
    } else if (routes.length > 0) {
      if (selectedRegion === "ala-archa") {
        map.flyTo([42.545, 74.49], 12.5, { duration: 1 });
      } else if (selectedRegion === "alamedin") {
        map.flyTo([42.585, 74.69], 13, { duration: 1 });
      } else if (selectedRegion === "chunkurchak") {
        map.flyTo([42.625, 74.63], 13.5, { duration: 1 });
      } else {
        const bounds = group.getBounds();
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [40, 40] });
        }
      }
    }
  }, [routes, selectedRegion, selectedRouteId, language, onSelectRoute]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full min-h-[420px] sm:min-h-[500px] z-0 rounded-2xl sm:rounded-3xl"
    />
  );
};
