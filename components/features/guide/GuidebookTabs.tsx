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
    <div className="inline-flex p-1.5 rounded-2xl bg-[#F0F2F2] border border-[#E1E1E1]">
      <button
        type="button"
        onClick={() => onChangeAudience("travelers")}
        className={`px-5 sm:px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-150 cursor-pointer flex items-center gap-2 select-none ${
          activeAudience === "travelers"
            ? "bg-[#07626A] text-white"
            : "text-[#0D0D0D] hover:text-[#07626A]"
        }`}
      >
        <span>{dict.guidebook?.tabTravelers || "Путешественникам"}</span>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            activeAudience === "travelers"
              ? "bg-white/20 text-white"
              : "bg-black/5 text-[#0D0D0D]"
          }`}
        >
          {travelersCount}
        </span>
      </button>

      <button
        type="button"
        onClick={() => onChangeAudience("providers")}
        className={`px-5 sm:px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-150 cursor-pointer flex items-center gap-2 select-none ${
          activeAudience === "providers"
            ? "bg-[#07626A] text-white"
            : "text-[#0D0D0D] hover:text-[#07626A]"
        }`}
      >
        <span>{dict.guidebook?.tabProviders || "Поставщикам услуг"}</span>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            activeAudience === "providers"
              ? "bg-white/20 text-white"
              : "bg-black/5 text-[#0D0D0D]"
          }`}
        >
          {providersCount}
        </span>
      </button>
    </div>
  );
};
