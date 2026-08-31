"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { RouteItem } from "@/types/route.types";
import { useLanguage } from "@/context/LanguageContext";
import {
  MapPin,
  Clock,
  TrendingUp,
  Footprints,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

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

  const difficultyLabels: Record<
    RouteItem["difficulty"],
    { ru: string; kg: string; en: string; color: string }
  > = {
    easy: { ru: "Лёгкая сложность", kg: "Жеңил", en: "Easy", color: "#07626A" },
    medium: { ru: "Средняя сложность", kg: "Орто", en: "Moderate", color: "#E58A2B" },
    hard: { ru: "Высокая сложность", kg: "Татаал", en: "Difficult", color: "#D9383A" },
  };

  const regionLabels = {
    "ala-archa": { ru: "Ущелье Ала-Арча", kg: "Ала-Арча капчыгайы", en: "Ala-Archa Gorge" },
    alamedin: { ru: "Ущелье Аламедин", kg: "Аламүдүн капчыгайы", en: "Alamedin Gorge" },
    chunkurchak: { ru: "Плато Чункурчак", kg: "Чүңкүрчак платосу", en: "Chunkurchak Plateau" },
  };

  const currentDiff = difficultyLabels[route.difficulty];
  const diffName = currentDiff[language] || currentDiff.ru;
  const regionName = regionLabels[route.region]
    ? regionLabels[route.region][language] || regionLabels[route.region].ru
    : "";

  return (
    <div
      className={`rounded-2xl bg-white border transition-colors duration-150 overflow-hidden flex flex-col justify-between ${
        isSelected
          ? "border-[#07626A]"
          : "border-[#E1E1E1] hover:border-[#07626A]"
      }`}
    >
      <div>
        {/* Route Image Cover */}
        <div className="relative w-full h-48 sm:h-52 bg-[#F0F2F2] overflow-hidden">
          {route.imageUrl && (
            <Image
              src={route.imageUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}

          {/* Badges on Image */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold text-white backdrop-blur-xs"
              style={{ backgroundColor: currentDiff.color }}
            >
              {diffName}
            </span>

            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/60 text-white backdrop-blur-xs">
              {regionName}
            </span>
          </div>
        </div>

        {/* Content Box */}
        <div className="p-5 sm:p-6 flex flex-col gap-3">
          {/* Title */}
          <h3 className="text-lg font-bold text-[#0D0D0D] leading-snug">
            {title}
          </h3>

          {/* Description */}
          <p className="text-sm text-[#0D0D0D]/75 leading-relaxed font-normal line-clamp-2">
            {description}
          </p>

          {/* Key Trail Metrics */}
          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            <div
              className="p-2 rounded-xl border border-[#E1E1E1]"
              style={{ backgroundColor: "rgba(7, 98, 106, 0.05)" }}
            >
              <div className="flex items-center justify-center gap-1 text-[10px] text-[#0D0D0D]/60 font-medium mb-0.5">
                <MapPin className="w-3 h-3 text-[#07626A]" />
                <span>Дистанция</span>
              </div>
              <span className="text-xs font-bold text-[#0D0D0D]">
                {route.distanceKm} км
              </span>
            </div>

            <div
              className="p-2 rounded-xl border border-[#E1E1E1]"
              style={{ backgroundColor: "rgba(7, 98, 106, 0.05)" }}
            >
              <div className="flex items-center justify-center gap-1 text-[10px] text-[#0D0D0D]/60 font-medium mb-0.5">
                <Clock className="w-3 h-3 text-[#07626A]" />
                <span>Время</span>
              </div>
              <span className="text-xs font-bold text-[#0D0D0D]">
                ~{route.durationHours} ч
              </span>
            </div>

            <div
              className="p-2 rounded-xl border border-[#E1E1E1]"
              style={{ backgroundColor: "rgba(7, 98, 106, 0.05)" }}
            >
              <div className="flex items-center justify-center gap-1 text-[10px] text-[#0D0D0D]/60 font-medium mb-0.5">
                <TrendingUp className="w-3 h-3 text-[#07626A]" />
                <span>Подъем</span>
              </div>
              <span className="text-xs font-bold text-[#0D0D0D]">
                +{route.elevationGainMeters} м
              </span>
            </div>
          </div>

          {/* Female Guide Verified Badge */}
          {route.hasFemaleGuide && (
            <div
              className="flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium text-[#07626A] border border-[#07626A]/20"
              style={{ backgroundColor: "rgba(7, 98, 106, 0.08)" }}
            >
              <ShieldCheck className="w-4 h-4 shrink-0 text-[#07626A]" />
              <span>
                {language === "kg"
                  ? "Текшерилген аял-гиддердин коштоосу бар"
                  : language === "en"
                  ? "Verified female guides available for this trail"
                  : "Доступно сопровождение проверенных женщин-гидов"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Card Actions */}
      <div className="p-5 sm:p-6 pt-0 flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => onSelect(route)}
          className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#07626A] text-white text-xs font-bold hover:bg-[#07626A]/90 transition-colors cursor-pointer"
        >
          <Footprints className="w-3.5 h-3.5" />
          <span>
            {language === "kg"
              ? "Картадан көрүү"
              : language === "en"
              ? "View on Map"
              : "Показать на карте"}
          </span>
        </button>

        <Link
          href="/tours"
          className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-semibold text-[#07626A] border border-[#E1E1E1] hover:border-[#07626A] transition-colors"
        >
          <span>
            {language === "kg"
              ? "Гид тандоо"
              : language === "en"
              ? "Find Guide"
              : "Найти гида"}
          </span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
