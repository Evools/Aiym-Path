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
  Mountain,
  Droplets,
  Eye,
  Tent,
  ShieldAlert,
  Sparkles,
  X,
  Tag,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { RoutePOI, POIType } from "@/types/route.types";
import { useToast } from "@/context/ToastContext";

interface RouteMetrics {
  distanceKm: number;
  durationHours: number;
  elevationGainMeters: number;
}

interface RouteMapEditorProps {
  coordinates: [number, number][];
  onChangeCoordinates: (coords: [number, number][]) => void;
  pois?: RoutePOI[];
  onChangePOIs?: (pois: RoutePOI[]) => void;
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
  { name: "Водопад Ак-Сай", coords: [42.5539, 74.4983] as [number, number] },
  { name: "Хижина Рацека", coords: [42.5350, 74.5288] as [number, number] },
  { name: "Ущелье Чункурчак", coords: [42.6392, 74.6285] as [number, number] },
  { name: "Озеро Кель-Тор", coords: [42.5467, 75.1878] as [number, number] },
  { name: "Перевал Теке-Тор", coords: [42.5125, 74.5020] as [number, number] },
];

const POI_TYPE_CONFIG: Record<
  POIType,
  { label: string; bg: string; border: string; text: string; icon: string }
> = {
  pass: {
    label: "Горный перевал / Вершина",
    bg: "#4F46E5",
    border: "#4338CA",
    text: "#FFFFFF",
    icon: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>`,
  },
  waterfall: {
    label: "Водопад / Родник",
    bg: "#0284C7",
    border: "#0369A1",
    text: "#FFFFFF",
    icon: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>`,
  },
  viewpoint: {
    label: "Смотровая площадка / Панорама",
    bg: "#D97706",
    border: "#B45309",
    text: "#FFFFFF",
    icon: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
  },
  camp: {
    label: "Хижина / Лагерь / Приют",
    bg: "#059669",
    border: "#047857",
    text: "#FFFFFF",
    icon: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 20 10 4 1 20h18Z"/><path d="m10 4 9 16"/><path d="M14 20v-5a2 2 0 0 0-2-2h0a2 2 0 0 0-2 2v5"/></svg>`,
  },
  caution: {
    label: "Опасный участок / Осыпь",
    bg: "#E11D48",
    border: "#BE123C",
    text: "#FFFFFF",
    icon: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  },
  rescue: {
    label: "Медпункт / Связь SOS",
    bg: "#0D9488",
    border: "#0F766E",
    text: "#FFFFFF",
    icon: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>`,
  },
  guesthouse: {
    label: "Гостевой дом",
    bg: "#07626A",
    border: "#05494F",
    text: "#FFFFFF",
    icon: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>`,
  },
  service: {
    label: "Инфо-центр / Сервис",
    bg: "#334155",
    border: "#1E293B",
    text: "#FFFFFF",
    icon: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  },
};

