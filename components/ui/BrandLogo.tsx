"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { AdminStorageService } from "@/lib/services/admin-storage.service";
import { DEFAULT_SITE_LOGO, SiteLogoData } from "@/types/settings.types";

interface BrandLogoProps {
  className?: string;
  isLink?: boolean;
  href?: string;
  size?: "sm" | "md" | "lg";
  isAdmin?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = "",
  isLink = true,
  href = "/",
  size = "md",
  isAdmin = false,
}) => {
  const { language } = useLanguage();
  const [logoData, setLogoData] = useState<SiteLogoData>(DEFAULT_SITE_LOGO);

  useEffect(() => {
    let isMounted = true;
    const fetchLogo = () => {
      AdminStorageService.getLogoSettings()
        .then((data) => {
          if (isMounted && data) {
            setLogoData(data);
          }
        })
        .catch((err) => console.error("Failed to load logo settings:", err));
    };

    fetchLogo();

    window.addEventListener("aiym_path_logo_change", fetchLogo);
    window.addEventListener("storage", fetchLogo);

    return () => {
      isMounted = false;
      window.removeEventListener("aiym_path_logo_change", fetchLogo);
      window.removeEventListener("storage", fetchLogo);
    };
  }, []);

  const currentLang = (language || "ru") as "ru" | "kg" | "en";
  const mainText = logoData.text?.[currentLang] || DEFAULT_SITE_LOGO.text.ru;
  const subText = logoData.subtext?.[currentLang] || DEFAULT_SITE_LOGO.subtext.ru;

  const content = (
    <div className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {/* Custom Graphic Logo (Image) */}
      {(logoData.type === "image" || logoData.type === "both") && logoData.imageUrl && (
        <div
          className="relative shrink-0 flex items-center justify-center overflow-hidden"
          style={{
            height: `${logoData.imageHeight || (size === "lg" ? 40 : size === "sm" ? 28 : 34)}px`,
            width: `${Math.round((logoData.imageHeight || 36) * 1.3)}px`,
          }}
        >
          <Image
            src={logoData.imageUrl}
            alt={mainText}
            fill
            className="object-contain object-left"
            sizes="120px"
          />
        </div>
      )}

      {/* Text Branding */}
      {(logoData.type === "text" || logoData.type === "both" || !logoData.imageUrl) && (
        <div className="flex flex-col justify-center min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-extrabold tracking-tight leading-none text-[#07626A] truncate ${
                size === "lg"
                  ? "text-2xl sm:text-[26px]"
                  : size === "sm"
                  ? "text-lg sm:text-xl"
                  : "text-xl sm:text-[22px]"
              }`}
              style={{
                fontFamily: "var(--font-nunito-sans), 'Nunito Sans', sans-serif",
              }}
            >
              {mainText}
            </span>
            {isAdmin && (
              <span className="px-1.5 py-0.5 rounded bg-[rgba(7,98,106,0.10)] text-[#07626A] text-[9px] font-extrabold uppercase">
                CMS
              </span>
            )}
          </div>

          {logoData.showSubtext && (
            <span
              className={`font-semibold tracking-wider uppercase truncate mt-0.5 ${
                isAdmin
                  ? "text-[9px] text-[#0D0D0D]/50"
                  : "text-[10px] text-[#0D0D0D]/60"
              }`}
            >
              {isAdmin ? "Панель управления" : subText}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (!isLink) {
    return content;
  }

  return (
    <Link href={href} className="inline-flex py-0.5">
      {content}
    </Link>
  );
};
