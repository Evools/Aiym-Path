"use client";

import React from "react";
import { RouteItem } from "@/types/route.types";
import { useLanguage } from "@/context/LanguageContext";
import { RouteCard } from "./RouteCard";

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
  const { language } = useLanguage();

  const title = {
    ru: "СПИСОК МАРШРУТОВ",
    kg: "МАРШРУТТАР ТИЗМЕСИ",
    en: "TRAIL DIRECTORY",
  };

  return (
    <section className="py-10 sm:py-14 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#0D0D0D] tracking-tight uppercase mb-6 sm:mb-8">
          {title[language] || title.ru}
        </h2>

        {/* Vertical Stack with 20px gap */}
        <div className="flex flex-col gap-[20px]">
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
