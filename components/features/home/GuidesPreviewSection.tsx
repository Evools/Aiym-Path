"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { AdminStorageService, AdminGuideItem } from "@/lib/services/admin-storage.service";
import { INITIAL_GUIDES, GuideItem } from "@/data/guides.data";
import { GuideCard } from "@/components/features/guide/GuideCard";

export const GuidesPreviewSection: React.FC = () => {
  const { dict } = useLanguage();
  const [guides, setGuides] = useState<(AdminGuideItem | GuideItem)[]>(INITIAL_GUIDES);

  useEffect(() => {
    async function loadGuides() {
      const dbGuides = await AdminStorageService.getGuides();
      if (dbGuides && dbGuides.length > 0) {
        setGuides(dbGuides);
      }
    }
    loadGuides();

    window.addEventListener("focus", loadGuides);
    return () => {
      window.removeEventListener("focus", loadGuides);
    };
  }, []);

  // Show first 3 guides on the homepage preview
  const previewGuides = guides.slice(0, 3);

  return (
    <section id="guides" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-[#E1E1E1]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header (Centered) */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          {/* Label: Наши люди */}
          <span
            className="block text-sm sm:text-[15px] font-bold uppercase tracking-wider mb-2"
            style={{ color: "#07626A" }}
          >
            {dict.guides.badge || "Наши люди"}
          </span>

          {/* Main Title: ГИДЫ ТУРАГЕНТЫ */}
          <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold text-[#0D0D0D] tracking-tight uppercase mb-3 leading-tight">
            <span>{dict.guides.titlePrefix} </span>
            <span style={{ color: "#07626A" }}>{dict.guides.titleHighlight}</span>
          </h2>

          {/* Subtitle */}
          <p className="text-[13.5px] sm:text-[15px] text-[#0D0D0D]/70 leading-relaxed max-w-2xl mx-auto font-normal">
            {dict.guides.subtitle}
          </p>
        </div>

        {/* 3 Guide Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {previewGuides.map((guide) => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
        </div>

        {/* Bottom CTA Button: Перейти ко всем гидам и турагентам -> /tours */}
        <div className="flex justify-center mt-12">
          <Link
            href="/tours"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all active:scale-[0.98]"
            style={{ backgroundColor: "#07626A" }}
          >
            <Users className="w-4 h-4" />
            <span>{dict.guides.viewAllList || "Посмотреть весь список"}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
