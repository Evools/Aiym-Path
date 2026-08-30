"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Sparkles, Compass } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const GuideHeroBanner: React.FC = () => {
  const { dict } = useLanguage();

  return (
    <section className="relative w-full bg-white pt-8 sm:pt-12 pb-16 sm:pb-20 overflow-hidden border-b border-gray-100">
      {/* Kyrgyz national ornament on the left */}
      <div className="absolute top-0 left-0 bottom-0 z-0 w-full max-w-[280px] sm:max-w-[380px] lg:max-w-[480px] pointer-events-none select-none overflow-hidden flex items-center justify-start opacity-70">
        <div className="relative w-full h-full">
          <Image
            src="/images/banner/uzor.webp"
            alt="Кыргызский узор"
            fill
            priority
            className="object-contain object-left"
          />
        </div>
      </div>

      {/* Main Banner Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link / Breadcrumb */}
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
            <Compass className="w-3.5 h-3.5" />
            <span>{dict.guides.badge}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-gray-900 tracking-tight uppercase leading-[1.15] mb-4">
            <span>{dict.guides.titlePrefix} </span>
            <span style={{ color: "#07626A" }}>{dict.guides.titleHighlight}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
            {dict.guides.subtitle}
          </p>
        </div>
      </div>

      {/* Bottom Ragged Edge Effect */}
      <div className="absolute -bottom-1 left-0 right-0 w-full h-12 sm:h-16 lg:h-20 z-10 pointer-events-none select-none">
        <div className="relative w-full h-full">
          <Image
            src="/images/banner/effect.webp"
            alt="Edge effect"
            fill
            priority
            className="object-cover object-bottom"
          />
        </div>
      </div>
    </section>
  );
};
