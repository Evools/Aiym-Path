"use client";

import React from "react";
import Image from "next/image";
import {
  X,
  CheckCircle2,
  Phone,
  MessageSquare,
  Send,
  Languages,
  Users,
  MapPin,
  Star,
} from "lucide-react";
import { AdminGuideItem, AdminGuideBadge } from "@/lib/services/admin-storage.service";
import { getBadgeIconComponent } from "@/lib/constants/guide-badges";
import { useLanguage } from "@/context/LanguageContext";

interface GuideProfileModalProps {
  guide: AdminGuideItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const GuideProfileModal: React.FC<GuideProfileModalProps> = ({
  guide,
  isOpen,
  onClose,
}) => {
  const { language, dict } = useLanguage();

  if (!isOpen || !guide) return null;

  const roleText =
    typeof guide.role === "object"
      ? guide.role[language as "ru" | "kg" | "en"] || guide.role.ru
      : (guide as any).role || "";

  const bioText =
    guide.bio && typeof guide.bio === "object"
      ? guide.bio[language as "ru" | "kg" | "en"] || guide.bio.ru
      : "";

  const cleanPhone = guide.phone?.replace(/[^0-9+]/g, "") || "";
  const waNumber = guide.whatsapp
    ? guide.whatsapp.replace(/[^0-9]/g, "")
    : cleanPhone.replace(/[^0-9]/g, "");

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden border border-[#E1E1E1] shadow-2xl animate-in zoom-in-95 duration-150 my-auto flex flex-col max-h-[92vh]"
      >
        {/* Header with Photo & Verification Badge */}
        <div className="relative w-full h-56 sm:h-64 bg-gray-100 shrink-0">
          <Image
            src={guide.image || "/images/guides/guide-2.jpg"}
            alt={guide.name}
            fill
            unoptimized
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white flex items-center justify-center transition-all cursor-pointer"
            title="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top-Left Verification Pill */}
          {guide.isVerified && (
            <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#07626A] text-white text-xs font-bold shadow-md">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{dict.guides?.certified || "Проверенный гид Aiym Path"}</span>
            </div>
          )}

          {/* Bottom Title on Image */}
          <div className="absolute bottom-4 left-5 right-5 text-white">
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              {guide.name}
            </h2>
            <p className="text-xs sm:text-sm text-teal-200 font-semibold mt-0.5">
              {roleText}
            </p>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-5 flex-1">
          {/* Fast Stats Row */}
          <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-[#F0F4F4] border border-[#E1E1E1]/70 text-center">
            <div>
              <span className="text-[10px] font-bold text-[#0D0D0D]/50 uppercase tracking-wider block">
                Опыт работы
              </span>
              <span className="text-sm font-extrabold text-[#07626A]">
                {guide.experienceYears}{" "}
                {guide.experienceYears === 1
                  ? "год"
                  : guide.experienceYears < 5
                  ? "года"
                  : "лет"}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-[#0D0D0D]/50 uppercase tracking-wider block">
                Рейтинг
              </span>
              <span className="text-sm font-extrabold text-amber-600 flex items-center justify-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{guide.rating ? guide.rating.toFixed(1) : "5.0"}</span>
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-[#0D0D0D]/50 uppercase tracking-wider block">
                Группа
              </span>
              <span className="text-sm font-extrabold text-[#07626A]">
                {guide.groupSize || "1–8 чел"}
              </span>
            </div>
          </div>

          {/* Locations & Languages */}
          <div className="space-y-2.5">
            {guide.locations && guide.locations.length > 0 && (
              <div className="flex items-start gap-2 text-xs">
                <MapPin className="w-4 h-4 text-[#07626A] shrink-0 mt-0.5" />
                <div className="flex flex-wrap gap-1.5">
                  <span className="font-bold text-[#0D0D0D]">Регионы:</span>
                  {guide.locations.map((loc, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-lg bg-[#FAFBFB] border border-[#E1E1E1] text-[11px] font-semibold text-[#0D0D0D]"
                    >
                      {loc}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {guide.languages && guide.languages.length > 0 && (
              <div className="flex items-center gap-2 text-xs">
                <Languages className="w-4 h-4 text-[#07626A] shrink-0" />
                <span className="font-bold text-[#0D0D0D]">Языки:</span>
                <span className="text-[#0D0D0D]/80">
                  {guide.languages.join(", ")}
                </span>
              </div>
            )}
          </div>

          {/* Competency Badges & Icons */}
          {guide.badges && guide.badges.length > 0 && (
            <div>
              <span className="block text-xs font-bold text-[#0D0D0D] uppercase tracking-wider mb-2.5">
                Компетенции и сертификаты ({guide.badges.length}):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {guide.badges.map((b: AdminGuideBadge) => {
                  const label =
                    typeof b.label === "object"
                      ? b.label[language as "ru" | "kg" | "en"] || b.label.ru
                      : b.label;

                  return (
                    <div
                      key={b.id}
                      className="p-2.5 rounded-xl bg-white border border-[#E1E1E1] hover:border-[#07626A]/30 flex items-center gap-2.5 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[rgba(7,98,106,0.10)] text-[#07626A] flex items-center justify-center shrink-0">
                        {getBadgeIconComponent(b.icon, "w-3.5 h-3.5")}
                      </div>
                      <span className="text-xs font-semibold text-[#0D0D0D] leading-tight">
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Specialties / Tour Types */}
          {guide.specialties && guide.specialties.length > 0 && (
            <div>
              <span className="block text-xs font-bold text-[#0D0D0D] uppercase tracking-wider mb-2">
                Специализация по турам:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {guide.specialties.map((spec, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-[rgba(7,98,106,0.06)] border border-[rgba(7,98,106,0.18)] text-[#07626A] text-xs font-bold"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* About / Bio */}
          {bioText && (
            <div className="p-4 rounded-2xl bg-[#FAFBFB] border border-[#E1E1E1] space-y-1">
              <span className="text-[11px] font-bold text-[#0D0D0D]/60 uppercase tracking-wider block">
                О гиде:
              </span>
              <p className="text-xs sm:text-[13px] text-[#0D0D0D]/80 leading-relaxed">
                {bioText}
              </p>
            </div>
          )}

          {/* Price Range Notice */}
          {guide.priceRange && (
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-xs font-bold text-emerald-900">
                Стоимость услуг:
              </span>
              <span className="text-xs font-extrabold text-emerald-800">
                {guide.priceRange}
              </span>
            </div>
          )}
        </div>

        {/* Fixed Contact Buttons Footer */}
        <div className="p-4 sm:px-7 border-t border-[#E1E1E1] bg-white shrink-0 flex flex-wrap items-center justify-between gap-3">
          <a
            href={`tel:${cleanPhone}`}
            className="flex-1 min-w-[140px] h-11 px-4 rounded-xl bg-[#F0F2F2] hover:bg-[#E1E5E5] text-[#0D0D0D] text-xs font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4 text-[#07626A]" />
            <span>Позвонить</span>
          </a>

          {waNumber && (
            <a
              href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                `Здравствуйте! Я нашла ваш профиль на платформе Aiym Path и хочу узнать подробнее о турах.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[140px] h-11 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          )}

          {guide.telegram && (
            <a
              href={`https://t.me/${guide.telegram.replace(/^@/, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="h-11 px-4 rounded-xl bg-[#229ED9] hover:bg-[#1e8bc0] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shrink-0"
              title="Написать в Telegram"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Telegram</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
