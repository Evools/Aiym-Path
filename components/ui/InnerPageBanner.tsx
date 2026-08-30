"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface InnerPageBannerProps {
  breadcrumbLabel: string;
  badge: string;
  badgeIcon?: React.ReactNode;
  titlePrefix: string;
  titleHighlight?: string;
  subtitle: string;
}

export const InnerPageBanner: React.FC<InnerPageBannerProps> = ({
  breadcrumbLabel,
  badge,
  badgeIcon,
  titlePrefix,
  titleHighlight,
  subtitle,
}) => {
  const { dict } = useLanguage();

  return (
    <section className="relative w-full bg-white pt-8 sm:pt-12 pb-20 sm:pb-24 lg:pb-28 overflow-hidden">
      {/* 1. Kyrgyz national ornament on the left (/images/banner/uzor.webp) */}
      <div className="absolute top-0 left-0 bottom-0 z-10 w-full max-w-[320px] sm:max-w-[440px] lg:max-w-[560px] pointer-events-none select-none overflow-hidden flex items-center justify-start">
        <div className="relative w-full h-full">
          <Image
            src="/images/banner/uzor.webp"
            alt="Кыргызский узор"
            fill
            priority
            sizes="(max-width: 768px) 320px, 560px"
            className="object-contain object-left opacity-90"
          />
        </div>
      </div>

      {/* 2. Main Content Container */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-500 hover:text-[#07626A] transition-colors mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{dict.nav.home}</span>
        </Link>

        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-[#07626A] text-xs font-semibold uppercase mb-4">
            {badgeIcon}
            <span>{badge}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-gray-900 tracking-tight uppercase leading-[1.15] mb-4">
            <span>{titlePrefix} </span>
            {titleHighlight && <span style={{ color: "#07626A" }}>{titleHighlight}</span>}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
            {subtitle}
          </p>
        </div>
      </div>

      {/* 3. Bottom Ragged Edge Effect (/images/banner/effect.webp) */}
      <div className="absolute -bottom-1 left-0 right-0 w-full h-14 sm:h-20 lg:h-24 z-30 pointer-events-none select-none">
        <div className="relative w-full h-full">
          <Image
            src="/images/banner/effect.webp"
            alt="Torn edge effect"
            fill
            priority
            sizes="100vw"
            className="w-full object-cover object-top"
          />
        </div>
      </div>
    </section>
  );
};
