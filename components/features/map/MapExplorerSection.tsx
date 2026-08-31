"use client";

import React, { useState, useMemo, useRef } from "react";
import { RouteRegion, RouteItem } from "@/types/route.types";
import { ROUTES_DATA } from "@/data/routes.data";
import { MapRegionTabs } from "./MapRegionTabs";
import { InteractiveMapWrapper } from "./InteractiveMapWrapper";
import { MapLegend } from "./MapLegend";
import { RoutesListSection } from "./RoutesListSection";

export const MapExplorerSection: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<RouteRegion>("all");
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const filteredRoutes = useMemo(() => {
    if (selectedRegion === "all") return ROUTES_DATA;
    return ROUTES_DATA.filter((r) => r.region === selectedRegion);
  }, [selectedRegion]);

  const handleSelectRegion = (region: RouteRegion) => {
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
          />
        </div>

        {/* 2. Interactive Map */}
        <div ref={mapContainerRef}>
          <InteractiveMapWrapper
            routes={filteredRoutes}
            selectedRegion={selectedRegion}
            selectedRouteId={selectedRouteId}
            onSelectRoute={(id) => setSelectedRouteId((prev) => (prev === id ? null : id))}
          />
        </div>

        {/* 3. Map Legend */}
        <MapLegend />

        {/* 4. Rich Routes Directory Section */}
        <RoutesListSection
          routes={filteredRoutes}
          selectedRouteId={selectedRouteId}
          onSelectRoute={handleSelectRoute}
        />
      </div>
    </div>
  );
};