const RouteMapEditorComponent: React.FC<RouteMapEditorProps> = ({
  coordinates,
  onChangeCoordinates,
  pois = [],
  onChangePOIs,
  center = [42.5644, 74.4823],
  onDistanceCalculated,
  onMetricsCalculated,
}) => {
  const toast = useToast();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const trailLayerRef = useRef<L.FeatureGroup | null>(null);
  const poisLayerRef = useRef<L.FeatureGroup | null>(null);
  const searchMarkerRef = useRef<L.Marker | null>(null);

  // Stable refs
  const onChangeCoordsRef = useRef(onChangeCoordinates);
  onChangeCoordsRef.current = onChangeCoordinates;

  const onChangePOIsRef = useRef(onChangePOIs);
  onChangePOIsRef.current = onChangePOIs;

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

  // POI Modal State for selected point
  const [isPOIModalOpen, setIsPOIModalOpen] = useState(false);
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);
  const [poiCoords, setPoiCoords] = useState<[number, number]>([42.5350, 74.5288]);
  const [editingPOIId, setEditingPOIId] = useState<string | null>(null);
  const [poiType, setPoiType] = useState<POIType>("pass");
  const [poiNameRu, setPoiNameRu] = useState("");
  const [poiNameKg, setPoiNameKg] = useState("");
  const [poiNameEn, setPoiNameEn] = useState("");
  const [isTranslatingPOI, setIsTranslatingPOI] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  // Calculate distance & elevation
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

  // Open POI modal for a specific point in route
  const handleOpenPOIDialogForPoint = useCallback(
    (pt: [number, number], pointIndex: number | null, existingPoi?: RoutePOI) => {
      setPoiCoords(pt);
      setSelectedPointIndex(pointIndex);

      if (existingPoi) {
        setEditingPOIId(existingPoi.id);
        setPoiType(existingPoi.type);
        setPoiNameRu(existingPoi.name.ru || "");
        setPoiNameKg(existingPoi.name.kg || "");
        setPoiNameEn(existingPoi.name.en || "");
      } else {
        setEditingPOIId(null);
        setPoiType("pass");
        setPoiNameRu("");
        setPoiNameKg("");
        setPoiNameEn("");
      }

      setIsPOIModalOpen(true);
    },
    []
  );

  // Initialize Map ONCE
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
    const poisLayer = L.featureGroup().addTo(map);
    trailLayerRef.current = trailLayer;
    poisLayerRef.current = poisLayer;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Map Click Listener
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
        // Manual mode: add point to line
        const nextCoords = [...coordinates, newPt];
        onChangeCoordsRef.current(nextCoords);
        const metrics = calculateMetrics(nextCoords);
        if (onDistCalcRef.current) onDistCalcRef.current(metrics.distanceKm);
        if (onMetricsCalcRef.current) onMetricsCalcRef.current(metrics);
      }
    });
  }, [editorMode, smartWaypoints, coordinates, calculateMetrics]);

  // Request OSRM route
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
        if (onDistCalcRef.current) onDistCalcRef.current(distKm);
        if (onMetricsCalcRef.current) {
          onMetricsCalcRef.current({
            distanceKm: distKm,
            durationHours,
            elevationGainMeters,
          });
        }
        setRouteSuccessMsg(`Тропа успешно построена: ~${distKm} км • ${durationHours} ч`);
      } else {
        onChangeCoordsRef.current(waypoints);
        const metrics = calculateMetrics(waypoints);
        if (onMetricsCalcRef.current) onMetricsCalcRef.current(metrics);
      }
    } catch {
      onChangeCoordsRef.current(waypoints);
      const metrics = calculateMetrics(waypoints);
      if (onMetricsCalcRef.current) onMetricsCalcRef.current(metrics);
    } finally {
      setIsRouting(false);
    }
  };

  // Helper: Find POI near coordinate
  const findPoiNear = useCallback(
    (pt: [number, number]): RoutePOI | undefined => {
      return pois.find(
        (p) => Math.abs(p.lat - pt[0]) < 0.0003 && Math.abs(p.lng - pt[1]) < 0.0003
      );
    },
    [pois]
  );

  // Redraw Trail & Clickable Vertex Dots
  useEffect(() => {
    const trailLayer = trailLayerRef.current;
    if (!trailLayer) return;

    trailLayer.clearLayers();

    if (coordinates.length > 0) {
      // 1. Polyline line
      const polyline = L.polyline(coordinates, {
        color: "#07626A",
        weight: 5,
        opacity: 0.9,
        lineCap: "round",
        lineJoin: "round",
      });
      trailLayer.addLayer(polyline);

      // 2. Clickable vertices along the entire trail
      coordinates.forEach((pt, idx) => {
        const isStart = idx === 0;
        const isFinish = idx === coordinates.length - 1 && coordinates.length > 1;
        const attachedPoi = findPoiNear(pt);

        let iconHtml = "";
        let size: [number, number] = [16, 16];
        let anchor: [number, number] = [8, 8];

        if (isStart) {
          size = [28, 28];
          anchor = [14, 14];
          iconHtml = `
            <div style="background-color: #07626A; color: #FFFFFF; width: 28px; height: 28px; border-radius: 50%; border: 3px solid #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; box-shadow: 0 4px 8px rgba(0,0,0,0.3); cursor: pointer;">
              A
            </div>
          `;
        } else if (isFinish) {
          size = [28, 28];
          anchor = [14, 14];
          iconHtml = `
            <div style="background-color: #0D0D0D; color: #FFFFFF; width: 28px; height: 28px; border-radius: 50%; border: 3px solid #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; box-shadow: 0 4px 8px rgba(0,0,0,0.3); cursor: pointer;">
              B
            </div>
          `;
        } else if (attachedPoi) {
          // Point with attached POI
          const cfg = POI_TYPE_CONFIG[attachedPoi.type] || POI_TYPE_CONFIG.pass;
          size = [22, 22];
          anchor = [11, 11];
          iconHtml = `
            <div style="background-color: ${cfg.bg}; color: #FFFFFF; width: 22px; height: 22px; border-radius: 50%; border: 2.5px solid #FFFFFF; box-shadow: 0 3px 8px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; cursor: pointer;">
              ${cfg.icon}
            </div>
          `;
        } else {
          // Regular trail point
          size = [14, 14];
          anchor = [7, 7];
          iconHtml = `
            <div style="background-color: #FFFFFF; width: 14px; height: 14px; border-radius: 50%; border: 3px solid #07626A; box-shadow: 0 2px 5px rgba(0,0,0,0.3); cursor: pointer;">
            </div>
          `;
        }

        const pointMarker = L.marker(pt, {
          icon: L.divIcon({
            className: "trail-vertex-marker",
            html: iconHtml,
            iconSize: size,
            iconAnchor: anchor,
          }),
        });

        // Click handler: opens POI binding modal for this point!
        pointMarker.on("click", (e) => {
          L.DomEvent.stopPropagation(e);
          handleOpenPOIDialogForPoint(pt, idx, attachedPoi);
        });

        // Tooltip
        const label = isStart
          ? "Старт (Точка A)"
          : isFinish
          ? "Финиш (Точка B)"
          : `Точка №${idx + 1}`;

        pointMarker.bindTooltip(
          attachedPoi
            ? `<div style="text-align:left;"><div style="font-weight:700; color:#0D0D0D; font-size:12px;">${attachedPoi.name.ru}</div><div style="color:#07626A; font-weight:600; font-size:10px; margin-top:2px;">${POI_TYPE_CONFIG[attachedPoi.type]?.label || ""}</div><div style="color:#666666; font-size:9px; margin-top:2px;">Кликните для изменения</div></div>`
            : `<div style="text-align:left;"><div style="font-weight:700; color:#0D0D0D; font-size:11px;">${label}</div><div style="color:#07626A; font-weight:600; font-size:10px; margin-top:2px;">Кликните, чтобы назначить ориентиром</div></div>`,
          { direction: "top", offset: [0, -6] }
        );

        trailLayer.addLayer(pointMarker);
      });
    }
  }, [coordinates, pois, findPoiNear, handleOpenPOIDialogForPoint]);

  // Redraw Standalone POIs (not attached to an exact trail point)
  useEffect(() => {
    const poisLayer = poisLayerRef.current;
    if (!poisLayer) return;

    poisLayer.clearLayers();

    pois.forEach((poi) => {
      const cfg = POI_TYPE_CONFIG[poi.type] || POI_TYPE_CONFIG.pass;
      const poiIcon = L.divIcon({
        className: "custom-poi-badge",
        html: `
          <div style="background-color: ${cfg.bg}; color: ${cfg.text}; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 800; border: 2px solid #FFFFFF; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: inline-flex; align-items: center; gap: 5px; white-space: nowrap; cursor: pointer;">
            ${cfg.icon}
            <span>${poi.name.ru}</span>
          </div>
        `,
        iconSize: [120, 26],
        iconAnchor: [60, 13],
      });

      const marker = L.marker([poi.lat, poi.lng], { icon: poiIcon });
      marker.on("click", (e) => {
        L.DomEvent.stopPropagation(e);
        handleOpenPOIDialogForPoint([poi.lat, poi.lng], null, poi);
      });

      marker.bindTooltip(
        `<div style="text-align:left;"><div style="font-weight:700; color:#0D0D0D; font-size:12px;">${poi.name.ru}</div><div style="color:#07626A; font-weight:600; font-size:10px; margin-top:2px;">${cfg.label}</div><div style="color:#666666; font-size:9px; margin-top:2px;">Кликните для редактирования</div></div>`,
        { direction: "top", offset: [0, -6] }
      );
      poisLayer.addLayer(marker);
    });
  }, [pois, handleOpenPOIDialogForPoint]);

  // Auto-translate POI Name
  const handleAutoTranslatePOI = async () => {
    if (!poiNameRu.trim()) return;
    setIsTranslatingPOI(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: poiNameRu }),
      });
      const data = await res.json();
      if (data.success || data.en || data.kg) {
        setPoiNameKg(data.kg || poiNameRu);
        setPoiNameEn(data.en || poiNameRu);
        toast.success("Автоперевод выполнен");
      } else {
        toast.error("Не удалось получить перевод");
      }
    } catch {
      toast.error("Не удалось выполнить перевод");
    } finally {
      setIsTranslatingPOI(false);
    }
  };

  // Save new / edited POI
  const handleSavePOI = () => {
    if (!poiNameRu.trim()) {
      toast.warning("Введите название ориентира/перевала");
      return;
    }

    const newPoi: RoutePOI = {
      id: editingPOIId || `poi-${Date.now()}`,
      name: {
        ru: poiNameRu.trim(),
        kg: poiNameKg.trim() || poiNameRu.trim(),
        en: poiNameEn.trim() || poiNameRu.trim(),
      },
      type: poiType,
      lat: poiCoords[0],
      lng: poiCoords[1],
    };

    let nextPois: RoutePOI[];
    if (editingPOIId) {
      nextPois = pois.map((p) => (p.id === editingPOIId ? newPoi : p));
      toast.success(`Ориентир «${newPoi.name.ru}» обновлён`);
    } else {
      nextPois = [...pois, newPoi];
      toast.success(`Точка назначена: «${newPoi.name.ru}»`);
    }

    if (onChangePOIsRef.current) {
      onChangePOIsRef.current(nextPois);
    }
    setIsPOIModalOpen(false);
  };

  // Delete POI attached to this point
  const handleDeleteCurrentPOI = () => {
    if (editingPOIId) {
      const nextPois = pois.filter((p) => p.id !== editingPOIId);
      if (onChangePOIsRef.current) onChangePOIsRef.current(nextPois);
      toast.success("Ориентир снят с точки");
    }
    setIsPOIModalOpen(false);
  };

  // Delete this point from trail coordinates
  const handleDeletePointFromTrail = () => {
    if (selectedPointIndex !== null) {
      const nextCoords = coordinates.filter((_, idx) => idx !== selectedPointIndex);
      onChangeCoordsRef.current(nextCoords);
      const metrics = calculateMetrics(nextCoords);
      if (onDistCalcRef.current) onDistCalcRef.current(metrics.distanceKm);
      if (onMetricsCalcRef.current) onMetricsCalcRef.current(metrics);
      if (editingPOIId) {
        const nextPois = pois.filter((p) => p.id !== editingPOIId);
        if (onChangePOIsRef.current) onChangePOIsRef.current(nextPois);
      }
      toast.success(`Точка №${selectedPointIndex + 1} удалена из трека`);
    }
    setIsPOIModalOpen(false);
  };

  // Delete standalone POI
  const handleDeletePOI = (poiId: string) => {
    const nextPois = pois.filter((p) => p.id !== poiId);
    if (onChangePOIsRef.current) {
      onChangePOIsRef.current(nextPois);
    }
    toast.success("Ориентир удалён");
  };

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
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
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
      message: "Вы уверены, что хотите удалить все точки и ориентиры с карты?",
      confirmText: "Сбросить",
      cancelText: "Отмена",
      isDestructive: true,
    });

    if (isConfirmed) {
      onChangeCoordsRef.current([]);
      if (onChangePOIsRef.current) onChangePOIsRef.current([]);
      setSmartWaypoints([]);
      setRouteSuccessMsg(null);
      setRouteErrorMsg(null);
      if (searchMarkerRef.current) {
        searchMarkerRef.current.remove();
      }
    }
  };

  const handleUndo = () => {
    if (coordinates.length === 0) return;
    const next = coordinates.slice(0, -1);
    onChangeCoordsRef.current(next);
    const metrics = calculateMetrics(next);
    if (onDistCalcRef.current) onDistCalcRef.current(metrics.distanceKm);
    if (onMetricsCalcRef.current) onMetricsCalcRef.current(metrics);
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

      {/* 3. Mode Switcher & Tools Bar */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2.5 rounded-2xl bg-[#F0F2F2] border border-[#E1E1E1]">
          {/* Tool Modes */}
          <div className="flex items-center gap-1.5 flex-wrap">
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
              <span>Точно по клику (Тропа)</span>
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
              disabled={coordinates.length === 0 && pois.length === 0}
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
          <span className="font-bold text-[#07626A]">Подсказка:</span> Кликайте на карту для рисования тропы. Чтобы назначить точку перевалом, водопадом или стоянкой — просто <span className="font-bold text-[#4F46E5]">кликните на любую круглую точку маршрута</span>.
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

      {/* 5. Map Canvas Container */}
      <div
        className={
          isFullscreen
            ? "fixed inset-0 z-[9999] w-screen h-screen bg-[#F0F2F2]"
            : "relative w-full h-[500px] sm:h-[700px] lg:h-[800px] rounded-3xl border border-[#E1E1E1] overflow-hidden shadow-sm"
        }
      >
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Controls in Top Right */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-col items-end gap-2">
          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl bg-white border border-[#E1E1E1] hover:border-[#07626A] text-xs font-semibold text-[#07626A] shadow-md transition-colors cursor-pointer"
            title={isFullscreen ? "Свернуть карту" : "Развернуть во весь экран"}
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

          {/* Zoom Controls */}
          <div className="flex flex-col rounded-xl bg-white border border-[#E1E1E1] shadow-md overflow-hidden">
            <button
              type="button"
              onClick={() => mapInstanceRef.current?.zoomIn()}
              className="p-2.5 hover:bg-[#F3F3F3] text-[#07626A] transition-colors border-b border-[#E1E1E1] cursor-pointer flex items-center justify-center"
              title="Приблизить"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => mapInstanceRef.current?.zoomOut()}
              className="p-2.5 hover:bg-[#F3F3F3] text-[#07626A] transition-colors cursor-pointer flex items-center justify-center"
              title="Отдалить"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Current Stats Overlay in Top Left */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl bg-white/95 backdrop-blur-xs border border-[#E1E1E1] shadow-sm text-[11px] sm:text-xs font-bold text-[#07626A] flex items-center gap-2 sm:gap-3 flex-wrap max-w-[calc(100%-90px)] sm:max-w-none">
          <span>{coordinates.length} точек</span>
          <span>•</span>
          <span>~{currentMetrics.distanceKm} км</span>
          <span>•</span>
          <span>+{currentMetrics.elevationGainMeters} м</span>
          {pois.length > 0 && (
            <>
              <span>•</span>
              <span className="text-[#07626A] font-extrabold">{pois.length} ориентиров</span>
            </>
          )}
        </div>

        {/* Bottom Instruction Prompt */}
        <div className="hidden sm:flex absolute bottom-4 left-4 right-4 sm:right-auto z-10 px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-xs border border-[#E1E1E1] shadow-lg text-xs text-[#0D0D0D] font-medium items-center gap-2.5">
          <MapPin className="w-4 h-4 text-[#07626A] shrink-0" />
          <span>
            Кликните в пустое место для новой точки. Кликните <span className="font-bold text-[#07626A]">на любую точку</span>, чтобы привязать перевал или ориентир.
          </span>
        </div>
      </div>

      {/* 6. List of Added POIs / Waypoints */}
      {pois.length > 0 && (
        <div className="p-5 rounded-3xl bg-[#FAFBFB] border border-[#E1E1E1] flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#E1E1E1]">
            <div className="flex items-center gap-2">
              <Mountain className="w-4 h-4 text-[#4F46E5]" />
              <h4 className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
                Ориентиры, перевалы и стоянки ({pois.length})
              </h4>
            </div>
            <span className="text-[11px] text-[#0D0D0D]/60 font-medium">
              Кликните на карточку для редактирования
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {pois.map((poi) => {
              const cfg = POI_TYPE_CONFIG[poi.type] || POI_TYPE_CONFIG.pass;
              return (
                <div
                  key={poi.id}
                  onClick={() => handleOpenPOIDialogForPoint([poi.lat, poi.lng], null, poi)}
                  className="p-3.5 rounded-2xl bg-white border border-[#E1E1E1] hover:border-[#4F46E5] transition-colors flex items-start justify-between gap-3 shadow-2xs cursor-pointer"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white"
                      style={{ backgroundColor: cfg.bg }}
                      dangerouslySetInnerHTML={{ __html: cfg.icon }}
                    />
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-[#0D0D0D] truncate">
                        {poi.name.ru}
                      </h5>
                      <p className="text-[10px] text-[#0D0D0D]/60 mt-0.5">
                        {cfg.label}
                      </p>
                      <span className="font-mono text-[9px] text-[#07626A] bg-[#07626A]/5 px-1.5 py-0.5 rounded">
                        {poi.lat}, {poi.lng}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePOI(poi.id);
                    }}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                    title="Удалить ориентир"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 7. Modal Dialog: Bind POI / Pass to Point */}
      {isPOIModalOpen && (
        <div
          onClick={() => setIsPOIModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-3xl p-6 border border-[#E1E1E1] shadow-2xl flex flex-col gap-5 animate-in zoom-in-95 duration-150 my-auto cursor-default"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E1E1E1]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[rgba(7,98,106,0.08)] text-[#07626A] border border-[rgba(7,98,106,0.15)] flex items-center justify-center">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0D0D0D]">
                    {selectedPointIndex !== null
                      ? `Привязать ориентир к Точке №${selectedPointIndex + 1}`
                      : "Ориентир / перевал на карте"}
                  </h4>
                  <p className="text-[11px] text-[#0D0D0D]/60 font-mono">
                    GPS: {poiCoords[0]}, {poiCoords[1]}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPOIModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-[#F3F3F3] text-[#0D0D0D]/50 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Content */}
            <div className="flex flex-col gap-4">
              {/* POI Type Selection */}
              <div>
                <label className="block text-xs font-bold text-[#0D0D0D] uppercase tracking-wider mb-2">
                  Что находится в этой точке?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { type: "pass", label: "Перевал / Вершина", icon: Mountain },
                      { type: "waterfall", label: "Водопад / Родник", icon: Droplets },
                      { type: "viewpoint", label: "Смотровая / Панорама", icon: Eye },
                      { type: "camp", label: "Хижина / Стоянка", icon: Tent },
                      { type: "caution", label: "Опасный участок", icon: ShieldAlert },
                      { type: "rescue", label: "Медпункт / SOS", icon: CheckCircle2 },
                    ] as const
                  ).map((item) => {
                    const isSelected = poiType === item.type;
                    const IconComp = item.icon;

                    return (
                      <button
                        key={item.type}
                        type="button"
                        onClick={() => setPoiType(item.type)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-left ${
                          isSelected
                            ? "bg-[#07626A] text-white border-[#07626A] shadow-xs"
                            : "bg-white text-[#0D0D0D]/80 border-[#E1E1E1] hover:border-[rgba(7,98,106,0.40)] hover:bg-[#FAFBFB]"
                        }`}
                      >
                        <IconComp className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title i18n */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
                    Название ориентира <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoTranslatePOI}
                    disabled={isTranslatingPOI || !poiNameRu.trim()}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-[#07626A] bg-[rgba(7,98,106,0.08)] hover:bg-[rgba(7,98,106,0.14)] px-2 py-0.5 rounded-md cursor-pointer disabled:opacity-50"
                  >
                    {isTranslatingPOI ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3" />
                    )}
                    <span>Автоперевод</span>
                  </button>
                </div>

                <input
                  type="text"
                  required
                  value={poiNameRu}
                  onChange={(e) => setPoiNameRu(e.target.value)}
                  placeholder="Например: Перевал Теке-Тор или Водопад Ак-Сай"
                  className="w-full h-10 px-3 rounded-xl border border-[#E1E1E1] bg-white text-xs font-bold text-[#0D0D0D] focus:border-[#07626A] focus:outline-none mb-2"
                />

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={poiNameKg}
                    onChange={(e) => setPoiNameKg(e.target.value)}
                    placeholder="Кыргызча"
                    className="w-full h-9 px-2.5 text-xs rounded-lg border border-[#E1E1E1] bg-[#FAFBFB] text-[#0D0D0D] focus:border-[#07626A] focus:outline-none"
                  />
                  <input
                    type="text"
                    value={poiNameEn}
                    onChange={(e) => setPoiNameEn(e.target.value)}
                    placeholder="English"
                    className="w-full h-9 px-2.5 text-xs rounded-lg border border-[#E1E1E1] bg-[#FAFBFB] text-[#0D0D0D] focus:border-[#07626A] focus:outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2.5 pt-3 border-t border-[#E1E1E1]">
                <div className="flex items-center gap-2">
                  {editingPOIId && (
                    <button
                      type="button"
                      onClick={handleDeleteCurrentPOI}
                      className="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Снять ориентир
                    </button>
                  )}

                  {selectedPointIndex !== null && (
                    <button
                      type="button"
                      onClick={handleDeletePointFromTrail}
                      className="px-3 py-2 rounded-xl text-[#0D0D0D]/60 hover:text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
                      title="Удалить эту точку из маршрута"
                    >
                      Удалить точку из трека
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPOIModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-[#E1E1E1] bg-white text-xs font-bold text-[#0D0D0D] hover:bg-[#F3F3F3] cursor-pointer"
                  >
                    Отмена
                  </button>
                  <button
                    type="button"
                    onClick={handleSavePOI}
                    className="px-5 py-2 rounded-xl bg-[#07626A] hover:bg-[#07626A]/90 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    Сохранить для точки
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const RouteMapEditor = memo(RouteMapEditorComponent);
