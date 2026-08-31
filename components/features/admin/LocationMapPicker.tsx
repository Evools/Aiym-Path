"use client";

import React, { useEffect, useRef, useState, memo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Search, MapPin, Loader2, Navigation, CheckCircle2, Plus, Minus } from "lucide-react";

interface LocationMapPickerProps {
  coordinates: [number, number];
  onSelectCoordinates: (coords: [number, number]) => void;
  locationName?: string;
}

interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

const PRESET_PLACES = [
  { name: "Чункурчак", coords: [42.6389, 74.6281] as [number, number] },
  { name: "Ала-Арча (Альплагерь)", coords: [42.5644, 74.4823] as [number, number] },
  { name: "Хижина Рацека", coords: [42.5186, 74.5298] as [number, number] },
  { name: "Тёплые Ключи", coords: [42.6318, 74.6727] as [number, number] },
  { name: "Каракол", coords: [42.4907, 78.3936] as [number, number] },
  { name: "Озеро Кель-Тор", coords: [42.5417, 75.1432] as [number, number] },
  { name: "Сон-Көл", coords: [41.7644, 75.1322] as [number, number] },
  { name: "Ош", coords: [40.5283, 72.7985] as [number, number] },
];

const LocationMapPickerComponent: React.FC<LocationMapPickerProps> = ({
  coordinates,
  onSelectCoordinates,
  locationName = "",
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const onSelectCoordsRef = useRef(onSelectCoordinates);
  onSelectCoordsRef.current = onSelectCoordinates;

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Initialize Leaflet Map ONCE
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const initialCenter = coordinates && coordinates[0] ? coordinates : [42.6389, 74.6281];

    const map = L.map(mapContainerRef.current, {
      center: initialCenter as [number, number],
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    // Create custom pin icon
    const pinIcon = L.divIcon({
      className: "custom-location-pin",
      html: `
        <div style="background-color: #07626A; color: white; padding: 6px 12px; border-radius: 14px; font-size: 11px; font-weight: 800; border: 2px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.35); display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
          <span>Точка локации</span>
        </div>
      `,
      iconSize: [120, 32],
      iconAnchor: [60, 16],
    });

    const marker = L.marker(initialCenter as [number, number], {
      icon: pinIcon,
      draggable: true,
    }).addTo(map);

    marker.on("dragend", (e: any) => {
      const latlng = e.target.getLatLng();
      const newPt: [number, number] = [
        Number(latlng.lat.toFixed(5)),
        Number(latlng.lng.toFixed(5)),
      ];
      onSelectCoordsRef.current(newPt);
    });

    markerRef.current = marker;

    // Map Click Listener
    map.on("click", (e: L.LeafletMouseEvent) => {
      const newPt: [number, number] = [
        Number(e.latlng.lat.toFixed(5)),
        Number(e.latlng.lng.toFixed(5)),
      ];
      marker.setLatLng(newPt);
      onSelectCoordsRef.current(newPt);
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // Update marker position if coordinates change externally
  useEffect(() => {
    if (markerRef.current && coordinates && coordinates[0]) {
      const currentPos = markerRef.current.getLatLng();
      if (
        Math.abs(currentPos.lat - coordinates[0]) > 0.0001 ||
        Math.abs(currentPos.lng - coordinates[1]) > 0.0001
      ) {
        markerRef.current.setLatLng(coordinates);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo(coordinates);
        }
      }
    }
  }, [coordinates]);

  const handleSearch = async (e?: React.FormEvent | React.KeyboardEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setShowDropdown(true);

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

  const handleSelectPreset = (lat: number, lon: number, name: string) => {
    setShowDropdown(false);
    setSearchQuery(name);
    const newPt: [number, number] = [lat, lon];

    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.flyTo(newPt, 14, { duration: 1 });
      markerRef.current.setLatLng(newPt);
      onSelectCoordsRef.current(newPt);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* 1. Search Bar */}
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
              placeholder="Найти на карте (напр: Чункурчак, Ала-Арча, Каракол)..."
              className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E1E1E1] bg-white text-xs font-medium text-[#0D0D0D] focus:outline-none focus:border-[#07626A]"
            />
          </div>
          <button
            type="button"
            onClick={(e) => handleSearch(e)}
            disabled={isSearching || !searchQuery.trim()}
            className="px-4 h-10 rounded-xl bg-[#07626A] hover:bg-[#07626A]/90 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50 shrink-0"
          >
            {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
            <span>Найти</span>
          </button>
        </div>

        {/* Dropdown Results */}
        {showDropdown && searchResults.length > 0 && (
          <div className="absolute left-0 right-0 top-12 z-50 p-2 rounded-2xl bg-white border border-[#E1E1E1] shadow-xl space-y-1">
            {searchResults.map((res) => (
              <button
                key={res.place_id}
                type="button"
                onClick={() =>
                  handleSelectPreset(parseFloat(res.lat), parseFloat(res.lon), res.display_name.split(",")[0])
                }
                className="w-full text-left p-2.5 rounded-xl hover:bg-[#F0F2F2] transition-colors text-xs text-[#0D0D0D] flex items-center gap-2 cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-[#07626A] shrink-0" />
                <span className="truncate">{res.display_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. Quick Presets */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0D0D0D]/50 shrink-0">
          Базы:
        </span>
        {PRESET_PLACES.map((p) => (
          <button
            key={p.name}
            type="button"
            onClick={() => handleSelectPreset(p.coords[0], p.coords[1], p.name)}
            className="px-2.5 py-1 rounded-lg bg-white border border-[#E1E1E1] hover:border-[#07626A] text-[11px] font-bold text-[#0D0D0D]/75 hover:text-[#07626A] transition-colors cursor-pointer shrink-0"
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* 3. Interactive Leaflet Canvas with Custom Zoom Controls */}
      <div className="relative w-full h-[460px] sm:h-[540px] lg:h-[580px] rounded-2xl border border-[#E1E1E1] overflow-hidden shadow-xs">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Custom Zoom Controls (Top Right) */}
        <div className="absolute top-3 right-3 z-10 flex flex-col rounded-2xl bg-white border border-[#E1E1E1] overflow-hidden shadow-md">
          <button
            type="button"
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="p-2 hover:bg-[#F3F3F3] text-[#07626A] transition-colors border-b border-[#E1E1E1] cursor-pointer"
            title="Приблизить"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="p-2 hover:bg-[#F3F3F3] text-[#07626A] transition-colors cursor-pointer"
            title="Отдалить"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Selected Coordinates & Instruction Overlay (Bottom) */}
        <div className="absolute bottom-3 left-3 right-3 z-10 p-2.5 rounded-xl bg-white/95 backdrop-blur-xs border border-[#E1E1E1] shadow-md flex items-center justify-between text-xs font-medium text-[#0D0D0D]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Кликните на карту или переместите метку</span>
          </div>
          <span className="font-mono font-bold text-[#07626A] text-[11px] bg-[#07626A]/10 px-2 py-0.5 rounded-md">
            {coordinates[0]}, {coordinates[1]}
          </span>
        </div>
      </div>
    </div>
  );
};

export const LocationMapPicker = memo(LocationMapPickerComponent);
