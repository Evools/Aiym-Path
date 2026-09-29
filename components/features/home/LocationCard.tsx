"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Phone,
  ArrowRight,
  ShieldCheck,
  Building2,
  Tent,
  Radio,
  CheckCircle2,
} from "lucide-react";
import { AdminLocationItem } from "@/lib/services/admin-storage.service";
import { useLanguage } from "@/context/LanguageContext";

interface LocationCardProps {
  location: AdminLocationItem;
}

export const LocationCard: React.FC<LocationCardProps> = ({ location }) => {
  const { language, dict } = useLanguage();

  const title =
    location.title[language as "ru" | "kg" | "en"] || location.title.ru;
  const description =
    location.description[language as "ru" | "kg" | "en"] ||
    location.description.ru;

  const getTypeBadge = () => {
    switch (location.type) {
      case "hotel":
        return {
          label: dict.locations?.typeHotel || "Отель / Резорт",
          icon: <Building2 className="w-3.5 h-3.5" />,
          color: "bg-[#07626A] text-white",
        };
      case "camp":
        return {
          label: dict.locations?.typeCamp || "Лагерь / Юрты",
          icon: <Tent className="w-3.5 h-3.5" />,
          color: "bg-[#07626A] text-white",
        };
      case "hub":
        return {
          label: dict.locations?.typeHub || "Хаб безопасности",
          icon: <Radio className="w-3.5 h-3.5 text-amber-400" />,
          color: "bg-[#0D0D0D] text-white",
        };
      default:
        return {
          label: dict.locations?.badge || "Кыргызстан",
          icon: <MapPin className="w-3.5 h-3.5" />,
          color: "bg-[#07626A] text-white",
        };
    }
  };

  const typeInfo = getTypeBadge();
  const imageSrc =
    location.image ||
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80";

  const mapLink = `/map?lat=${location.coordinates[0]}&lng=${location.coordinates[1]}&loc=${location.id}`;

  return (
    <div className="rounded-2xl bg-white border border-[#E1E1E1] overflow-hidden flex flex-col justify-between">
      <div>
        {/* Card Header & Photo */}
        <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-[#F0F2F2]">
          <Image
            src={imageSrc}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
            className="object-cover"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 z-10">
            {/* Category / Type Badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${typeInfo.color}`}
            >
              {typeInfo.icon}
              <span>{typeInfo.label}</span>
            </span>

            {/* Verified Safety Standard Badge */}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-white text-[#07626A] border border-[#E1E1E1]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#07626A]" />
              <span>{dict.locations?.safetyVerified || "Стандарт безопасности"}</span>
            </span>
          </div>

          {/* Bottom Overlay Title */}
          <div className="absolute bottom-3 left-4 right-4 z-10">
            <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug line-clamp-1">
              {title}
            </h3>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Description */}
          <p className="text-xs sm:text-[13px] text-[#0D0D0D]/75 leading-relaxed line-clamp-2 min-h-[38px]">
            {description}
          </p>

          {/* Amenities Badges */}
          {location.amenities && location.amenities.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0D0D0D]/50 block">
                {dict.locations?.amenitiesTitle || "Удобства и сервисы"}:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {location.amenities.slice(0, 4).map((amenity, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F0F2F2] border border-[#E1E1E1] text-[11px] font-semibold text-[#0D0D0D]/80"
                  >
                    <CheckCircle2 className="w-3 h-3 text-[#07626A]" />
                    <span>{amenity}</span>
                  </span>
                ))}
                {location.amenities.length > 4 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-lg bg-[#EAF4F4] text-[11px] font-bold text-[#07626A]">
                    +{location.amenities.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Contacts & Coordinates info */}
          <div className="pt-3 border-t border-[#E1E1E1]/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {location.phone ? (
              <a
                href={`tel:${location.phone.replace(/\s+/g, "")}`}
                className="inline-flex items-center gap-1.5 font-bold text-[#0D0D0D] hover:text-[#07626A] transition-colors line-clamp-1"
              >
                <Phone className="w-3.5 h-3.5 text-[#07626A] shrink-0" />
                <span className="font-mono text-[11px]">{location.phone}</span>
              </a>
            ) : (
              <div className="inline-flex items-center gap-1.5 text-[#0D0D0D]/60 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#07626A] shrink-0" />
                <span className="text-[11px]">24/7 Security</span>
              </div>
            )}

            <div className="inline-flex items-center gap-1.5 text-[#0D0D0D]/60 sm:justify-end">
              <MapPin className="w-3.5 h-3.5 text-[#07626A] shrink-0" />
              <span className="font-mono text-[11px] text-[#07626A] font-bold">
                {location.coordinates[0].toFixed(2)}, {location.coordinates[1].toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer / Action Button */}
      <div className="p-5 sm:p-6 pt-0">
        <Link
          href={mapLink}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#F0F2F2] hover:bg-[#07626A] text-[#07626A] hover:text-white border border-[#E1E1E1] hover:border-[#07626A] text-xs sm:text-sm font-bold transition-colors"
        >
          <MapPin className="w-4 h-4 text-[#07626A] hover:text-white transition-colors" />
          <span>{dict.locations?.viewOnMap || "Смотреть на карте"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
