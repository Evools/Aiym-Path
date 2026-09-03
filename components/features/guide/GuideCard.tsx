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
  MapPin,
  Sparkles,
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
    (guide as AdminGuideItem).groupSize || dict.guides?.groupSize || "1–8 чел";

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
        title: dict.guides?.skills?.firstAid || "Первая помощь (WFR)",
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
      <div className="flex flex-col justify-between overflow-hidden rounded-3xl bg-white border border-[#E1E1E1] hover:border-[rgba(7,98,106,0.40)] shadow-xs hover:shadow-md transition-all duration-300 group">
        {/* Guide Photo with Certified Badge & Quick Action */}
        <div className="relative w-full aspect-[16/10] bg-[#F0F2F2] overflow-hidden">
          <Image
            src={guide.image || "/images/guides/guide-2.jpg"}
            alt={guide.name}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 380px"
            className="object-cover object-center group-hover:scale-104 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />

          {/* Certified Badge Top Right */}
          {guide.isVerified && (
            <div className="absolute top-3.5 right-3.5 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#07626A] text-white text-[11px] font-bold shadow-md">
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              <span>{dict.guides?.certified || "Certified"}</span>
            </div>
          )}

          {/* Experience Badge Top Left */}
          {(guide as AdminGuideItem).experienceYears && (
            <div className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-full bg-white/95 text-[#0D0D0D] text-[11px] font-extrabold shadow-xs border border-black/5">
              {(guide as AdminGuideItem).experienceYears} лет опыта
            </div>
          )}

          {/* Bottom rating & price bar on image */}
          <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white text-xs font-semibold">
            <span className="flex items-center gap-1 bg-black/45 backdrop-blur-xs px-2.5 py-1 rounded-xl">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold">
                {(guide as AdminGuideItem).rating ? (guide as AdminGuideItem).rating?.toFixed(1) : "5.0"}
              </span>
            </span>

            {(guide as AdminGuideItem).priceRange && (
              <span className="bg-[#07626A]/90 backdrop-blur-xs px-2.5 py-1 rounded-xl text-[11px] font-bold text-white shadow-2xs">
                {(guide as AdminGuideItem).priceRange}
              </span>
            )}
          </div>
        </div>

        {/* Guide Content Body */}
        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-3">
          <div>
            {/* Location Pills */}
            {guide.locations && guide.locations.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {guide.locations.slice(0, 3).map((loc, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-lg bg-[#F0F2F2] border border-[#E1E1E1] text-[11px] font-semibold text-[#0D0D0D]/85"
                  >
                    {loc}
                  </span>
                ))}
                {guide.locations.length > 3 && (
                  <span className="px-2 py-0.5 rounded-lg bg-[#F0F2F2] text-[10px] font-bold text-[#0D0D0D]/60 border border-[#E1E1E1]">
                    +{guide.locations.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Guide Name */}
            <h3 className="text-base sm:text-[17px] font-extrabold text-[#0D0D0D] leading-snug">
              {guide.name}
            </h3>

            {/* Guide Role / Specialization */}
            {guideRole && (
              <p className="text-xs text-[#07626A] font-bold mt-0.5 mb-3 line-clamp-1">
                {guideRole}
              </p>
            )}

            {/* Interactive Badges & Icons Bar */}
            {badgesList.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mb-3">
                {badgesList.map((badge) => {
                  const isActive = activeBadgeId === badge.id;

                  return (
                    <button
                      key={badge.id}
                      type="button"
                      onClick={() => setActiveBadgeId(isActive ? null : badge.id)}
                      title={badge.title}
                      className={`h-8 rounded-xl inline-flex items-center cursor-pointer transition-all duration-200 overflow-hidden select-none border ${
                        isActive
                          ? "bg-[rgba(7,98,106,0.15)] text-[#07626A] border-[#07626A] ring-1 ring-[#07626A]/20"
                          : "bg-[rgba(7,98,106,0.07)] text-[#07626A] border-[rgba(7,98,106,0.18)] hover:bg-[rgba(7,98,106,0.12)]"
                      }`}
                    >
                      <span className="w-8 h-8 flex items-center justify-center shrink-0">
                        {getBadgeIconComponent(badge.icon, "w-4 h-4")}
                      </span>

                      <div
                        className={`grid transition-[grid-template-columns,opacity,padding] duration-300 ease-out ${
                          isActive
                            ? "grid-cols-[1fr] opacity-100 pr-2.5"
                            : "grid-cols-[0fr] opacity-0 pr-0"
                        }`}
                      >
                        <span className="overflow-hidden whitespace-nowrap text-xs font-bold">
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
                <div className="flex flex-wrap gap-1 mb-2">
                  {(guide as AdminGuideItem).specialties!.slice(0, 3).map((spec, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-md bg-[#FAFBFB] border border-[#E1E1E1] text-[#07626A] text-[10.5px] font-semibold"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              )}

            {/* Divider */}
            <div className="border-t border-[#E1E1E1] my-3" />

            {/* Languages & Group Size */}
            <div className="flex items-center justify-between gap-2 text-xs text-[#0D0D0D]/75 mb-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <Languages className="w-3.5 h-3.5 text-[#07626A] shrink-0" />
                <span className="truncate font-medium">{guideLanguages}</span>
              </div>

              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#F0F2F2] text-[#07626A] text-[11px] font-bold shrink-0 border border-[#E1E1E1]">
                <Users className="w-3 h-3" />
                <span>{guideGroupSize}</span>
              </div>
            </div>
          </div>

          {/* Action Row: Call, WhatsApp, Details */}
          <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#E1E1E1]">
            {/* Phone & WhatsApp Buttons */}
            <div className="flex items-center gap-1.5">
              <a
                href={`tel:${cleanPhone}`}
                className="p-2.5 rounded-xl bg-[#F0F2F2] hover:bg-[#07626A] text-[#07626A] hover:text-white border border-[#E1E1E1] hover:border-[#07626A] transition-colors"
                title={`Позвонить: ${guide.phone}`}
              >
                <Phone className="w-4 h-4" />
              </a>

              {waNumber && (
                <a
                  href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                    `Здравствуйте! Я нашла ваш профиль на платформе Aiym Path.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-[rgba(37,211,102,0.12)] hover:bg-[#25D366] text-[#128C7E] hover:text-white border border-[rgba(37,211,102,0.25)] hover:border-[#25D366] transition-colors"
                  title="Написать в WhatsApp"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
              )}
            </div>

            {/* View Full Profile Button */}
            <button
              type="button"
              onClick={() => setIsDetailOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#07626A] hover:bg-[#07626A]/90 text-white text-xs font-bold transition-all cursor-pointer shadow-2xs hover:shadow-xs"
            >
              Подробнее
            </button>
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
