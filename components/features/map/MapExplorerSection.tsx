"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { RouteFilterRegion, RouteItem } from "@/types/route.types";
import { AdminStorageService, AdminLocationItem } from "@/lib/services/admin-storage.service";
import { MapRegionTabs, isRouteInRegion } from "./MapRegionTabs";
import { InteractiveMapWrapper } from "./InteractiveMapWrapper";
import { MapLegend } from "./MapLegend";
import { useLanguage } from "@/context/LanguageContext";
import { Layers } from "lucide-react";

export const MapExplorerSection: React.FC = () => {
  const { language, dict } = useLanguage();
  const [routesData, setRoutesData] = useState<RouteItem[]>([]);
  const [locationsData, setLocationsData] = useState<AdminLocationItem[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<RouteFilterRegion>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<"all" | "easy" | "medium" | "hard">("all");
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
    return routesData.filter((r) => {
      if (selectedRegion !== "all" && !isRouteInRegion(r.region, selectedRegion)) {
        return false;
      }
      if (selectedDifficulty !== "all" && r.difficulty !== selectedDifficulty) {
        return false;
      }
      return true;
    });
  }, [routesData, selectedRegion, selectedDifficulty]);

  const handleSelectRegion = (region: RouteFilterRegion) => {
    setSelectedRegion(region);
    setSelectedRouteId(null);
  };

  const difficultyList: {
    id: "all" | "easy" | "medium" | "hard";
    label: { ru: string; kg: string; en: string };
  }[] = [
    {
      id: "all",
      label: {
        ru: "Все уровни",
        kg: "Бардык деңгээлдер",
        en: "All Levels",
      },
    },
    {
      id: "easy",
      label: {
        ru: "Лёгкий",
        kg: "Жеңил",
        en: "Easy",
      },
    },
    {
      id: "medium",
      label: {
        ru: "Средний",
        kg: "Орточо",
        en: "Moderate",
      },
    },
    {
      id: "hard",
      label: {
        ru: "Высокий",
        kg: "Татаал",
        en: "Difficult",
      },
    },
  ];

  return (
    <div className="w-full bg-white px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* 1. Dual Filters Bar: Region Tabs & Difficulty Levels directly on Map */}
        <div className="space-y-3.5">
          {/* Row 1: Region Tabs */}
          <div>
            <MapRegionTabs
              selectedRegion={selectedRegion}
              onSelectRegion={handleSelectRegion}
              routes={routesData}
            />
          </div>

          {/* Row 2: Difficulty Level Tabs for Map */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <span className="text-xs font-bold text-[#0D0D0D]/60 uppercase tracking-wider min-w-[70px] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#07626A]" />
              <span>{language === "kg" ? "Деңгээл:" : language === "en" ? "Level:" : "Уровень:"}</span>
            </span>

            <div className="inline-flex p-1 rounded-2xl bg-[#F0F2F2] border border-[#E1E1E1] gap-1 overflow-x-auto no-scrollbar max-w-full">
              {difficultyList.map((diff) => {
                const isSelected = selectedDifficulty === diff.id;
                const title = diff.label[language as "ru" | "kg" | "en"] || diff.label.ru;
                const count =
                  diff.id === "all"
                    ? routesData.length
                    : routesData.filter((r) => r.difficulty === diff.id).length;

                return (
                  <button
                    key={diff.id}
                    type="button"
                    onClick={() => setSelectedDifficulty(diff.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-colors shrink-0 cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-[#07626A] text-white"
                        : "text-[#0D0D0D]/75 hover:text-[#07626A] hover:bg-white/60"
                    }`}
                  >
                    <span>{title}</span>
                    <span
                      className={`text-[11px] px-1.5 py-0.2 rounded-md font-semibold ${
                        isSelected ? "bg-white/20 text-white" : "bg-black/5 text-[#0D0D0D]/60"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
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
      </div>
    </div>
  );
};
