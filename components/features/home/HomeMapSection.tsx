"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Maximize2, ArrowRight } from "lucide-react";
import { RouteFilterRegion, RouteItem } from "@/types/route.types";
import { AdminStorageService, AdminLocationItem } from "@/lib/services/admin-storage.service";
import { ROUTES_DATA } from "@/data/routes.data";
import { INITIAL_LOCATIONS } from "@/data/locations.data";
import { MapRegionTabs, isRouteInRegion } from "@/components/features/map/MapRegionTabs";
import { InteractiveMapWrapper } from "@/components/features/map/InteractiveMapWrapper";
import { useLanguage } from "@/context/LanguageContext";

export const HomeMapSection: React.FC = () => {
  const { dict } = useLanguage();
  const [routesData, setRoutesData] = useState<RouteItem[]>(ROUTES_DATA);
  const [locationsData, setLocationsData] = useState<AdminLocationItem[]>(INITIAL_LOCATIONS as unknown as AdminLocationItem[]);
  const [selectedRegion, setSelectedRegion] = useState<RouteFilterRegion>("all");
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  useEffect(() => {
    const loadAll = async () => {
      const [r, l] = await Promise.all([
        AdminStorageService.getRoutes(),
        AdminStorageService.getLocations(),
      ]);
      if (r && r.length > 0) setRoutesData(r);
      if (l && l.length > 0) setLocationsData(l);
    };
    loadAll();

    window.addEventListener("focus", loadAll);
    return () => {
      window.removeEventListener("focus", loadAll);
    };
  }, []);

  const filteredRoutes = useMemo(() => {
    if (selectedRegion === "all") return routesData;
    return routesData.filter((r) => isRouteInRegion(r.region, selectedRegion));
  }, [routesData, selectedRegion]);

  const handleSelectRegion = (region: RouteFilterRegion) => {
    setSelectedRegion(region);
    setSelectedRouteId(null);
  };

  const handleSelectRoute = (id: string) => {
    setSelectedRouteId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="map" className="relative z-40 pt-10 sm:pt-16 pb-16 sm:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto space-y-6">
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
            <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold text-[#0D0D0D] tracking-tight uppercase mb-3 leading-tight">
              {dict.homeMap?.title || "ИНТЕРАКТИВНАЯ КАРТА МАРШРУТОВ"}
            </h2>

            {/* Subtitle */}
            <p className="text-[13.5px] sm:text-[15px] text-[#0D0D0D]/70 leading-relaxed max-w-2xl">
              {dict.homeMap?.subtitle || "Пешие и треккинговые тропы, перепады высот, безопасные стоянки и проверенные локации Кыргызстана."}
            </p>
          </div>

          {/* Direct Link to Full Map */}
          <div className="shrink-0">
            <Link
              href="/map"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all active:scale-[0.98]"
              style={{ backgroundColor: "#07626A" }}
            >
              <Maximize2 className="w-4 h-4" />
              <span>{dict.homeMap?.openFullMap || "Перейти на обширную карту"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Region Filter Tabs */}
        <div>
          <MapRegionTabs
            selectedRegion={selectedRegion}
            onSelectRegion={handleSelectRegion}
            routes={routesData}
          />
        </div>

        {/* Interactive Map Container */}
        <div className="rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-[#E1E1E1] shadow-xs">
          <InteractiveMapWrapper
            routes={filteredRoutes}
            locations={locationsData}
            selectedRegion={selectedRegion}
            selectedRouteId={selectedRouteId}
            onSelectRoute={handleSelectRoute}
          />
        </div>
      </div>
    </section>
  );
};
