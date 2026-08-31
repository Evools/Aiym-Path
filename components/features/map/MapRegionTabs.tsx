"use client";

import React from "react";
import { RouteFilterRegion } from "@/types/route.types";
import { useLanguage } from "@/context/LanguageContext";

interface MapRegionTabsProps {
  selectedRegion: RouteFilterRegion;
  onSelectRegion: (region: RouteFilterRegion) => void;
}

export const MapRegionTabs: React.FC<MapRegionTabsProps> = ({
  selectedRegion,
  onSelectRegion,
}) => {
  const { language } = useLanguage();

  const regions: { id: RouteFilterRegion; label: { ru: string; kg: string; en: string } }[] = [
    {
      id: "all",
      label: {
        ru: "Все регионы",
        kg: "Бардык аймактар",
        en: "All Regions",
      },
    },
    {
      id: "ala-archa",
      label: {
        ru: "Ущелье Ала-Арча",
        kg: "Ала-Арча капчыгайы",
        en: "Ala-Archa Gorge",
      },
    },
    {
      id: "alamedin",
      label: {
        ru: "Ущелье Аламедин",
        kg: "Аламүдүн капчыгайы",
        en: "Alamedin Gorge",
      },
    },
    {
      id: "chunkurchak",
      label: {
        ru: "Чункурчак",
        kg: "Чүңкүрчак",
        en: "Chunkurchak",
      },
    },
  ];

  return (
    <div className="inline-flex p-1 rounded-2xl bg-[#F0F2F2] border border-[#E1E1E1] flex-wrap">
      {regions.map((region) => {
        const isSelected = selectedRegion === region.id;
        const title = region.label[language] || region.label.ru;

        return (
          <button
            key={region.id}
            type="button"
            onClick={() => onSelectRegion(region.id)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-150 cursor-pointer select-none ${
              isSelected
                ? "bg-[#07626A] text-white"
                : "text-[#0D0D0D] hover:text-[#07626A]"
            }`}
          >
            {title}
          </button>
        );
      })}
    </div>
  );
};
