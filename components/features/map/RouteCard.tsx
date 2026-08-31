"use client";

import React from "react";
import { RouteItem } from "@/types/route.types";
import { useLanguage } from "@/context/LanguageContext";

interface RouteCardProps {
  route: RouteItem;
  isSelected?: boolean;
  onSelect: (route: RouteItem) => void;
}

export const RouteCard: React.FC<RouteCardProps> = ({
  route,
  isSelected,
  onSelect,
}) => {
  const { language } = useLanguage();

  const title = route.title[language] || route.title.ru;
  const description = route.description[language] || route.description.ru;

  const difficultyLabels: Record<RouteItem["difficulty"], { ru: string; kg: string; en: string }> = {
    easy: { ru: "Лёгкая", kg: "Жеңил", en: "Easy" },
    medium: { ru: "Средняя", kg: "Орто", en: "Moderate" },
    hard: { ru: "Сложная", kg: "Татаал", en: "Difficult" },
  };

  const femaleGuideLabel = {
    ru: "Есть женщина-гид",
    kg: "Аял-гид бар",
    en: "Female Guide Available",
  };

  return (
    <div
      onClick={() => onSelect(route)}
      className={`flex flex-col items-start gap-[10px] p-[24px_32px] rounded-2xl bg-white border cursor-pointer text-left transition-colors duration-150 select-none ${
        isSelected
          ? "border-[#07626A]"
          : "border-[#E1E1E1] hover:border-[#07626A]"
      }`}
    >
      {/* Title */}
      <h3 className="text-base sm:text-lg font-bold text-[#0D0D0D] leading-snug">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-[#0D0D0D]/75 leading-relaxed font-normal">
        {description}
      </p>

      {/* Badges Row */}
      <div className="flex items-center gap-2 flex-wrap pt-1">
        {/* Difficulty Badge */}
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#F0F2F2] text-[#0D0D0D]">
          {difficultyLabels[route.difficulty][language] || difficultyLabels[route.difficulty].ru}
        </span>

        {/* Distance Badge */}
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#F0F2F2] text-[#0D0D0D]">
          {route.distanceKm} км
        </span>

        {/* Duration Badge */}
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#F0F2F2] text-[#0D0D0D]">
          ~{route.durationHours} ч
        </span>

        {/* Female Guide Available */}
        {route.hasFemaleGuide && (
          <span
            className="px-3 py-1 rounded-full text-xs font-medium text-[#07626A]"
            style={{ backgroundColor: "rgba(7, 98, 106, 0.10)" }}
          >
            {femaleGuideLabel[language] || femaleGuideLabel.ru}
          </span>
        )}
      </div>
    </div>
  );
};
