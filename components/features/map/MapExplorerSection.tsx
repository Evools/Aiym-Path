"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { RouteFilterRegion, RouteItem } from "@/types/route.types";
import { AdminStorageService, AdminLocationItem } from "@/lib/services/admin-storage.service";
import { MapRegionTabs } from "./MapRegionTabs";
import { InteractiveMapWrapper } from "./InteractiveMapWrapper";
import { MapLegend } from "./MapLegend";
import { RoutesListSection } from "./RoutesListSection";

export const MapExplorerSection: React.FC = () => {
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

  const handleSelectRoute = (route: RouteItem) => {
    setSelectedRouteId(route.id);
    if (route.region !== selectedRegion && selectedRegion !== "all") {
      setSelectedRegion("all");
    }

    if (mapContainerRef.current) {
      mapContainerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="w-full bg-white px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* 1. Region Filter Tabs */}
        <div>
          <MapRegionTabs
            selectedRegion={selectedRegion}
            onSelectRegion={handleSelectRegion}
            routes={routesData}
          />
        </div>

        {/* 2. Interactive Map */}
        <div ref={mapContainerRef}>
          <InteractiveMapWrapper
            routes={filteredRoutes}
            locations={locationsData}
            selectedRegion={selectedRegion}
            selectedRouteId={selectedRouteId}
            onSelectRoute={(id) => setSelectedRouteId((prev) => (prev === id ? null : id))}
          />
        </div>

        {/* 3. Map Legend */}
        <MapLegend />

        {/* 4. Filtered Route Cards List */}
        <RoutesListSection
          routes={filteredRoutes}
          selectedRouteId={selectedRouteId}
          onSelectRoute={handleSelectRoute}
        />
      </div>
    </div>
  );
};
