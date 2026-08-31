"use client";

import React, { useState } from "react";
import Image from "next/image";
import { RouteItem, AssignedGuide } from "@/types/route.types";
import { useLanguage } from "@/context/LanguageContext";
import {
  MapPin,
  Clock,
  TrendingUp,
  Footprints,
  ShieldCheck,
  Phone,
  MessageCircle,
  Users,
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

  const guides: AssignedGuide[] =
    route.assignedGuides && route.assignedGuides.length > 0
      ? route.assignedGuides
      : route.assignedGuide
      ? [route.assignedGuide]
      : [];

  const [activeGuideIdx, setActiveGuideIdx] = useState<number>(0);
  const activeGuide = guides[activeGuideIdx] || guides[0] || null;

  return (
    <div
      className={`rounded-2xl sm:rounded-3xl bg-white border transition-colors duration-150 overflow-hidden flex flex-col justify-between ${
        isSelected
          ? "border-[#07626A]"
          : "border-[#E1E1E1] hover:border-[#07626A]"
      }`}
    >
      <div>
        {/* Route Cover Image */}
        <div className="relative w-full h-52 sm:h-56 bg-[#F0F2F2] overflow-hidden">
          {route.imageUrl && (
            <Image
              src={route.imageUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}

          {/* Badges Overlay */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <span
              className="px-3 py-1.5 rounded-full text-xs font-bold text-white backdrop-blur-xs"
              style={{ backgroundColor: currentDiff.color }}
            >
              {diffName}
            </span>

            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-black/65 text-white backdrop-blur-xs">
              {regionName}
            </span>
          </div>
        </div>

        {/* Content Box with Exact Standard Padding */}
        <div className="p-6 sm:p-8 flex flex-col gap-4">
          {/* Title & Region */}
          <div>
            <span className="text-xs font-bold uppercase text-[#07626A] tracking-wide block mb-1">
              {regionName}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-[#0D0D0D] leading-snug">
              {title}
            </h3>
          </div>

          {/* Description */}
          <p className="text-sm text-[#0D0D0D]/75 leading-relaxed font-normal line-clamp-2">
            {description}
          </p>

          {/* Key Metrics Strip (Distance, Walking Time, Elevation Gain) */}
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div
              className="p-3 rounded-xl border border-[#E1E1E1] flex flex-col items-center justify-center"
              style={{ backgroundColor: "rgba(7, 98, 106, 0.04)" }}
            >
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#0D0D0D]/60 font-medium mb-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#07626A]" />
                <span>Дистанция</span>
              </div>
              <span className="text-sm font-bold text-[#0D0D0D]">
                {route.distanceKm} км
              </span>
            </div>

            <div
              className="p-3 rounded-xl border border-[#E1E1E1] flex flex-col items-center justify-center"
              style={{ backgroundColor: "rgba(7, 98, 106, 0.04)" }}
            >
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#0D0D0D]/60 font-medium mb-0.5">
                <Clock className="w-3.5 h-3.5 text-[#07626A]" />
                <span>Пешком</span>
              </div>
              <span className="text-sm font-bold text-[#0D0D0D]">
                ~{route.durationHours} ч
              </span>
            </div>

            <div
              className="p-3 rounded-xl border border-[#E1E1E1] flex flex-col items-center justify-center"
              style={{ backgroundColor: "rgba(7, 98, 106, 0.04)" }}
            >
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#0D0D0D]/60 font-medium mb-0.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#07626A]" />
                <span>Подъем</span>
              </div>
              <span className="text-sm font-bold text-[#0D0D0D]">
                +{route.elevationGainMeters} м
              </span>
            </div>
          </div>

          {/* Assigned Female Guides Section */}
          {guides.length > 0 && activeGuide && (
            <div className="p-4 rounded-2xl bg-[#F0F2F2] border border-[#E1E1E1] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-[#07626A] flex items-center gap-1.5">
                  {guides.length > 1 ? (
                    <>
                      <Users className="w-4 h-4" />
                      <span>Ответственные гиды ({guides.length})</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Ответственный гид</span>
                    </>
                  )}
                </span>
                <span className="text-xs font-semibold text-[#0D0D0D]/60">
                  {activeGuide.experienceYears} лет опыта
                </span>
              </div>

              {/* Multiple Guides Selector Tabs */}
              {guides.length > 1 && (
                <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-[#E1E1E1]">
                  {guides.map((g, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveGuideIdx(idx)}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer truncate ${
                        activeGuideIdx === idx
                          ? "bg-[#07626A] text-white"
                          : "text-[#0D0D0D]/70 hover:bg-[#F0F2F2]"
                      }`}
                    >
                      {g.name.split(" ")[0]}
                    </button>
                  ))}
                </div>
              )}

              {/* Active Guide Profile Row */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden bg-white border border-[#E1E1E1] shrink-0">
                    {activeGuide.image ? (
                      <Image
                        src={activeGuide.image}
                        alt={activeGuide.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#07626A]/10 text-[#07626A] font-bold text-sm">
                        {activeGuide.name[0]}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-[#0D0D0D] truncate">
                      {activeGuide.name}
                    </h4>
                    <p className="text-xs text-[#0D0D0D]/65 truncate">
                      {activeGuide.role[language] || activeGuide.role.ru}
                    </p>
                  </div>
                </div>

                {/* Direct Action Contacts */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href={`https://wa.me/${activeGuide.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                      `Здравствуйте, ${activeGuide.name}! Хочу забронировать сопровождение по маршруту «${title}».`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-[#07626A] text-white text-xs font-bold hover:bg-[#07626A]/90 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={`tel:${activeGuide.phone.replace(/\s+/g, "")}`}
                    className="p-2 rounded-xl text-[#07626A] border border-[#E1E1E1] hover:border-[#07626A] bg-white transition-colors"
                    title={`Позвонить ${activeGuide.name}`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card Action: View On Map */}
      <div className="p-6 sm:p-8 pt-0">
        <button
          type="button"
          onClick={() => onSelect(route)}
          className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white border border-[#E1E1E1] hover:border-[#07626A] text-[#07626A] text-xs sm:text-sm font-bold transition-colors cursor-pointer"
        >
          <Footprints className="w-4 h-4" />
          <span>
            {language === "kg"
              ? "Маршрутту интерактивдүү картадан көрүү"
              : language === "en"
              ? "View Trail on Interactive Map"
              : "Показать маршрут на карте"}
          </span>
        </button>
      </div>
    </div>
  );
};
