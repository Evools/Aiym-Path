"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { Maximize2, MapPin, ArrowRight } from "lucide-react";
import { RouteFilterRegion, RouteItem } from "@/types/route.types";
import { AdminStorageService, AdminLocationItem } from "@/lib/services/admin-storage.service";
import { MapRegionTabs } from "@/components/features/map/MapRegionTabs";
import { InteractiveMapWrapper } from "@/components/features/map/InteractiveMapWrapper";
import { MapLegend } from "@/components/features/map/MapLegend";
import { useLanguage } from "@/context/LanguageContext";

export const HomeMapSection: React.FC = () => {
  const { dict } = useLanguage();
  const [routesData, setRoutesData] = useState<RouteItem[]>([]);
  const [locationsData, setLocationsData] = useState<AdminLocationItem[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<RouteFilterRegion>("all");
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadAll = async () => {
      const [r, l] = await Promise.all([
        AdminStorageService.getRoutes(),
        AdminStorageService.getLocations(),
      ]);
      setRoutesData(r);
      setLocationsData(l);
    };
    loadAll();

    window.addEventListener("focus", loadAll);
    return () => {
      window.removeEventListener("focus", loadAll);
    };
  }, []);

  const filteredRoutes = useMemo(() => {
    if (selectedRegion === "all") return routesData;
    return routesData.filter((r) => r.region === selectedRegion);
  }, [routesData, selectedRegion]);

  const handleSelectRegion = (region: RouteFilterRegion) => {
    setSelectedRegion(region);
    setSelectedRouteId(null);
  };

  return (
    <section id="map" className="relative z-30 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50/70 border-y border-[#E5E7EB]">
      <div className="max-w-6xl mx-auto space-y-7">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div className="max-w-3xl">
            {/* Badge */}
            <span
              className="block text-sm sm:text-[15px] font-bold uppercase tracking-wider mb-2"
              style={{ color: "#07626A" }}
            >
              {dict.homeMap?.badge || "Картирование маршрутов"}
            </span>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold text-gray-900 tracking-tight uppercase mb-3 leading-tight">
              {dict.homeMap?.title || "ИНТЕРАКТИВНАЯ КАРТА МАРШРУТОВ"}
            </h2>

            {/* Subtitle */}
            <p className="text-[13.5px] sm:text-[15px] text-gray-600 leading-relaxed max-w-2xl">
              {dict.homeMap?.subtitle || "Пешие и треккинговые тропы, перепады высот, безопасные стоянки и проверенные локации вокруг Бишкека."}
            </p>
          </div>

          {/* Direct Link to Full Map */}
          <div className="shrink-0">
            <Link
              href="/map"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all active:scale-[0.98]"
              style={{ backgroundColor: "#07626A" }}
            >
              <Maximize2 className="w-4 h-4" />
              <span>{dict.homeMap?.openFullMap || "Перейти на обширную карту"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 1. Region Filter Tabs */}
        <div>
          <MapRegionTabs
            selectedRegion={selectedRegion}
            onSelectRegion={handleSelectRegion}
            routes={routesData}
          />
        </div>

        {/* 2. Interactive Map Container */}
        <div ref={mapContainerRef} className="shadow-xs rounded-2xl sm:rounded-3xl overflow-hidden bg-white">
          <InteractiveMapWrapper
            routes={filteredRoutes}
            locations={locationsData}
            selectedRegion={selectedRegion}
            selectedRouteId={selectedRouteId}
            onSelectRoute={(id) => setSelectedRouteId((prev) => (prev === id ? null : id))}
          />
        </div>

        {/* 3. Map Legend & Bottom Callout */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pt-1">
          <div className="flex-1">
            <MapLegend />
          </div>

          {/* More details link card */}
          <Link
            href="/map"
            className="flex items-center justify-between gap-4 px-5 py-3.5 rounded-2xl bg-white hover:bg-teal-50/40 border border-teal-100/80 transition-all text-gray-800 group shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-[#07626A]" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-gray-900 group-hover:text-[#07626A] transition-colors">
                  {dict.homeMap?.viewDetails || "Все маршруты на большой карте"}
                </div>
                <div className="text-[11px] text-gray-500">
                  GPS-треки, высотные профили и карточки гидов
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#07626A] transition-transform duration-200 group-hover:translate-x-1 shrink-0" />
          </Link>
        </div>
      </div>
    </section>
  );
};
