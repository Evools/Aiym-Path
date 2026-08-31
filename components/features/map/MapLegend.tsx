"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export const MapLegend: React.FC = () => {
  const { language } = useLanguage();

  const labels = {
    easy: { ru: "Лёгкий маршрут", kg: "Жеңил маршрут", en: "Easy Trail" },
    medium: { ru: "Средний маршрут", kg: "Орто татаалдыктагы", en: "Moderate Trail" },
    hard: { ru: "Сложный маршрут", kg: "Татаал маршрут", en: "Difficult Trail" },
    guesthouse: { ru: "Гостевой дом", kg: "Конок үйү", en: "Guesthouse" },
    service: { ru: "Сервис", kg: "Кызмат көрсөтүү", en: "Service / Hub" },
  };

  return (
    <div className="flex items-center gap-4 sm:gap-6 flex-wrap text-xs text-[#0D0D0D] font-medium py-3 px-1">
      {/* Easy */}
      <div className="flex items-center gap-2">
        <span className="w-4 h-1 rounded-full bg-[#07626A]" />
        <span>{labels.easy[language] || labels.easy.ru}</span>
      </div>

      {/* Medium */}
      <div className="flex items-center gap-2">
        <span className="w-4 h-1 rounded-full bg-[#E58A2B]" />
        <span>{labels.medium[language] || labels.medium.ru}</span>
      </div>

      {/* Hard */}
      <div className="flex items-center gap-2">
        <span className="w-4 h-1 rounded-full bg-[#D9383A]" />
        <span>{labels.hard[language] || labels.hard.ru}</span>
      </div>

      {/* Guesthouse */}
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-[#E58A2B]" />
        <span>{labels.guesthouse[language] || labels.guesthouse.ru}</span>
      </div>

      {/* Service */}
      <div className="flex items-center gap-2">
        <span className="w-4 h-1 rounded-full bg-[#9CA3AF]" />
        <span>{labels.service[language] || labels.service.ru}</span>
      </div>
    </div>
  );
};
