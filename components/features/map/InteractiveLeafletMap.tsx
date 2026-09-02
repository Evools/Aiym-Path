"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { RouteItem, RouteRegion, RouteFilterRegion, AssignedGuide } from "@/types/route.types";
import { AdminLocationItem } from "@/lib/services/admin-storage.service";
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
  ChevronUp,
  Maximize2,
  Minimize2,
} from "lucide-react";

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

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

const SEED_BASECAMPS: BasecampHub[] = [
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
  locations?: AdminLocationItem[];
  selectedRegion: RouteFilterRegion;
  selectedRouteId: string | null;
  onSelectRoute: (id: string) => void;
}

export const InteractiveLeafletMap: React.FC<InteractiveLeafletMapProps> = ({
  routes,
  locations = [],
  selectedRegion,
  selectedRouteId,
  onSelectRoute,
}) => {
  const { language } = useLanguage();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const basecampsLayerRef = useRef<L.FeatureGroup | null>(null);
  const trailsLayerRef = useRef<L.FeatureGroup | null>(null);
  const userLocationLayerRef = useRef<L.FeatureGroup | null>(null);
  const prevSelectionRef = useRef<{ region: string; routeId: string | null }>({
    region: "",
    routeId: null,
  });

  const [isMapReady, setIsMapReady] = useState<boolean>(false);
  const [selectedBasecamp, setSelectedBasecamp] = useState<BasecampHub | null>(null);

  // Dynamic Basecamps & Trailheads computed from real admin routes and locations
  const allBasecamps: BasecampHub[] = useMemo(() => {
    const hubsMap = new Map<string, BasecampHub>();

    // 1. Seed basecamps
    SEED_BASECAMPS.forEach((b) => {
      hubsMap.set(b.id, {
        ...b,
        routeIds: [],
      });
    });

    // 2. Admin locations
    if (locations && locations.length > 0) {
      locations.forEach((loc) => {
        if (loc.coordinates && loc.coordinates.length === 2) {
          if (!hubsMap.has(loc.id)) {
            hubsMap.set(loc.id, {
              id: loc.id,
              name: loc.title,
              region: "ala-archa",
              lat: loc.coordinates[0],
              lng: loc.coordinates[1],
              routeIds: [],
            });
          }
        }
      });
    }

    // 3. Match each route to a nearby hub (< 3km) or create a trailhead hub
    routes.forEach((route) => {
      const startPt = route.pois?.[0]
        ? [route.pois[0].lat, route.pois[0].lng]
        : route.coordinates?.[0] || route.centerCoordinates;

      if (!startPt || startPt.length < 2) return;
      const [startLat, startLng] = startPt;

      let matchedHub: BasecampHub | null = null;
      for (const hub of hubsMap.values()) {
        const distKm = getDistanceKm(hub.lat, hub.lng, startLat, startLng);
        if (distKm < 3.0) {
          hub.routeIds.push(route.id);
          matchedHub = hub;
          break;
        }
      }

      if (!matchedHub) {
        const hubId = `hub-${route.id}`;
        hubsMap.set(hubId, {
          id: hubId,
          name: route.title,
          region: route.region,
          lat: startLat,
          lng: startLng,
          routeIds: [route.id],
        });
      }
    });

    return Array.from(hubsMap.values()).filter((h) => h.routeIds.length > 0);
  }, [routes, locations]);

  const activeRoute = useMemo(
    () => (selectedRouteId ? routes.find((r) => r.id === selectedRouteId) || null : null),
    [selectedRouteId, routes]
  );
  const [collapsedRouteId, setCollapsedRouteId] = useState<string | null>(null);
  const isCardCollapsed = Boolean(selectedRouteId && collapsedRouteId === selectedRouteId);

  const [selectedGuideIndex, setSelectedGuideIndex] = useState<number>(0);
  const [showSafetyModal, setShowSafetyModal] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [42.58, 74.56],
      zoom: 11,
      zoomControl: false,
      attributionControl: false,
      tapHold: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    const basecampsLayer = L.featureGroup().addTo(map);
    const trailsLayer = L.featureGroup().addTo(map);
    const userLocationLayer = L.featureGroup().addTo(map);

    basecampsLayerRef.current = basecampsLayer;
    trailsLayerRef.current = trailsLayer;
    userLocationLayerRef.current = userLocationLayer;
    mapInstanceRef.current = map;
    setIsMapReady(true);

    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      setIsMapReady(false);
    };
  }, []);

  // Lock body scroll when in fullscreen mode
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  // Handle Fullscreen resize update reliably
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => {
      const next = !prev;
      requestAnimationFrame(() => {
        mapInstanceRef.current?.invalidateSize();
      });
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 50);
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 250);
      return next;
    });
  }, []);

  // 2. Render Basecamp Hubs, Paths & Smooth Camera Navigation
  useEffect(() => {
    const map = mapInstanceRef.current;
    const basecampsLayer = basecampsLayerRef.current;
    const trailsLayer = trailsLayerRef.current;

    if (!map || !basecampsLayer || !trailsLayer || !isMapReady) return;

    basecampsLayer.clearLayers();
    trailsLayer.clearLayers();

    const currentRoute = activeRoute;
    const visibleBasecamps =
      selectedRegion === "all"
        ? allBasecamps
        : allBasecamps.filter((b) => b.region === selectedRegion);

    const routesInRegion =
      selectedRegion === "all"
        ? routes
        : routes.filter((r) => r.region === selectedRegion);

    const selectionChanged =
      prevSelectionRef.current.region !== selectedRegion ||
      prevSelectionRef.current.routeId !== selectedRouteId;

    // If a specific route is selected: Draw clean path with start A and finish B
    if (currentRoute && currentRoute.coordinates && currentRoute.coordinates.length > 0) {
      const points = currentRoute.coordinates;

      // Thin white outline for contrast on map terrain
      L.polyline(points, {
        color: "#FFFFFF",
        weight: 4.5,
        opacity: 0.6,
        lineCap: "round",
        lineJoin: "round",
      }).addTo(trailsLayer);

      // Neat, thin main path line
      const polyline = L.polyline(points, {
        color: "#07626A",
        weight: 2.8,
        opacity: 0.95,
        lineCap: "round",
        lineJoin: "round",
      }).addTo(trailsLayer);

      const startPt = points[0];
      const finishPt = points[points.length - 1];

      // Start Marker (A)
      const startIcon = L.divIcon({
        className: "trail-marker-start",
        html: `
          <div style="background-color: #07626A; color: #FFFFFF; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 10px; border: 1.5px solid #FFFFFF; box-shadow: 0 2px 6px rgba(0,0,0,0.25);">
            A
          </div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });
      L.marker(startPt, { icon: startIcon }).addTo(trailsLayer);

      // Finish Marker (B)
      const finishIcon = L.divIcon({
        className: "trail-marker-finish",
        html: `
          <div style="background-color: #0D0D0D; color: #FFFFFF; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 10px; border: 1.5px solid #FFFFFF; box-shadow: 0 2px 6px rgba(0,0,0,0.25);">
            B
          </div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });
      L.marker(finishPt, { icon: finishIcon }).addTo(trailsLayer);

      // Smoothly fly to the route bounds
      if (selectionChanged) {
        map.flyToBounds(polyline.getBounds(), {
          padding: [60, 60],
          maxZoom: 14,
          duration: 1.0,
        });
      }
    } else {
      // Overview mode: Render Basecamp Hubs & Clean Trail Paths
      visibleBasecamps.forEach((basecamp) => {
        const campName =
          typeof basecamp.name === "object"
            ? basecamp.name[language] || basecamp.name.ru || "База"
            : String(basecamp.name);
        const count = basecamp.routeIds.length;

        const basecampIcon = L.divIcon({
          className: "custom-basecamp-pin",
          html: `
            <div style="background-color: #07626A; color: #FFFFFF; padding: 6px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; border: 2px solid #FFFFFF; box-shadow: 0 4px 12px rgba(0,0,0,0.25); display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; cursor: pointer;">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>
              <span>${campName}</span>
              <span style="background-color: rgba(255,255,255,0.25); padding: 1px 6px; border-radius: 9999px; font-size: 10px;">${count}</span>
            </div>
          `,
          iconSize: [160, 32],
          iconAnchor: [80, 16],
        });

        const marker = L.marker([basecamp.lat, basecamp.lng], {
          icon: basecampIcon,
        });

        marker.on("click", (e) => {
          L.DomEvent.stopPropagation(e);
          if (basecamp.routeIds.length === 1) {
            onSelectRoute(basecamp.routeIds[0]);
          } else {
            setSelectedBasecamp(basecamp);
            onSelectRoute("");
          }
        });

        basecampsLayer.addLayer(marker);
      });

      // Fly map to the bounds of the selected region or all regions
      if (selectionChanged) {
        const regionBounds = L.latLngBounds([]);

        routesInRegion.forEach((r) => {
          if (r.coordinates && r.coordinates.length > 0) {
            r.coordinates.forEach((pt) => regionBounds.extend(pt));
          } else if (r.centerCoordinates) {
            regionBounds.extend(r.centerCoordinates);
          }
        });

        visibleBasecamps.forEach((b) => {
          regionBounds.extend([b.lat, b.lng]);
        });

        if (regionBounds.isValid()) {
          map.flyToBounds(regionBounds, {
            padding: [55, 55],
            maxZoom: selectedRegion === "all" ? 11 : 13,
            duration: 1.0,
          });
        } else if (selectedRegion === "all") {
          map.flyTo([42.58, 74.56], 11, { duration: 1.0 });
        }
      }
    }

    prevSelectionRef.current = {
      region: selectedRegion,
      routeId: selectedRouteId,
    };
  }, [routes, selectedRegion, selectedRouteId, activeRoute, language, onSelectRoute, isMapReady, allBasecamps]);

  // Handle selecting a route from the basecamp popup
  const handleSelectRouteFromBasecamp = (routeId: string) => {
    setSelectedBasecamp(null);
    onSelectRoute(routeId);
  };

  const handleBackToRoutes = () => {
    const parentBasecamp = activeRoute
      ? allBasecamps.find((b) => b.routeIds.includes(activeRoute.id)) || null
      : null;

    onSelectRoute("");
    if (parentBasecamp && parentBasecamp.routeIds.length > 1) {
      setSelectedBasecamp(parentBasecamp);
    } else {
      setSelectedBasecamp(null);
    }
  };

  const handleCloseBasecampModal = () => {
    setSelectedBasecamp(null);
  };

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  // Locate User GPS & render current location marker
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Геолокация не поддерживается вашим браузером");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude, accuracy } = pos.coords;
        const map = mapInstanceRef.current;
        const userLayer = userLocationLayerRef.current;
        if (!map) return;

        if (userLayer) {
          userLayer.clearLayers();

          // Translucent accuracy circle
          L.circle([latitude, longitude], {
            radius: Math.max(accuracy || 25, 20),
            color: "#0284C7",
            fillColor: "#0284C7",
            fillOpacity: 0.12,
            weight: 1.5,
          }).addTo(userLayer);

          // Pulsing user location marker
          const userPinIcon = L.divIcon({
            className: "user-gps-location-pin",
            html: `
              <div style="position: relative; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
                <div style="position: absolute; width: 24px; height: 24px; border-radius: 50%; background-color: #0284C7; opacity: 0.45; animation: gpsPulse 2s infinite ease-out;"></div>
                <div style="width: 14px; height: 14px; border-radius: 50%; background-color: #0284C7; border: 2.5px solid #FFFFFF; box-shadow: 0 2px 8px rgba(0,0,0,0.35); position: relative; z-index: 2;"></div>
              </div>
              <style>
                @keyframes gpsPulse {
                  0% { transform: scale(0.7); opacity: 0.8; }
                  70% { transform: scale(2.4); opacity: 0; }
                  100% { transform: scale(2.4); opacity: 0; }
                }
              </style>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });

          const userMarker = L.marker([latitude, longitude], {
            icon: userPinIcon,
            zIndexOffset: 1000,
          }).addTo(userLayer);

          userMarker
            .bindTooltip(
              `<div style="text-align:center; font-weight:700; color:#0284C7; font-size:11px;">Вы здесь</div>`,
              { permanent: false, direction: "top", offset: [0, -10] }
            )
            .openTooltip();
        }

        map.flyTo([latitude, longitude], 14, { duration: 1.2 });
      },
      (err) => {
        setIsLocating(false);
        if (err.code === 1) {
          alert("Доступ к геолокации запрещен в браузере. Разрешите доступ к геопозиции в настройках сайта.");
        } else {
          alert("Не удалось определить координаты GPS");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
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
    <div
      className={
        isFullscreen
          ? "fixed inset-0 z-[9999] w-screen h-screen bg-[#F0F2F2]"
          : "relative w-full h-full min-h-[460px] sm:min-h-[660px] lg:min-h-[720px] rounded-2xl sm:rounded-3xl overflow-hidden"
      }
    >
      {/* Leaflet Map Canvas */}
      <div
        ref={mapContainerRef}
        className="w-full h-full min-h-[460px] sm:min-h-[660px] lg:min-h-[720px] z-0"
      />

      {/* Floating Map Controls (Fullscreen, GPS, Zoom) */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-col items-end gap-2">
        {/* Fullscreen Toggle */}
        <button
          type="button"
          onClick={toggleFullscreen}
          className="flex items-center gap-1.5 p-2.5 sm:px-3.5 sm:py-2.5 rounded-xl bg-white border border-[#E1E1E1] hover:border-[#07626A] text-xs font-semibold text-[#07626A] shadow-md transition-colors cursor-pointer"
          title={isFullscreen ? "Свернуть карту" : "Развернуть на весь экран"}
        >
          {isFullscreen ? (
            <>
              <Minimize2 className="w-4 h-4" />
              <span className="hidden sm:inline">Свернуть</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-4 h-4" />
              <span className="hidden sm:inline">Во весь экран</span>
            </>
          )}
        </button>

        {/* GPS Locate Button */}
        <button
          type="button"
          onClick={handleLocateMe}
          disabled={isLocating}
          className="flex items-center gap-1.5 p-2.5 sm:px-3.5 sm:py-2.5 rounded-xl bg-white border border-[#E1E1E1] hover:border-[#07626A] text-xs font-semibold text-[#07626A] shadow-md transition-colors cursor-pointer"
          title="Моё местоположение"
        >
          <Compass className={`w-4 h-4 ${isLocating ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">
            {isLocating ? "Определяем..." : "Моё местоположение"}
          </span>
        </button>

        {/* Zoom Controls */}
        <div className="flex flex-col rounded-xl bg-white border border-[#E1E1E1] shadow-md overflow-hidden">
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

      {/* 1. Modal: Select Route from Clicked Basecamp (Mobile Bottom Sheet / Desktop Overlay) */}
      {selectedBasecamp && !activeRoute && (
        <div className="fixed sm:absolute bottom-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-auto sm:bottom-auto sm:w-[380px] z-30 p-4 sm:p-5 rounded-2xl bg-white border border-[#E1E1E1] shadow-2xl flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200 max-h-[75vh] overflow-y-auto">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase text-[#07626A] block">
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

      {/* 2. Active Route Navigation & Full Information Panel (Mobile Bottom Sheet / Desktop Overlay) */}
      {activeRoute && (
        <div className="fixed sm:absolute bottom-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-auto sm:bottom-auto sm:w-[380px] z-30 p-4 sm:p-5 rounded-2xl bg-white border border-[#E1E1E1] shadow-2xl flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200 max-h-[80vh] overflow-y-auto">
          {/* Header with Clear Back Action and Mobile Collapse Toggle */}
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleBackToRoutes}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#F0F2F2] hover:bg-[#E1E1E1] text-[#07626A] text-xs font-bold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Назад к маршрутам</span>
            </button>

            <div className="flex items-center gap-1.5">
              {/* Interactive Safety Trigger Button */}
              <button
                type="button"
                onClick={() => setShowSafetyModal((prev) => !prev)}
                className={`inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                  showSafetyModal
                    ? "bg-[#07626A] text-white border-[#07626A]"
                    : "bg-white text-[#07626A] border-[#E1E1E1] hover:border-[#07626A]"
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Совет</span>
              </button>

              {/* Mobile Collapse/Expand Button */}
              <button
                type="button"
                onClick={() =>
                  setCollapsedRouteId((prev) =>
                    prev === selectedRouteId ? null : (selectedRouteId ?? null)
                  )
                }
                className="p-1.5 rounded-lg bg-[#F0F2F2] hover:bg-[#E1E1E1] text-[#0D0D0D]/70 transition-colors cursor-pointer sm:hidden"
                title={isCardCollapsed ? "Развернуть детали" : "Свернуть карточку"}
              >
                {isCardCollapsed ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-sm sm:text-base font-bold text-[#0D0D0D] leading-snug">
              {activeTitle}
            </h4>
            {isCardCollapsed && (
              <span className="text-[11px] text-[#07626A] font-semibold block mt-0.5">
                {activeRoute.distanceKm} км • ~{activeRoute.durationHours} ч • +{activeRoute.elevationGainMeters} м
              </span>
            )}
          </div>

          {/* Full content when not collapsed */}
          {!isCardCollapsed && (
            <>
              {/* Route Description */}
              {activeRoute.description && (
                <div className="p-3 rounded-xl bg-[#F0F2F2] border border-[#E1E1E1] text-xs text-[#0D0D0D]/80 leading-relaxed">
                  <p>{activeRoute.description[language] || activeRoute.description.ru}</p>
                </div>
              )}

              {/* Expandable Safety Guidance Notice */}
              {showSafetyModal && (
                <div className="p-3 rounded-xl border border-[#07626A]/20 bg-[#F0F2F2] flex items-start gap-2.5 animate-in fade-in duration-150">
                  <ShieldCheck className="w-4 h-4 text-[#07626A] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold text-[#07626A] block mb-0.5">
                      Совет безопасности Aiym Path:
                    </span>
                    <p className="text-[#0D0D0D]/85 leading-relaxed">
                      Сообщайте маршрут доверенному человеку, проверяйте прогноз погоды и берите с собой аптечку. На сложных участках двигайтесь группой.
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
                    Старт: {activeRoute.pois?.[0]?.name[language] || activeRoute.pois?.[0]?.name.ru || "База отдыха"}
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
            </>
          )}
        </div>
      )}

      {/* Helper prompt when no route or basecamp is active */}
      {!selectedBasecamp && !activeRoute && (
        <div className="hidden sm:flex absolute top-4 left-4 z-10 px-4 py-2.5 rounded-xl bg-white border border-[#E1E1E1] shadow-sm items-center gap-2 pointer-events-none">
          <Footprints className="w-4 h-4 text-[#07626A]" />
          <span className="text-xs font-medium text-[#0D0D0D]">
            Нажмите на базу отдыха на карте или выберите маршрут из списка ниже
          </span>
        </div>
      )}
    </div>
  );
};
