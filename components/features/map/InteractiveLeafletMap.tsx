"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { RouteItem, RouteRegion } from "@/types/route.types";
import { useLanguage } from "@/context/LanguageContext";
import {
  RotateCcw,
  Footprints,
  MapPin,
  Clock,
  TrendingUp,
  Compass,
  ArrowRight,
  Plus,
  Minus,
} from "lucide-react";

interface BasecampHub {
  id: string;
  name: {
    ru: string;
    kg: string;
    en: string;
  };
  region: RouteRegion;
  lat: number;
  lng: number;
  routeIds: string[];
}

const BASECAMPS: BasecampHub[] = [
  {
    id: "hub-alplager",
    name: {
      ru: "Альплагерь Ала-Арча",
      kg: "Ала-Арча Альплагери",
      en: "Ala-Archa Alpine Basecamp",
    },
    region: "ala-archa",
    lat: 42.5644,
    lng: 74.4823,
    routeIds: ["route-ratsek", "route-adygene"],
  },
  {
    id: "hub-teplye-klyuchi",
    name: {
      ru: "Термальный курорт «Теплые Ключи»",
      kg: "«Жылуу Булактар» комплекси",
      en: "Teplye Klyuchi Thermal Resort",
    },
    region: "alamedin",
    lat: 42.6318,
    lng: 74.6727,
    routeIds: ["route-alamedin"],
  },
  {
    id: "hub-supara-chunkurchak",
    name: {
      ru: "Этно-комплекс «Супара Чункурчак»",
      kg: "«Супара Чүңкүрчак» этно-комплекси",
      en: "Supara Chunkurchak Ethno Resort",
    },
    region: "chunkurchak",
    lat: 42.6389,
    lng: 74.6281,
    routeIds: ["route-chunkurchak"],
  },
];

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
  const basecampsGroupRef = useRef<L.FeatureGroup | null>(null);
  const activeTrailLayerRef = useRef<L.FeatureGroup | null>(null);

  const [selectedBasecamp, setSelectedBasecamp] = useState<BasecampHub | null>(null);
  const [activeRoute, setActiveRoute] = useState<RouteItem | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // 1. Initialize Leaflet Map without default top-left zoom controls
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [42.58, 74.56],
      zoom: 11,
      zoomControl: false, // Disables standard top-left zoom control
      attributionControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    const basecampsGroup = L.featureGroup().addTo(map);
    const activeTrailLayer = L.featureGroup().addTo(map);

    basecampsGroupRef.current = basecampsGroup;
    activeTrailLayerRef.current = activeTrailLayer;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Render Clean Basecamp Markers & Active Trail
  useEffect(() => {
    const map = mapInstanceRef.current;
    const basecampsGroup = basecampsGroupRef.current;
    const activeTrailLayer = activeTrailLayerRef.current;
    if (!map || !basecampsGroup || !activeTrailLayer) return;

    basecampsGroup.clearLayers();
    activeTrailLayer.clearLayers();

    const currentRoute = routes.find((r) => r.id === selectedRouteId) || null;
    setActiveRoute(currentRoute);

    // Filter Basecamps by selected region
    const visibleBasecamps =
      selectedRegion === "all"
        ? BASECAMPS
        : BASECAMPS.filter((b) => b.region === selectedRegion);

    // If NO route is selected -> render ONLY basecamp badges on a clean map
    if (!currentRoute) {
      visibleBasecamps.forEach((basecamp) => {
        const hubName = basecamp.name[language] || basecamp.name.ru;
        const availableRoutesCount = basecamp.routeIds.length;

        // Custom SVG icon for basecamp badge
        const hubIcon = L.divIcon({
          className: "clean-basecamp-pin",
          html: `
            <div style="background-color: #07626A; color: #FFFFFF; padding: 6px 12px; border-radius: 9999px; border: 2.5px solid #FFFFFF; display: inline-flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 700; white-space: nowrap; cursor: pointer;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              <span>${hubName}</span>
              <span style="background-color: rgba(255, 255, 255, 0.25); font-size: 10px; padding: 2px 6px; border-radius: 9999px;">${availableRoutesCount} маршр.</span>
            </div>
          `,
          iconSize: [160, 34],
          iconAnchor: [80, 17],
        });

        const marker = L.marker([basecamp.lat, basecamp.lng], { icon: hubIcon });
        marker.on("click", () => {
          setSelectedBasecamp(basecamp);
          map.flyTo([basecamp.lat, basecamp.lng], 13, { duration: 0.8 });
        });

        basecampsGroup.addLayer(marker);
      });

      // Fit map view
      if (selectedRegion === "ala-archa") {
        map.flyTo([42.545, 74.49], 12.5, { duration: 0.8 });
      } else if (selectedRegion === "alamedin") {
        map.flyTo([42.61, 74.68], 13, { duration: 0.8 });
      } else if (selectedRegion === "chunkurchak") {
        map.flyTo([42.625, 74.63], 13.5, { duration: 0.8 });
      } else {
        const bounds = basecampsGroup.getBounds();
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [60, 60] });
        }
      }
    } else {
      // IF ROUTE IS SELECTED: Draw ONLY this trail and its Start (A) & Finish (B)
      const coords = currentRoute.coordinates;
      const start = coords[0];
      const finish = coords[coords.length - 1];

      // Polyline for the active trail
      const polyline = L.polyline(coords, {
        color: "#07626A",
        weight: 6,
        opacity: 0.9,
        lineCap: "round",
        lineJoin: "round",
      });
      activeTrailLayer.addLayer(polyline);

      // Start Marker (A)
      const startIcon = L.divIcon({
        className: "trail-start-marker",
        html: `
          <div style="background-color: #07626A; color: #FFFFFF; width: 28px; height: 28px; border-radius: 50%; border: 2.5px solid #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800;">
            A
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
      const startMarker = L.marker(start, { icon: startIcon });
      activeTrailLayer.addLayer(startMarker);

      // Finish Marker (B)
      const finishIcon = L.divIcon({
        className: "trail-finish-marker",
        html: `
          <div style="background-color: #0D0D0D; color: #FFFFFF; width: 28px; height: 28px; border-radius: 50%; border: 2.5px solid #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800;">
            B
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
      const finishMarker = L.marker(finish, { icon: finishIcon });
      activeTrailLayer.addLayer(finishMarker);

      map.fitBounds(polyline.getBounds(), { padding: [80, 80], maxZoom: 14 });
    }
  }, [routes, selectedRegion, selectedRouteId, language, onSelectRoute]);

  // Handle choosing a trail from the basecamp popup
  const handleSelectRouteFromBasecamp = (routeId: string) => {
    setSelectedBasecamp(null);
    onSelectRoute(routeId);
  };

  const handleReset = () => {
    setSelectedBasecamp(null);
    onSelectRoute("");
  };

  // Custom Zoom Handlers
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  // Locate User GPS
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Геолокация не поддерживается");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        const map = mapInstanceRef.current;
        if (map) {
          map.flyTo([latitude, longitude], 13);
        }
      },
      () => {
        setIsLocating(false);
        alert("Не удалось определить координаты GPS");
      }
    );
  };

  const startPt = activeRoute?.coordinates[0] || [42.56, 74.48];
  const finishPt = activeRoute?.coordinates[activeRoute.coordinates.length - 1] || [42.52, 74.52];

  return (
    <div className="relative w-full h-full min-h-[580px] sm:min-h-[660px] lg:min-h-[720px]">
      {/* Leaflet Map Canvas */}
      <div
        ref={mapContainerRef}
        className="w-full h-full min-h-[580px] sm:min-h-[660px] lg:min-h-[720px] z-0 rounded-2xl sm:rounded-3xl"
      />

      {/* Top Right Controls: GPS Locate & Custom Zoom In/Out Buttons */}
      <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2.5">
        {/* GPS Locate Button */}
        <button
          type="button"
          onClick={handleLocateMe}
          disabled={isLocating}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border border-[#E1E1E1] hover:border-[#07626A] text-xs font-semibold text-[#07626A] transition-colors cursor-pointer"
        >
          <Compass className={`w-4 h-4 ${isLocating ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">
            {isLocating ? "Определяем..." : "Моё местоположение"}
          </span>
        </button>

        {/* Custom Clean Zoom In (+) / Zoom Out (-) Controls in Top-Right */}
        <div className="flex flex-col rounded-xl bg-white border border-[#E1E1E1] overflow-hidden">
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-2.5 hover:bg-[#F0F2F2] text-[#07626A] transition-colors border-b border-[#E1E1E1] cursor-pointer flex items-center justify-center"
            title="Приблизить карту"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-2.5 hover:bg-[#F0F2F2] text-[#07626A] transition-colors cursor-pointer flex items-center justify-center"
            title="Отдалить карту"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 1. Modal: Select Route from Clicked Basecamp */}
      {selectedBasecamp && !activeRoute && (
        <div className="absolute top-4 left-4 right-4 sm:right-auto sm:w-[380px] z-10 p-5 rounded-2xl bg-white border border-[#E1E1E1] flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase text-[#07626A] block">
                База отдыха / Хаб
              </span>
              <h4 className="text-sm sm:text-base font-bold text-[#0D0D0D]">
                {selectedBasecamp.name[language] || selectedBasecamp.name.ru}
              </h4>
            </div>

            <button
              type="button"
              onClick={() => setSelectedBasecamp(null)}
              className="p-1.5 rounded-lg text-[#0D0D0D]/60 hover:text-[#0D0D0D] hover:bg-[#F0F2F2] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-[#0D0D0D]/70">
            Выберите пеший маршрут от этой базы отдыха:
          </p>

          {/* List of Available Trails */}
          <div className="flex flex-col gap-2">
            {selectedBasecamp.routeIds.map((rId) => {
              const r = routes.find((item) => item.id === rId);
              if (!r) return null;
              const rTitle = r.title[language] || r.title.ru;

              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleSelectRouteFromBasecamp(r.id)}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#F0F2F2] border border-[#E1E1E1] hover:border-[#07626A] transition-colors text-left cursor-pointer group"
                >
                  <div>
                    <h5 className="text-xs font-bold text-[#0D0D0D] group-hover:text-[#07626A] transition-colors">
                      {rTitle}
                    </h5>
                    <span className="text-[11px] text-[#0D0D0D]/60 mt-0.5 block">
                      {r.distanceKm} км • ~{r.durationHours} ч • +{r.elevationGainMeters} м
                    </span>
                  </div>

                  <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[#07626A] shrink-0 border border-[#E1E1E1] group-hover:bg-[#07626A] group-hover:text-white transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Active Route Navigation Panel */}
      {activeRoute && (
        <div className="absolute top-4 left-4 right-4 sm:right-auto sm:w-[380px] z-10 p-5 rounded-2xl bg-white border border-[#E1E1E1] flex flex-col gap-3">
          {/* Header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-[#07626A]"
                style={{ backgroundColor: "rgba(7, 98, 106, 0.10)" }}
              >
                <Footprints className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase text-[#07626A] block">
                  Пеший маршрут проложен
                </span>
                <h4 className="text-sm sm:text-base font-bold text-[#0D0D0D] leading-snug">
                  {activeRoute.title[language] || activeRoute.title.ru}
                </h4>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 rounded-lg text-[#0D0D0D]/60 hover:text-[#0D0D0D] hover:bg-[#F0F2F2] transition-colors cursor-pointer"
              title="Назад к базам отдыха"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Checkpoints A -> B */}
          <div className="p-3 rounded-xl bg-[#F0F2F2] border border-[#E1E1E1] space-y-2 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#07626A] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                A
              </span>
              <span className="font-semibold text-[#0D0D0D]">
                Старт: {activeRoute.pois?.[0]?.name.ru || "База отдыха"}
              </span>
            </div>

            <div className="border-l-2 border-dashed border-[#07626A]/40 ml-2.5 pl-4 py-0.5 text-[11px] text-[#0D0D0D]/70">
              Пешая тропа ({activeRoute.distanceKm} км)
            </div>

            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#0D0D0D] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                B
              </span>
              <span className="font-semibold text-[#0D0D0D]">
                Финиш: {activeRoute.title[language] || activeRoute.title.ru}
              </span>
            </div>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div
              className="p-2 rounded-xl border border-[#E1E1E1]"
              style={{ backgroundColor: "rgba(7, 98, 106, 0.05)" }}
            >
              <div className="flex items-center justify-center gap-1 text-[10px] text-[#0D0D0D]/60 font-medium mb-0.5">
                <MapPin className="w-3 h-3 text-[#07626A]" />
                <span>Дистанция</span>
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#0D0D0D]">
                {activeRoute.distanceKm} км
              </span>
            </div>

            <div
              className="p-2 rounded-xl border border-[#E1E1E1]"
              style={{ backgroundColor: "rgba(7, 98, 106, 0.05)" }}
            >
              <div className="flex items-center justify-center gap-1 text-[10px] text-[#0D0D0D]/60 font-medium mb-0.5">
                <Clock className="w-3 h-3 text-[#07626A]" />
                <span>Пешком</span>
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#0D0D0D]">
                ~{activeRoute.durationHours} ч
              </span>
            </div>

            <div
              className="p-2 rounded-xl border border-[#E1E1E1]"
              style={{ backgroundColor: "rgba(7, 98, 106, 0.05)" }}
            >
              <div className="flex items-center justify-center gap-1 text-[10px] text-[#0D0D0D]/60 font-medium mb-0.5">
                <TrendingUp className="w-3 h-3 text-[#07626A]" />
                <span>Набор</span>
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#0D0D0D]">
                +{activeRoute.elevationGainMeters} м
              </span>
            </div>
          </div>

          {/* Action: Find Verified Guide */}
          <div className="pt-1 border-t border-[#E1E1E1]">
            <Link
              href="/tours"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#07626A] text-white text-xs font-bold hover:bg-[#07626A]/90 transition-colors"
            >
              <span>
                {language === "kg"
                  ? "Бул маршрутка гид тандоо"
                  : language === "en"
                  ? "Find a Guide for this Trail"
                  : "Найти гида на этот маршрут"}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* 3. Bottom/Top Helper prompt when no basecamp or route is active */}
      {!selectedBasecamp && !activeRoute && (
        <div className="absolute top-4 left-4 z-10 px-4 py-2.5 rounded-xl bg-white border border-[#E1E1E1] flex items-center gap-2 pointer-events-none">
          <Footprints className="w-4 h-4 text-[#07626A]" />
          <span className="text-xs font-medium text-[#0D0D0D]">
            Нажмите на базу отдыха на карте или выберите маршрут из списка ниже
          </span>
        </div>
      )}
    </div>
  );
};
