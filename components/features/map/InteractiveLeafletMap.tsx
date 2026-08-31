"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { RouteItem, RouteRegion, AssignedGuide } from "@/types/route.types";
import { useLanguage } from "@/context/LanguageContext";
import {
  Footprints,
  MapPin,
  Clock,
  TrendingUp,
  Compass,
  ArrowRight,
  ArrowLeft,
  Plus,
  Minus,
  ShieldCheck,
  Phone,
  MessageCircle,
  Users,
  X,
  ShieldAlert,
  ChevronDown,
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
  const [selectedGuideIndex, setSelectedGuideIndex] = useState<number>(0);
  const [showSafetyModal, setShowSafetyModal] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState(false);

  // 1. Initialize Leaflet Map without default top-left zoom controls
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [42.58, 74.56],
      zoom: 11,
      zoomControl: false,
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
    setSelectedGuideIndex(0);
    setShowSafetyModal(false);

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

  // Seamless Back Button: Returns directly to basecamp's route options without resetting filters
  const handleBackToRoutes = () => {
    const parentBasecamp = activeRoute
      ? BASECAMPS.find((b) => b.routeIds.includes(activeRoute.id)) || null
      : null;

    onSelectRoute("");
    if (parentBasecamp) {
      setSelectedBasecamp(parentBasecamp);
    } else {
      setSelectedBasecamp(null);
    }
  };

  const handleCloseBasecampModal = () => {
    setSelectedBasecamp(null);
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

  const activeTitle = activeRoute ? activeRoute.title[language] || activeRoute.title.ru : "";
  const guides: AssignedGuide[] = activeRoute
    ? activeRoute.assignedGuides && activeRoute.assignedGuides.length > 0
      ? activeRoute.assignedGuides
      : activeRoute.assignedGuide
      ? [activeRoute.assignedGuide]
      : []
    : [];

  const currentGuide = guides[selectedGuideIndex] || guides[0] || null;

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
        <div className="absolute top-4 left-4 right-4 sm:right-auto sm:w-[380px] z-10 p-5 rounded-2xl bg-white border border-[#E1E1E1] flex flex-col gap-3 animate-in fade-in duration-200">
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
              onClick={handleCloseBasecampModal}
              className="p-1.5 rounded-lg text-[#0D0D0D]/60 hover:text-[#0D0D0D] hover:bg-[#F0F2F2] transition-colors cursor-pointer"
              title="Закрыть"
            >
              <X className="w-4 h-4" />
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

      {/* 2. Active Route Navigation & Attached Guides Panel */}
      {activeRoute && (
        <div className="absolute top-4 left-4 right-4 sm:right-auto sm:w-[380px] z-10 p-5 rounded-2xl bg-white border border-[#E1E1E1] flex flex-col gap-3 animate-in fade-in duration-200">
          {/* Header with Clear Back Action */}
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleBackToRoutes}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#F0F2F2] hover:bg-[#E1E1E1] text-[#07626A] text-xs font-bold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Назад к маршрутам</span>
            </button>

            {/* Interactive Safety Trigger Button */}
            <button
              type="button"
              onClick={() => setShowSafetyModal((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                showSafetyModal
                  ? "bg-[#07626A] text-white border-[#07626A]"
                  : "bg-white text-[#07626A] border-[#E1E1E1] hover:border-[#07626A]"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Совет</span>
            </button>
          </div>

          <div>
            <h4 className="text-sm sm:text-base font-bold text-[#0D0D0D] leading-snug">
              {activeTitle}
            </h4>
          </div>

          {/* Expandable Safety Guidance Notice */}
          {showSafetyModal && (
            <div className="p-3 rounded-xl border border-[#07626A]/20 bg-[#F0F2F2] flex items-start gap-2.5 animate-in fade-in duration-150">
              <ShieldCheck className="w-4 h-4 text-[#07626A] shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-[#07626A] block mb-0.5">
                  Совет безопасности Aiym Path:
                </span>
                <p className="text-[#0D0D0D]/85 leading-relaxed">
                  Сообщайте маршрут доверенному человеку, проверяйте прогноз погоды и берите с собой аптечку. На сложных участках двигайтесь группой, а не поодиночке.
                </p>
              </div>
            </div>
          )}

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
              Пешая горная тропа ({activeRoute.distanceKm} км)
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

          {/* Attached Female Guides Section */}
          {guides.length > 0 && currentGuide && (
            <div className="p-3.5 rounded-xl bg-[#F0F2F2] border border-[#E1E1E1] flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-[#07626A] flex items-center gap-1">
                  {guides.length > 1 ? (
                    <>
                      <Users className="w-3.5 h-3.5" />
                      <span>Доступные гиды ({guides.length})</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Ответственный гид</span>
                    </>
                  )}
                </span>
                <span className="text-[10px] font-semibold text-[#0D0D0D]/60">
                  {currentGuide.experienceYears} лет опыта
                </span>
              </div>

              {/* If multiple guides: Capsule selector tabs */}
              {guides.length > 1 && (
                <div className="flex items-center gap-1.5 p-1 bg-white rounded-lg border border-[#E1E1E1]">
                  {guides.map((g, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedGuideIndex(idx)}
                      className={`flex-1 py-1 px-2 rounded-md text-[11px] font-bold transition-colors cursor-pointer truncate ${
                        selectedGuideIndex === idx
                          ? "bg-[#07626A] text-white"
                          : "text-[#0D0D0D]/70 hover:bg-[#F0F2F2]"
                      }`}
                    >
                      {g.name.split(" ")[0]}
                    </button>
                  ))}
                </div>
              )}

              {/* Current Active Guide Profile */}
              <div className="flex items-center gap-2.5">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white border border-[#E1E1E1] shrink-0">
                  {currentGuide.image ? (
                    <Image
                      src={currentGuide.image}
                      alt={currentGuide.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#07626A]/10 text-[#07626A] font-bold text-xs">
                      {currentGuide.name[0]}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-bold text-[#0D0D0D] truncate">
                    {currentGuide.name}
                  </h5>
                  <p className="text-[11px] text-[#0D0D0D]/65 truncate">
                    {currentGuide.role[language] || currentGuide.role.ru}
                  </p>
                </div>
              </div>

              {/* Direct WhatsApp & Phone Action Buttons */}
              <div className="flex items-center gap-2 pt-1 border-t border-[#E1E1E1]">
                <a
                  href={`https://wa.me/${currentGuide.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                    `Здравствуйте, ${currentGuide.name}! Хочу узнать о сопровождении по маршруту «${activeTitle}».`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#07626A] text-white text-xs font-bold hover:bg-[#07626A]/90 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={`tel:${currentGuide.phone.replace(/\s+/g, "")}`}
                  className="inline-flex items-center justify-center p-2 rounded-xl text-[#07626A] border border-[#E1E1E1] hover:border-[#07626A] bg-white transition-colors cursor-pointer"
                  title={`Позвонить ${currentGuide.name}`}
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}
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
