"use client";

import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Undo,
  Trash2,
  Plus,
  Minus,
  MapPin,
  Search,
  Zap,
  PenTool,
  Loader2,
  Navigation,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/context/ToastContext";

interface RouteMetrics {
  distanceKm: number;
  durationHours: number;
  elevationGainMeters: number;
}

interface RouteMapEditorProps {
  coordinates: [number, number][];
  onChangeCoordinates: (coords: [number, number][]) => void;
  center?: [number, number];
  onDistanceCalculated?: (distanceKm: number) => void;
  onMetricsCalculated?: (metrics: RouteMetrics) => void;
}

interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

const PRESET_LOCATIONS = [
  { name: "Альплагерь Ала-Арча", coords: [42.5644, 74.4823] as [number, number] },
  { name: "Хижина Рацека", coords: [42.5186, 74.5298] as [number, number] },
  { name: "Водопад Ак-Сай", coords: [42.5350, 74.5020] as [number, number] },
  { name: "Ущелье Чункурчак", coords: [42.6389, 74.6281] as [number, number] },
  { name: "Озеро Кель-Тор", coords: [42.5417, 75.1432] as [number, number] },
  { name: "Перевал Теке-Тор", coords: [42.5025, 74.5211] as [number, number] },
];

const RouteMapEditorComponent: React.FC<RouteMapEditorProps> = ({
  coordinates,
  onChangeCoordinates,
  center = [42.5644, 74.4823],
  onDistanceCalculated,
  onMetricsCalculated,
}) => {
  const toast = useToast();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const trailLayerRef = useRef<L.FeatureGroup | null>(null);
  const searchMarkerRef = useRef<L.Marker | null>(null);

  // Stable refs for callbacks to prevent unnecessary effect triggers
  const onChangeCoordsRef = useRef(onChangeCoordinates);
  onChangeCoordsRef.current = onChangeCoordinates;

  const onMetricsCalcRef = useRef(onMetricsCalculated);
  onMetricsCalcRef.current = onMetricsCalculated;

  const onDistCalcRef = useRef(onDistanceCalculated);
  onDistCalcRef.current = onDistanceCalculated;

  const initialCenterRef = useRef(center);

  // Editor mode: 'manual' (precise point-by-point) or 'smart' (auto-route)
  const [editorMode, setEditorMode] = useState<"manual" | "smart">("manual");
  const [smartWaypoints, setSmartWaypoints] = useState<[number, number][]>([]);
  const [isRouting, setIsRouting] = useState(false);
  const [routeSuccessMsg, setRouteSuccessMsg] = useState<string | null>(null);
  const [routeErrorMsg, setRouteErrorMsg] = useState<string | null>(null);

  // Location search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Approximate distance and metrics calculation
  const calculateMetrics = useCallback((coords: [number, number][]): RouteMetrics => {
    if (coords.length < 2) {
      return { distanceKm: 0, durationHours: 0, elevationGainMeters: 0 };
    }
    let totalMeters = 0;
    for (let i = 0; i < coords.length - 1; i++) {
      const p1 = L.latLng(coords[i][0], coords[i][1]);
      const p2 = L.latLng(coords[i + 1][0], coords[i + 1][1]);
      totalMeters += p1.distanceTo(p2);
    }
    const distanceKm = Number((totalMeters / 1000).toFixed(1));
    const durationHours = Number(Math.max(0.5, distanceKm / 3.0).toFixed(1));
    const elevationGainMeters = Math.round(distanceKm * 65);

    return { distanceKm, durationHours, elevationGainMeters };
  }, []);

  // Initialize Leaflet Map ONCE on mount
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: initialCenterRef.current,
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    const trailLayer = L.featureGroup().addTo(map);
    trailLayerRef.current = trailLayer;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []); // Run ONCE on mount, preventing map destruction on parent re-renders!

  // Request OSRM walking route between key waypoints
  const buildSmartRoute = async (waypoints: [number, number][]) => {
    if (waypoints.length < 2) return;
    setIsRouting(true);
    setRouteSuccessMsg(null);
    setRouteErrorMsg(null);

    try {
      const locs = waypoints.map(([lat, lng]) => `${lng},${lat}`).join(";");
      const url = `https://router.project-osrm.org/route/v1/foot/${locs}?overview=full&geometries=geojson`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Сервер маршрутизации недоступен");

      const data = await response.json();
      if (data.code === "Ok" && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const detailedCoords: [number, number][] = route.geometry.coordinates.map(
          ([lng, lat]: [number, number]) => [Number(lat.toFixed(5)), Number(lng.toFixed(5))]
        );
        const distKm = Number((route.distance / 1000).toFixed(1));
        const durationHours = Number(Math.max(0.5, distKm / 3.0).toFixed(1));
        const elevationGainMeters = Math.round(distKm * 65);

        onChangeCoordsRef.current(detailedCoords);
        if (onDistCalcRef.current) {
          onDistCalcRef.current(distKm);
        }
        if (onMetricsCalcRef.current) {
          onMetricsCalcRef.current({
            distanceKm: distKm,
            durationHours,
            elevationGainMeters,
          });
        }
        setRouteSuccessMsg(`Тропа успешно проложена: ~${distKm} км • ${durationHours} ч • ${detailedCoords.length} точек`);

        // Fit map bounds to generated route
        if (mapInstanceRef.current && detailedCoords.length > 0) {
          const bounds = L.latLngBounds(detailedCoords.map((c) => L.latLng(c[0], c[1])));
          mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
        }
      } else {
        // Fallback: connect points directly
        onChangeCoordsRef.current(waypoints);
        const metrics = calculateMetrics(waypoints);
        if (onMetricsCalcRef.current) onMetricsCalcRef.current(metrics);
        setRouteErrorMsg("Пешеходная тропа не найдена в базе OSM, точки соединены напрямую.");
      }
    } catch {
      // Fallback on network error
      onChangeCoordsRef.current(waypoints);
      const metrics = calculateMetrics(waypoints);
      if (onMetricsCalcRef.current) onMetricsCalcRef.current(metrics);
      setRouteErrorMsg("Не удалось связаться с сервисом маршрутизации. Точки соединены напрямую.");
    } finally {
      setIsRouting(false);
    }
  };

  // Map Click Handler depending on mode
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.off("click");
    map.on("click", (e: L.LeafletMouseEvent) => {
      const newPt: [number, number] = [
        Number(e.latlng.lat.toFixed(5)),
        Number(e.latlng.lng.toFixed(5)),
      ];

      if (editorMode === "smart") {
        const nextWaypoints = [...smartWaypoints, newPt];
        setSmartWaypoints(nextWaypoints);
        if (nextWaypoints.length >= 2) {
          buildSmartRoute(nextWaypoints);
        } else {
          onChangeCoordsRef.current([newPt]);
          setRouteSuccessMsg("Точка А (Старт) установлена. Кликните вторую точку для финиша/перевала.");
        }
      } else {
        // Manual mode
        const nextCoords = [...coordinates, newPt];
        onChangeCoordsRef.current(nextCoords);
        const metrics = calculateMetrics(nextCoords);
        if (onDistCalcRef.current) onDistCalcRef.current(metrics.distanceKm);
        if (onMetricsCalcRef.current) onMetricsCalcRef.current(metrics);
      }
    });
  }, [editorMode, smartWaypoints, coordinates, calculateMetrics]);

  // Redraw Trail & Markers
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
          <div style="background-color: #07626A; color: #FFFFFF; width: 28px; height: 28px; border-radius: 50%; border: 3px solid #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; box-shadow: 0 4px 8px rgba(0,0,0,0.25);">
            A
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
      trailLayer.addLayer(
        L.marker(start, { icon: startIcon }).bindTooltip("Старт маршрута (Точка A)", {
          permanent: false,
          direction: "top",
        })
      );

      // Intermediate waypoints for smart mode
      if (smartWaypoints.length > 2) {
        for (let i = 1; i < smartWaypoints.length - 1; i++) {
          const wp = smartWaypoints[i];
          const wpIcon = L.divIcon({
            className: "trail-wp-marker",
            html: `
              <div style="background-color: #05494F; color: #FFFFFF; width: 22px; height: 22px; border-radius: 50%; border: 2px solid #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 800; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                ${i + 1}
              </div>
            `,
            iconSize: [22, 22],
            iconAnchor: [11, 11],
          });
          trailLayer.addLayer(
            L.marker(wp, { icon: wpIcon }).bindTooltip(`Ориентир / Перевал #${i}`, {
              permanent: false,
              direction: "top",
            })
          );
        }
      }

      // Small dots for manual mode
      if (editorMode === "manual" && coordinates.length > 2) {
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
      }

      // Finish Marker (B)
      if (coordinates.length > 1) {
        const finish = coordinates[coordinates.length - 1];
        const finishIcon = L.divIcon({
          className: "trail-finish-marker",
          html: `
            <div style="background-color: #0D0D0D; color: #FFFFFF; width: 28px; height: 28px; border-radius: 50%; border: 3px solid #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; box-shadow: 0 4px 8px rgba(0,0,0,0.25);">
              B
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });
        trailLayer.addLayer(
          L.marker(finish, { icon: finishIcon }).bindTooltip("Финиш маршрута (Точка B)", {
            permanent: false,
            direction: "top",
          })
        );
      }
    }
  }, [coordinates, smartWaypoints, editorMode]);

  // Handle Location Search
  const handleSearch = async (e?: React.FormEvent | React.KeyboardEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setShowSearchDropdown(true);

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        searchQuery + " Кыргызстан"
      )}&countrycodes=kg&limit=5`;
      const res = await fetch(url);
      const data: SearchResult[] = await res.json();
      setSearchResults(data);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectLocation = (lat: number, lon: number, name: string) => {
    setShowSearchDropdown(false);
    setSearchQuery(name);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lon], 14, { duration: 1.2 });

      if (searchMarkerRef.current) {
        searchMarkerRef.current.remove();
      }

      const searchPin = L.marker([lat, lon], {
        icon: L.divIcon({
          className: "search-pin",
          html: `
            <div style="background-color: #07626A; color: white; padding: 5px 10px; border-radius: 12px; font-size: 11px; font-weight: bold; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
              <span>${name}</span>
            </div>
          `,
          iconSize: [130, 30],
          iconAnchor: [65, 15],
        }),
      }).addTo(mapInstanceRef.current);

      searchMarkerRef.current = searchPin;
    }
  };

  const handleClear = async () => {
    const isConfirmed = await toast.confirm({
      title: "Сбросить карту?",
      message: "Вы уверены, что хотите удалить все точки и трек с карты?",
      confirmText: "Сбросить",
      cancelText: "Отмена",
      isDestructive: true,
    });

    if (isConfirmed) {
      onChangeCoordsRef.current([]);
      setSmartWaypoints([]);
      setRouteSuccessMsg(null);
      setRouteErrorMsg(null);
      if (searchMarkerRef.current) {
        searchMarkerRef.current.remove();
      }
    }
  };

  const handleUndo = () => {
    if (editorMode === "smart") {
      if (smartWaypoints.length <= 1) {
        setSmartWaypoints([]);
        onChangeCoordsRef.current([]);
      } else {
        const next = smartWaypoints.slice(0, -1);
        setSmartWaypoints(next);
        buildSmartRoute(next);
      }
    } else {
      if (coordinates.length === 0) return;
      const next = coordinates.slice(0, -1);
      onChangeCoordsRef.current(next);
      const metrics = calculateMetrics(next);
      if (onDistCalcRef.current) onDistCalcRef.current(metrics.distanceKm);
      if (onMetricsCalcRef.current) onMetricsCalcRef.current(metrics);
    }
  };

  const currentMetrics = calculateMetrics(coordinates);

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Top Bar: Search Location */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#0D0D0D]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch(e);
                }
              }}
              placeholder="Найти локацию (напр: Хижина Рацека, Ала-Арча, Чункурчак)..."
              className="w-full h-11 pl-9 pr-4 rounded-2xl border border-[#E1E1E1] bg-[#FAFBFB] text-xs font-medium text-[#0D0D0D] focus:outline-none focus:border-[#07626A] focus:bg-white"
            />
          </div>
          <button
            type="button"
            onClick={(e) => handleSearch(e)}
            disabled={isSearching || !searchQuery.trim()}
            className="px-5 h-11 rounded-2xl bg-[#07626A] hover:bg-[#07626A]/90 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50 shrink-0"
          >
            {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
            <span>Найти</span>
          </button>
        </div>

        {/* Search Results Dropdown */}
        {showSearchDropdown && searchResults.length > 0 && (
          <div className="absolute left-0 right-0 top-14 z-50 p-2.5 rounded-2xl bg-white border border-[#E1E1E1] shadow-2xl space-y-1">
            {searchResults.map((res) => (
              <button
                key={res.place_id}
                type="button"
                onClick={() =>
                  handleSelectLocation(parseFloat(res.lat), parseFloat(res.lon), res.display_name.split(",")[0])
                }
                className="w-full text-left p-3 rounded-xl hover:bg-[#F0F2F2] transition-colors text-xs text-[#0D0D0D] flex items-center gap-2.5 cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-[#07626A] shrink-0" />
                <span className="truncate">{res.display_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. Quick Presets */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0D0D0D]/50 shrink-0">
          Популярные базы:
        </span>
        {PRESET_LOCATIONS.map((loc) => (
          <button
            key={loc.name}
            type="button"
            onClick={() => handleSelectLocation(loc.coords[0], loc.coords[1], loc.name)}
            className="px-3 py-1.5 rounded-xl bg-white border border-[#E1E1E1] hover:border-[#07626A] text-xs font-bold text-[#0D0D0D]/75 hover:text-[#07626A] transition-colors cursor-pointer shrink-0 shadow-2xs"
          >
            {loc.name}
          </button>
        ))}
      </div>

      {/* 3. Mode Switcher Bar */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2.5 rounded-2xl bg-[#F0F2F2] border border-[#E1E1E1]">
          {/* Modes */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setEditorMode("manual");
                setRouteSuccessMsg(null);
                setRouteErrorMsg(null);
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                editorMode === "manual"
                  ? "bg-[#07626A] text-white shadow-xs"
                  : "bg-white text-[#0D0D0D]/70 hover:text-[#0D0D0D]"
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Точно по клику (Без смещений)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEditorMode("smart");
                setRouteSuccessMsg(null);
                setRouteErrorMsg(null);
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                editorMode === "smart"
                  ? "bg-[#07626A] text-white shadow-xs"
                  : "bg-white text-[#0D0D0D]/70 hover:text-[#0D0D0D]"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Авто-привязка к тропам OSM</span>
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleUndo}
              disabled={coordinates.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#E1E1E1] hover:border-[#07626A] text-xs font-bold text-[#0D0D0D] disabled:opacity-40 transition-colors cursor-pointer"
              title="Отменить шаг"
            >
              <Undo className="w-3.5 h-3.5" />
              <span>Отменить</span>
            </button>

            <button
              type="button"
              onClick={handleClear}
              disabled={coordinates.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#E1E1E1] hover:border-rose-500 hover:text-rose-600 text-xs font-bold text-[#0D0D0D] disabled:opacity-40 transition-colors cursor-pointer"
              title="Очистить карту"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Сбросить</span>
            </button>
          </div>
        </div>

        {/* Mode Explanatory Hint */}
        <p className="text-[11px] text-[#0D0D0D]/60 px-1 font-medium">
          {editorMode === "manual"
            ? "🎯 Точный режим: кликайте на карту — каждая точка фиксируется ровно там, где вы нажали, образуя непрерывную нить маршрута."
            : "⚡ Режим авто-троп: ставите ключевые точки (старт, перевал, финиш), и система ищет известные тропы OpenStreetMap между ними."}
        </p>
      </div>

      {/* 4. Status Notification Alerts */}
      {isRouting && (
        <div className="p-3 rounded-2xl bg-[#07626A]/10 border border-[#07626A]/20 text-xs font-bold text-[#07626A] flex items-center gap-2.5 animate-pulse">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Построение горного маршрута по тропам OpenStreetMap...</span>
        </div>
      )}

      {routeSuccessMsg && (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{routeSuccessMsg}</span>
        </div>
      )}

      {routeErrorMsg && (
        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-medium text-amber-900 flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{routeErrorMsg}</span>
        </div>
      )}

      {/* 5. Map Canvas Container - Ultra-High Map Canvas */}
      <div className="relative w-full h-[650px] sm:h-[750px] lg:h-[820px] rounded-3xl border border-[#E1E1E1] overflow-hidden shadow-sm">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Custom Zoom Controls in Top Right */}
        <div className="absolute top-4 right-4 z-10 flex flex-col rounded-2xl bg-white border border-[#E1E1E1] overflow-hidden shadow-md">
          <button
            type="button"
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="p-2.5 hover:bg-[#F3F3F3] text-[#07626A] transition-colors border-b border-[#E1E1E1] cursor-pointer"
            title="Приблизить"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="p-2.5 hover:bg-[#F3F3F3] text-[#07626A] transition-colors cursor-pointer"
            title="Отдалить"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Current Stats Overlay in Top Left */}
        <div className="absolute top-4 left-4 z-10 px-4 py-2 rounded-2xl bg-white/95 backdrop-blur-xs border border-[#E1E1E1] shadow-sm text-xs font-bold text-[#07626A] flex items-center gap-3">
          <span>{coordinates.length} GPS точек</span>
          <span>•</span>
          <span>~{currentMetrics.distanceKm} км</span>
          <span>•</span>
          <span>~{currentMetrics.durationHours} ч</span>
          <span>•</span>
          <span>+{currentMetrics.elevationGainMeters} м</span>
        </div>

        {/* Bottom Instruction Prompt */}
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto z-10 px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-xs border border-[#E1E1E1] shadow-lg text-xs text-[#0D0D0D] font-medium flex items-center gap-2.5">
          <MapPin className="w-4 h-4 text-[#07626A] shrink-0" />
          <span>
            {editorMode === "smart"
              ? smartWaypoints.length === 0
                ? "Клик 1: Поставьте Старт (А). Затем Клик 2: Финиш (Б) или перевал."
                : smartWaypoints.length === 1
                ? "Старт выбран. Теперь кликните точку Финиша или Перевала."
                : `Установлено ${smartWaypoints.length} ориентиров. Можно кликнуть еще точку или скорректировать.`
              : "Пошаговый режим: кликайте на карту для добавления точек вручную."}
          </span>
        </div>
      </div>
    </div>
  );
};

export const RouteMapEditor = memo(RouteMapEditorComponent);
