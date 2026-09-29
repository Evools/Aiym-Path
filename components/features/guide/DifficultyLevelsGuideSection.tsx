"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Clock,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Mountain,
  Footprints,
  Compass,
  AlertTriangle,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { DIFFICULTY_LEVELS_GUIDE } from "@/data/guidebook.data";
import { DifficultyLevelGuide } from "@/types/guidebook.types";
import { AdminStorageService } from "@/lib/services/admin-storage.service";
import { ROUTES_DATA } from "@/data/routes.data";
import { RouteItem } from "@/types/route.types";

export const DifficultyLevelsGuideSection: React.FC = () => {
  const { language } = useLanguage();
  const [selectedLevelId, setSelectedLevelId] = useState<"easy" | "medium" | "hard" | "expert">("medium");
  const [routes, setRoutes] = useState<RouteItem[]>(ROUTES_DATA);

  useEffect(() => {
    async function loadRoutes() {
      const dbRoutes = await AdminStorageService.getRoutes();
      if (dbRoutes && dbRoutes.length > 0) {
        setRoutes(dbRoutes);
      }
    }
    loadRoutes();

    window.addEventListener("focus", loadRoutes);
    return () => {
      window.removeEventListener("focus", loadRoutes);
    };
  }, []);

  const activeLevel: DifficultyLevelGuide = useMemo(() => {
    return (
      DIFFICULTY_LEVELS_GUIDE.find((l) => l.id === selectedLevelId) ||
      DIFFICULTY_LEVELS_GUIDE[1]
    );
  }, [selectedLevelId]);

  // Matching routes from database/admin
  const matchingRoutes = useMemo(() => {
    return routes.filter((r) => {
      if (selectedLevelId === "easy") return r.difficulty === "easy";
      if (selectedLevelId === "medium") return r.difficulty === "medium";
      if (selectedLevelId === "hard" || selectedLevelId === "expert") return r.difficulty === "hard";
      return true;
    });
  }, [routes, selectedLevelId]);

  const levelIcons: Record<"easy" | "medium" | "hard" | "expert", React.ReactNode> = {
    easy: <Footprints className="w-4 h-4" />,
    medium: <Compass className="w-4 h-4" />,
    hard: <TrendingUp className="w-4 h-4" />,
    expert: <Mountain className="w-4 h-4" />,
  };

  return (
    <div className="mt-16 pt-12 border-t border-[#E1E1E1]">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[#07626A] text-xs font-bold uppercase tracking-wider mb-2.5 bg-[#F0F2F2]">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>
            {language === "kg"
              ? "Татаалдык деңгээлдери"
              : language === "en"
              ? "Trail Difficulty Levels"
              : "Классификация сложности"}
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-[#0D0D0D] tracking-tight uppercase">
          {language === "kg"
            ? "Маршруттардын татаалдык деңгээли жана даярдык"
            : language === "en"
            ? "Difficulty Classification & Preparation Guide"
            : "Информация по уровням сложности и подготовке"}
        </h3>
        <p className="text-xs sm:text-sm text-[#0D0D0D]/70 mt-1 max-w-2xl">
          {language === "kg"
            ? "Өзүңүздүн тажрыйбаңызга жана физикалык даярдыгыңызга ылайыктуу маршрутту тандаңыз"
            : language === "en"
            ? "Select a trail that matches your fitness level, high-altitude experience, and equipment"
            : "Подбирайте маршрут в соответствии с вашей физической формой, опытом в горах и экипировкой"}
        </p>
      </div>

      {/* Level Selector Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 mb-6">
        {DIFFICULTY_LEVELS_GUIDE.map((level) => {
          const isSelected = selectedLevelId === level.id;
          const badgeText = level.badge[language as "ru" | "kg" | "en"] || level.badge.ru;

          return (
            <button
              key={level.id}
              type="button"
              onClick={() => setSelectedLevelId(level.id)}
              className={`p-3.5 sm:p-4 rounded-2xl text-left transition-all duration-200 cursor-pointer border select-none flex flex-col justify-between min-h-[96px] ${
                isSelected
                  ? "bg-[#F0F2F2] border-[#07626A] shadow-xs"
                  : "bg-white border-[#E1E1E1] hover:border-[rgba(7,98,106,0.30)] hover:bg-[#FAFBFB]"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected
                      ? "bg-[#07626A] text-white"
                      : "bg-[#F0F2F2] text-[#07626A]"
                  }`}
                >
                  {levelIcons[level.id]}
                </div>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-[#07626A]" />
                )}
              </div>

              <div className="mt-2">
                <div
                  className={`text-xs sm:text-[13px] font-bold ${
                    isSelected ? "text-[#07626A]" : "text-[#0D0D0D]"
                  }`}
                >
                  {badgeText}
                </div>
                <div className="text-[11px] text-[#0D0D0D]/55 truncate mt-0.5">
                  {level.duration[language as "ru" | "kg" | "en"] || level.duration.ru}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Level Detail Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#FAFBFB] border border-[#E1E1E1] space-y-6">
        {/* Title & Quick Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#E1E1E1]">
          <div>
            <span className="text-xs font-bold text-[#07626A] uppercase tracking-wider block mb-1">
              {activeLevel.badge[language as "ru" | "kg" | "en"] || activeLevel.badge.ru}
            </span>
            <h4 className="text-lg sm:text-xl font-extrabold text-[#0D0D0D]">
              {activeLevel.title[language as "ru" | "kg" | "en"] || activeLevel.title.ru}
            </h4>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E1E1E1] text-xs font-bold text-[#0D0D0D]">
              <Clock className="w-3.5 h-3.5 text-[#07626A]" />
              <span>{activeLevel.duration[language as "ru" | "kg" | "en"] || activeLevel.duration.ru}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E1E1E1] text-xs font-bold text-[#0D0D0D]">
              <TrendingUp className="w-3.5 h-3.5 text-[#07626A]" />
              <span>{activeLevel.elevation[language as "ru" | "kg" | "en"] || activeLevel.elevation.ru}</span>
            </div>
          </div>
        </div>

        {/* Description & Requirements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="text-xs font-bold text-[#0D0D0D]/50 uppercase tracking-wider mb-2">
              {language === "kg"
                ? "Мүнөздөмө жана шарттар"
                : language === "en"
                ? "Trail Characteristics"
                : "Характеристика маршрута"}
            </h5>
            <p className="text-xs sm:text-sm text-[#0D0D0D]/80 leading-relaxed">
              {activeLevel.description[language as "ru" | "kg" | "en"] || activeLevel.description.ru}
            </p>

            <div className="mt-4 p-3.5 rounded-2xl bg-white border border-[#E1E1E1]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#07626A] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-[#0D0D0D]">
                    {language === "kg"
                      ? "Ылайыктуу локациялар:"
                      : language === "en"
                      ? "Representative Locations:"
                      : "Примеры локаций:"}
                  </div>
                  <div className="text-xs text-[#0D0D0D]/70 mt-0.5">
                    {activeLevel.suitableFor[language as "ru" | "kg" | "en"] || activeLevel.suitableFor.ru}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h5 className="text-xs font-bold text-[#0D0D0D]/50 uppercase tracking-wider mb-2">
              {language === "kg"
                ? "Милдеттүү жабдуулар"
                : language === "en"
                ? "Mandatory Gear"
                : "Обязательное снаряжение для уровня"}
            </h5>
            <div className="space-y-2">
              {(activeLevel.requiredGear[language as "ru" | "kg" | "en"] || activeLevel.requiredGear.ru).map(
                (gear, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-[#E1E1E1] text-xs font-medium text-[#0D0D0D]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#07626A] shrink-0" />
                    <span>{gear}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Matching Live Routes from Admin/Database */}
        {matchingRoutes.length > 0 && (
          <div className="pt-4 border-t border-[#E1E1E1]">
            <div className="flex items-center justify-between gap-3 mb-3">
              <span className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
                {language === "kg"
                  ? `Бул деңгээлдеги маршруттар (${matchingRoutes.length}):`
                  : language === "en"
                  ? `Matching Catalog Routes (${matchingRoutes.length}):`
                  : `Маршруты этого уровня сложности (${matchingRoutes.length}):`}
              </span>
              <Link
                href="/map"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#07626A] hover:underline"
              >
                <span>
                  {language === "kg"
                    ? "Интерактивдүү картага өтүү"
                    : language === "en"
                    ? "To Interactive Map"
                    : "На интерактивную карту"}
                </span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="flex flex-wrap gap-2">
              {matchingRoutes.map((route) => {
                const title = route.title[language as "ru" | "kg" | "en"] || route.title.ru;
                const unitKm = language === "en" ? "km" : "км";
                const unitM = language === "en" ? "m" : "м";

                return (
                  <Link
                    key={route.id}
                    href={`/map?route=${route.id}`}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-[#F0F2F2] border border-[#E1E1E1] text-xs font-semibold text-[#0D0D0D] hover:text-[#07626A] transition-colors"
                  >
                    <Footprints className="w-3.5 h-3.5 text-[#07626A]" />
                    <span>{title}</span>
                    <span className="text-[10px] text-[#0D0D0D]/50">
                      ({route.distanceKm} {unitKm} • +{route.elevationGainMeters} {unitM})
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
