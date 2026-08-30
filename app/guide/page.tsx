"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpen, Compass, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function GuidePage() {
  const { dict } = useLanguage();

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Banner */}
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

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-500 hover:text-[#07626A] transition-colors mb-6 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{dict.nav.home}</span>
          </Link>

          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-[#07626A] text-xs font-semibold uppercase mb-4">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{dict.nav.guide}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-gray-900 tracking-tight uppercase leading-[1.15] mb-4">
              <span>ПУТЕВОДИТЕЛЬ </span>
              <span style={{ color: "#07626A" }}>AIYM PATH</span>
            </h1>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
              Полезные советы, правила безопасности, рекомендации по экипировке и маршрутам для женщин-путешественниц в Кыргызстане.
            </p>
          </div>
        </div>
      </section>

      {/* Guide Content Placeholder / Coming Soon */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-[#07626A] flex items-center justify-center mx-auto mb-5 border border-teal-100/80 shadow-xs">
            <Compass className="w-8 h-8" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            Раздел путеводителя в разработке
          </h2>

          <p className="text-sm text-gray-500 leading-relaxed max-w-lg mx-auto mb-8">
            Здесь будут опубликованы подробные инструкции по безопасности, гайды по локациям, чек-листы и советы от опытных путешественниц.
          </p>

          <Link
            href="/tours"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-semibold shadow-xs hover:shadow-md transition-all active:scale-[0.98]"
            style={{ backgroundColor: "#07626A" }}
          >
            <span>Посмотреть гидов и экскурсии</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
