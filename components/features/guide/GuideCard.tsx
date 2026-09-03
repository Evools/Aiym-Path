"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  Languages,
  Users,
  Phone,
  MessageSquare,
  Star,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { AdminGuideItem, AdminGuideBadge } from "@/lib/services/admin-storage.service";
import { GuideItem } from "@/data/guides.data";
import { getBadgeIconComponent } from "@/lib/constants/guide-badges";
import { GuideProfileModal } from "./GuideProfileModal";

export const GuideCard: React.FC<{ guide: AdminGuideItem | GuideItem }> = ({ guide }) => {
  const { dict, language } = useLanguage();
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeBadgeId, setActiveBadgeId] = useState<string | null>(null);

  const guideRole =
    typeof (guide as AdminGuideItem).role === "object"
      ? (guide as AdminGuideItem).role[language as "ru" | "kg" | "en"] ||
        (guide as AdminGuideItem).role.ru
      : (guide as any).role || "";

  const guideLanguages =
    (guide as AdminGuideItem).languages && (guide as AdminGuideItem).languages.length > 0
      ? (guide as AdminGuideItem).languages.join(", ")
      : dict.guides?.languages || "Кыргызча, Русский";

  const guideGroupSize =
    (guide as AdminGuideItem).groupSize || dict.guides?.groupSize || "1–8 человек";

  const cleanPhone = guide.phone?.replace(/[^0-9+]/g, "") || "";
  const waNumber = (guide as AdminGuideItem).whatsapp
    ? (guide as AdminGuideItem).whatsapp!.replace(/[^0-9]/g, "")
    : cleanPhone.replace(/[^0-9]/g, "");

  // Build combined badges list (from custom badges or fallback to skills)
  const badgesList: { id: string; icon: string; title: string }[] = [];

  if ((guide as AdminGuideItem).badges && (guide as AdminGuideItem).badges!.length > 0) {
    (guide as AdminGuideItem).badges!.forEach((b: AdminGuideBadge) => {
      const label =
        typeof b.label === "object"
          ? b.label[language as "ru" | "kg" | "en"] || b.label.ru
          : b.label;
      badgesList.push({ id: b.id, icon: b.icon, title: label });
    });
  } else {
    if ((guide as AdminGuideItem).skills?.firstAid ?? true) {
      badgesList.push({
        id: "firstAid",
        icon: "HeartPulse",
        title: dict.guides?.skills?.firstAid || "Первая медицинская помощь",
      });
    }
    if ((guide as AdminGuideItem).skills?.mountaineer ?? true) {
      badgesList.push({
        id: "mountaineer",
        icon: "Mountain",
        title: dict.guides?.skills?.mountaineer || "Альпинизм",
      });
    }
    if ((guide as AdminGuideItem).skills?.mountainGuide ?? true) {
      badgesList.push({
        id: "mountainGuide",
        icon: "Award",
        title: dict.guides?.skills?.mountainGuide || "Лицензия гида",
      });
    }
  }

  return (
    <>
      <div className="flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-[#E5E7EB] hover:border-[rgba(7,98,106,0.30)] transition-colors duration-200">
        {/* Guide Photo with Certified Badge */}
        <div className="relative w-full aspect-[16/9.5] bg-gray-100 overflow-hidden">
          <Image
            src={guide.image || "/images/guides/guide-2.jpg"}
            alt={guide.name}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 380px"
            className="object-cover object-center"
          />

          {/* Certified Badge Top Right */}
          {guide.isVerified && (
            <div
              className="absolute top-3.5 right-3.5 inline-flex items-center gap-1 px-3 py-1 rounded-full text-white text-[11px] font-medium shadow-xs"
              style={{ backgroundColor: "#07626A" }}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              <span>{dict.guides?.certified || "Certified"}</span>
            </div>
          )}

          {/* Experience Badge Top Left */}
          {(guide as AdminGuideItem).experienceYears && (
            <div className="absolute top-3.5 left-3.5 px-2.5 py-0.5 rounded-full bg-white/90 text-gray-900 text-[11px] font-medium shadow-2xs">
              {(guide as AdminGuideItem).experienceYears} лет опыта
            </div>
          )}
        </div>

        {/* Guide Content Body */}
        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
          <div>
            {/* Location Pills */}
            {guide.locations && guide.locations.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {guide.locations.map((loc, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-full bg-[#F3F4F6] text-[11px] font-medium text-gray-700"
                  >
                    {loc}
                  </span>
                ))}
              </div>
            )}

            {/* Guide Name */}
            <h3 className="text-base sm:text-[17px] font-bold text-gray-900 leading-snug">
              {guide.name}
            </h3>

            {/* Guide Role / Specialization */}
            {guideRole && (
              <p className="text-xs text-[#07626A] font-semibold mt-1 mb-3">
                {guideRole}
              </p>
            )}

            {/* Interactive Clean Badges & Skills Row */}
            {badgesList.length > 0 && (
              <div className="flex items-center gap-2 mb-3.5 h-8">
                {badgesList.map((badge, idx) => {
                  const isActive = (activeBadgeId ?? badgesList[0]?.id) === badge.id;

                  return (
                    <button
                      key={badge.id || idx}
                      type="button"
                      onClick={() => setActiveBadgeId(isActive ? null : badge.id)}
                      title={badge.title}
                      className={`h-8 rounded-lg bg-[#EAF4F4] text-[#07626A] inline-flex items-center cursor-pointer transition-colors duration-200 overflow-hidden select-none ${
                        isActive ? "hover:bg-[#EAF4F4]" : "hover:bg-[#DCEDED]"
                      }`}
                    >
                      <span className="w-8 h-8 flex items-center justify-center shrink-0">
                        {getBadgeIconComponent(badge.icon, "w-3.5 h-3.5")}
                      </span>

                      <div
                        className={`grid transition-[grid-template-columns,opacity,padding] duration-300 ease-out ${
                          isActive
                            ? "grid-cols-[1fr] opacity-100 pr-3"
                            : "grid-cols-[0fr] opacity-0 pr-0"
                        }`}
                      >
                        <span className="overflow-hidden whitespace-nowrap text-xs font-medium">
                          {badge.title}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Specialties / Tour Tags */}
            {(guide as AdminGuideItem).specialties &&
              (guide as AdminGuideItem).specialties!.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {(guide as AdminGuideItem).specialties!.slice(0, 3).map((spec, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-md bg-[#F3F4F6] text-[#07626A] text-[11px] font-medium"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              )}

            {/* Divider */}
            <div className="border-t border-gray-100 my-3" />

            {/* Languages */}
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-2.5">
              <Languages className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              <span className="truncate">{guideLanguages}</span>
            </div>

            {/* Group Size Badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EAF4F4] text-[#07626A] text-xs font-medium mb-4">
              <Users className="w-3.5 h-3.5" />
              <span>{guideGroupSize}</span>
            </div>
          </div>

          {/* Action Row: Phone Call & Profile Details */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <a
              href={`tel:${cleanPhone}`}
              className="inline-flex items-center gap-2 text-sm font-bold text-gray-900 hover:text-[#07626A] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-gray-800" />
              <span>{guide.phone}</span>
            </a>

            <div className="flex items-center gap-2">
              {waNumber && (
                <a
                  href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                    `Здравствуйте! Я нашла ваш профиль на платформе Aiym Path.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                  title="Написать в WhatsApp"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
              )}

              <button
                type="button"
                onClick={() => setIsDetailOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-[#07626A] hover:bg-[#07626A]/90 text-white text-xs font-bold transition-all cursor-pointer shadow-2xs hover:shadow-xs"
              >
                Подробнее
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Detail Modal */}
      <GuideProfileModal
        guide={guide as AdminGuideItem}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </>
  );
};
