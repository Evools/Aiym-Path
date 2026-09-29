"use client";

import React from "react";
import { RouteItem } from "@/types/route.types";
import { useLanguage } from "@/context/LanguageContext";
import { RouteCard } from "./RouteCard";
import { Compass } from "lucide-react";

interface RoutesListSectionProps {
  routes: RouteItem[];
  selectedRouteId: string | null;
  onSelectRoute: (route: RouteItem) => void;
}

export const RoutesListSection: React.FC<RoutesListSectionProps> = ({
  routes,
  selectedRouteId,
  onSelectRoute,
}) => {
  const { language, dict } = useLanguage();

  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-6 sm:mb-8">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[#07626A] text-xs font-semibold uppercase mb-2.5"
            style={{ backgroundColor: "rgba(7, 98, 106, 0.10)" }}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>
              {dict.mapPage?.trailDirectory ||
                (language === "kg"
                  ? "Тоо багыттары"
                  : language === "en"
                  ? "Trail Directory"
                  : "Каталог троп")}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0D0D0D] tracking-tight">
            {dict.mapPage?.popularTrails ||
              (language === "kg"
                ? "ПОПУЛЯРДУУ ЖӨӨ МАРШРУТТАР"
                : language === "en"
                ? "POPULAR HIKING TRAILS"
                : "ПОПУЛЯРНЫЕ ПЕШИЕ МАРШРУТЫ")}
          </h2>

          <p className="text-sm text-[#0D0D0D]/75 mt-1 max-w-2xl">
            {dict.mapPage?.popularTrailsSubtitle ||
              (language === "kg"
                ? "Кыргызстандын коопсуздук деңгээли текшерилген жана аял-гиддер коштогон тоо чыйырлары"
                : language === "en"
                ? "Verified Kyrgyzstan mountain trails with safety certification and female guide support"
                : "Проверенные горные тропы Кыргызстана с оценкой безопасности и сопровождением женщин-гидов")}
          </p>
        </div>

        {/* 2-Column Responsive Grid with exact 20px gap */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
          {routes.map((route) => (
            <RouteCard
              key={route.id}
              route={route}
              isSelected={selectedRouteId === route.id}
              onSelect={onSelectRoute}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
