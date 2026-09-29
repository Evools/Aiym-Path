"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Footprints, Mountain, ShieldCheck, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { INITIAL_LOCATIONS } from "@/data/locations.data";
import { LocationDifficulty } from "@/types/location.types";

export const LocationsSection: React.FC = () => {
  const { dict, language } = useLanguage();
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  const regionsList = useMemo(
    () => [
      { id: "all", label: { ru: "Все регионы", kg: "Бардык аймактар", en: "All Regions" } },
      { id: "chuy", label: { ru: "Чуйская область", kg: "Чүй облусу", en: "Chuy Region" } },
      { id: "issyk-kul", label: { ru: "Иссык-Кульская", kg: "Ысык-Көл", en: "Issyk-Kul" } },
      { id: "naryn", label: { ru: "Нарынская", kg: "Нарын", en: "Naryn" } },
      { id: "osh", label: { ru: "Ошская", kg: "Ош", en: "Osh" } },
      { id: "jalal-abad", label: { ru: "Джалал-Абадская", kg: "Жалал-Абад", en: "Jalal-Abad" } },
    ],
    []
  );

  const difficultyList: { id: "all" | LocationDifficulty; label: { ru: string; kg: string; en: string } }[] = useMemo(
    () => [
      {
        id: "all",
        label: { ru: dict.locations?.filterAllDifficulties || "Все уровни", kg: "Бардык деңгээлдер", en: "All Levels" },
      },
      {
        id: "easy",
        label: { ru: dict.locations?.difficultyEasy || "Лёгкий", kg: "Жеңил", en: "Easy" },
      },
      {
        id: "medium",
        label: { ru: dict.locations?.difficultyMedium || "Средний", kg: "Орточо", en: "Medium" },
      },
      {
        id: "hard",
        label: { ru: dict.locations?.difficultyHard || "Высокий", kg: "Татаал", en: "Hard" },
      },
    ],
    [dict]
  );

  const filteredLocations = useMemo(() => {
    return INITIAL_LOCATIONS.filter((loc) => {
      // Region filter
      if (selectedRegion !== "all") {
        if (loc.region !== selectedRegion) {
          if (selectedRegion === "chuy" && !["ala-archa", "alamedin", "chunkurchak", "chuy"].includes(loc.region || "")) {
            return false;
          }
          if (selectedRegion !== "chuy") return false;
        }
      }
      // Difficulty filter
      if (selectedDifficulty !== "all") {
        if (loc.difficulty !== selectedDifficulty) return false;
      }
      return true;
    });
  }, [selectedRegion, selectedDifficulty]);

  const getDifficultyText = (diff: LocationDifficulty) => {
    switch (diff) {
      case "easy":
        return dict.locations?.difficultyEasy || "Лёгкий";
      case "medium":
        return dict.locations?.difficultyMedium || "Средний";
      case "hard":
        return dict.locations?.difficultyHard || "Высокий";
      default:
        return diff;
    }
  };

  const getRegionName = (regId: string) => {
    const reg = regionsList.find((r) => r.id === regId);
    if (!reg) return regId;
    return reg.label[language as "ru" | "kg" | "en"] || reg.label.ru;
  };

  return (
    <section id="locations" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-[#E1E1E1]">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div className="max-w-3xl">
            {/* Label / Badge */}
            <span
              className="block text-sm sm:text-[15px] font-bold uppercase tracking-wider mb-2.5"
              style={{ color: "#07626A" }}
            >
              {dict.locations.badge}
            </span>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold text-[#0D0D0D] tracking-tight uppercase mb-3 leading-tight">
              {dict.locations.title}
            </h2>

            {/* Subtitle */}
            <p className="text-[13.5px] sm:text-[15px] text-[#0D0D0D]/70 leading-relaxed">
              {dict.locations.subtitle}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <Link
              href="/map"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E1E1E1] bg-[#F0F2F2] hover:bg-[#EAF4F4] text-xs sm:text-sm font-bold text-[#07626A] transition-all active:scale-[0.98]"
            >
              <MapPin className="w-4 h-4 text-[#07626A]" />
              <span>{dict.locations.viewOnMap}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>
        </div>

        {/* Dual Filters Bar: Regions + Difficulty Levels */}
        <div className="space-y-3.5">
          {/* Row 1: Regions Filter Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <span className="text-xs font-bold text-[#0D0D0D]/60 uppercase tracking-wider min-w-[70px]">
              {language === "kg" ? "Аймак:" : language === "en" ? "Region:" : "Регион:"}
            </span>
            <div className="inline-flex p-1 rounded-2xl bg-[#F0F2F2] border border-[#E1E1E1] gap-1 overflow-x-auto no-scrollbar max-w-full">
              {regionsList.map((reg) => {
                const isSelected = selectedRegion === reg.id;
                const title = reg.label[language as "ru" | "kg" | "en"] || reg.label.ru;
                return (
                  <button
                    key={reg.id}
                    type="button"
                    onClick={() => setSelectedRegion(reg.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 shrink-0 cursor-pointer ${
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
          </div>

          {/* Row 2: Difficulty Levels Filter Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <span className="text-xs font-bold text-[#0D0D0D]/60 uppercase tracking-wider min-w-[70px]">
              {language === "kg" ? "Деңгээл:" : language === "en" ? "Level:" : "Уровень:"}
            </span>
            <div className="inline-flex p-1 rounded-2xl bg-[#F0F2F2] border border-[#E1E1E1] gap-1 overflow-x-auto no-scrollbar max-w-full">
              {difficultyList.map((diff) => {
                const isSelected = selectedDifficulty === diff.id;
                const title = diff.label[language as "ru" | "kg" | "en"] || diff.label.ru;
                return (
                  <button
                    key={diff.id}
                    type="button"
                    onClick={() => setSelectedDifficulty(diff.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 shrink-0 cursor-pointer ${
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
          </div>
        </div>

        {/* Locations Grid */}
        {filteredLocations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            {filteredLocations.map((loc) => {
              const title = loc.title[language as "ru" | "kg" | "en"] || loc.title.ru;
              const desc = loc.desc[language as "ru" | "kg" | "en"] || loc.desc.ru;
              const imageSrc = loc.imageUrl || "/images/locations/ala-archa.jpg";
              const keyParam = loc.key || loc.id;
              const diffText = getDifficultyText(loc.difficulty);
              const regionTitle = getRegionName(loc.region);

              return (
                <Link
                  key={loc.id}
                  href={`/map?location=${keyParam}`}
                  className="group relative h-[380px] sm:h-[420px] lg:h-[440px] rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between p-6 sm:p-7 block border border-[#E1E1E1]"
                >
                  {/* Background Image */}
                  <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 via-50% to-transparent pointer-events-none" />

                  {/* Top Badges */}
                  <div className="relative z-10 flex items-center justify-between gap-2 flex-wrap">
                    {/* Region Pill */}
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-white/95 text-[#0D0D0D] border border-[#E1E1E1] shadow-xs">
                      {regionTitle}
                    </span>

                    {/* Difficulty Pill */}
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-white/95 text-[#07626A] border border-[#E1E1E1] shadow-xs">
                      {diffText}
                    </span>
                  </div>

                  {/* Bottom Content */}
                  <div className="relative z-10 text-white space-y-2.5">
                    <h3 className="text-lg sm:text-[19px] font-bold tracking-tight text-white drop-shadow-xs leading-snug">
                      {title}
                    </h3>

                    <p className="text-[12.5px] sm:text-[13.5px] text-gray-200/90 leading-relaxed line-clamp-2">
                      {desc}
                    </p>

                    {/* Stats Pill Row */}
                    <div className="flex items-center gap-3 pt-1 text-[11.5px] text-white/90 font-medium">
                      <div className="flex items-center gap-1">
                        <Footprints className="w-3.5 h-3.5 text-white/80" />
                        <span>{loc.distanceKm} {dict.locations.km || "км"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mountain className="w-3.5 h-3.5 text-white/80" />
                        <span>+{loc.elevationGainMeters} {dict.locations.meters || "м"}</span>
                      </div>
                      {loc.hasFemaleGuide && (
                        <div className="flex items-center gap-1 text-white">
                          <ShieldCheck className="w-3.5 h-3.5 text-white/80" />
                          <span>Female Guide</span>
                        </div>
                      )}
                    </div>

                    {/* Action Link */}
                    <div className="pt-1 inline-flex items-center gap-2 text-xs sm:text-[13px] font-semibold text-white transition-colors">
                      <span>{dict.locations.viewOnMap}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-[#F0F2F2] rounded-2xl border border-[#E1E1E1]">
            <p className="text-sm text-[#0D0D0D]/70 font-medium">
              {language === "kg"
                ? "Бул критерийлерге дал келген локациялар табылган жок."
                : language === "en"
                ? "No locations found matching the selected filters."
                : "По выбранным критериям локаций не найдено."}
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedRegion("all");
                setSelectedDifficulty("all");
              }}
              className="mt-3 text-xs font-bold text-[#07626A] hover:underline cursor-pointer"
            >
              {language === "kg" ? "Чыпкаларды тазалоо" : language === "en" ? "Reset filters" : "Сбросить фильтры"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
