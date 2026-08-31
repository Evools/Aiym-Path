"use client";

import React from "react";
import { GuidebookAudience } from "@/types/guidebook.types";
import { useLanguage } from "@/context/LanguageContext";

interface GuidebookTabsProps {
  activeAudience: GuidebookAudience;
  onChangeAudience: (audience: GuidebookAudience) => void;
  travelersCount: number;
  providersCount: number;
}

export const GuidebookTabs: React.FC<GuidebookTabsProps> = ({
  activeAudience,
  onChangeAudience,
  travelersCount,
  providersCount,
}) => {
  const { dict } = useLanguage();

  return (
    <div className="inline-flex p-1.5 rounded-2xl bg-gray-100/90 border border-gray-200/80 shadow-2xs">
      <button
        type="button"
        onClick={() => onChangeAudience("travelers")}
        className={`px-5 sm:px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 select-none ${
          activeAudience === "travelers"
            ? "bg-[#07626A] text-white shadow-xs"
            : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
        }`}
      >
        <span>{dict.guidebook?.tabTravelers || "Путешественникам"}</span>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            activeAudience === "travelers"
              ? "bg-white/20 text-white"
              : "bg-gray-200/70 text-gray-600"
          }`}
        >
          {travelersCount}
        </span>
      </button>

      <button
        type="button"
        onClick={() => onChangeAudience("providers")}
        className={`px-5 sm:px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 select-none ${
          activeAudience === "providers"
            ? "bg-[#07626A] text-white shadow-xs"
            : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
        }`}
      >
        <span>{dict.guidebook?.tabProviders || "Поставщикам услуг"}</span>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            activeAudience === "providers"
              ? "bg-white/20 text-white"
              : "bg-gray-200/70 text-gray-600"
          }`}
        >
          {providersCount}
        </span>
      </button>
    </div>
  );
};
