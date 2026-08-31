"use client";

import React, { useState, useEffect } from "react";
import { RouteFilterRegion } from "@/types/route.types";
import { useLanguage } from "@/context/LanguageContext";
import {
  AdminStorageService,
  AdminRegionItem,
} from "@/lib/services/admin-storage.service";

interface MapRegionTabsProps {
  selectedRegion: RouteFilterRegion;
  onSelectRegion: (region: RouteFilterRegion) => void;
}

export const MapRegionTabs: React.FC<MapRegionTabsProps> = ({
  selectedRegion,
  onSelectRegion,
}) => {
  const { language } = useLanguage();
  const [regions, setRegions] = useState<AdminRegionItem[]>([]);

  useEffect(() => {
    setRegions(AdminStorageService.getRegions());
  }, []);

  const allTabLabel = {
    ru: "Все регионы",
    kg: "Бардык аймактар",
    en: "All Regions",
  };

  return (
    <div className="inline-flex p-1.5 rounded-2xl bg-[#F0F2F2] border border-[#E1E1E1] flex-wrap gap-1">
      {/* "All" Tab */}
      <button
        type="button"
        onClick={() => onSelectRegion("all")}
        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer select-none ${
          selectedRegion === "all"
            ? "bg-[#07626A] text-white shadow-xs"
            : "text-[#0D0D0D]/75 hover:text-[#07626A] hover:bg-white/60"
        }`}
      >
        {allTabLabel[language] || allTabLabel.ru}
      </button>

      {/* Dynamic Regions */}
      {regions.map((reg) => {
        const isSelected = selectedRegion === reg.id;
        const title = reg.label[language] || reg.label.ru;

        return (
          <button
            key={reg.id}
            type="button"
            onClick={() => onSelectRegion(reg.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer select-none ${
              isSelected
                ? "bg-[#07626A] text-white shadow-xs"
                : "text-[#0D0D0D]/75 hover:text-[#07626A] hover:bg-white/60"
            }`}
          >
            {title}
          </button>
        );
      })}
    </div>
  );
};
