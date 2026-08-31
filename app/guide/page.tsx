"use client";

import React from "react";
import { BookOpen } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { InnerPageBanner } from "@/components/ui/InnerPageBanner";
import { GuidebookSection } from "@/components/features/guide/GuidebookSection";
import { DosAndDontsSection } from "@/components/features/guide/DosAndDontsSection";
import { EquipmentChecklistSection } from "@/components/features/guide/EquipmentChecklistSection";
import { DownloadableResourcesSection } from "@/components/features/guide/DownloadableResourcesSection";
import { EmergencySafetyBanner } from "@/components/features/guide/EmergencySafetyBanner";

export default function GuidePage() {
  const { dict } = useLanguage();

  return (
    <div className="w-full bg-white min-h-screen">
      {/* 1. Top Banner */}
      <InnerPageBanner
        badge={dict.guidebook?.badge || dict.nav.guide}
        badgeIcon={<BookOpen className="w-3.5 h-3.5" />}
        titlePrefix={dict.guidebook?.titlePrefix || "ПУТЕВОДИТЕЛЬ"}
        titleHighlight={dict.guidebook?.titleHighlight || "AIYM PATH"}
        subtitle={
          dict.guidebook?.subtitle ||
          "Полезные советы, правила безопасности, рекомендации по экипировке и маршрутам для женщин-путешественниц в Кыргызстане."
        }
      />

      {/* 2. Main Guidebook Section with Audience Tabs & Recommendations Grid */}
      <GuidebookSection />

      {/* 3. Official Do's and Don'ts (Приложение A ТЗ) */}
      <DosAndDontsSection />

      {/* 4. Interactive Mountain Equipment Checklist */}
      <EquipmentChecklistSection />

      {/* 5. Downloadable Official PDF Guides (Приложение B ТЗ) */}
      <DownloadableResourcesSection />

      {/* 6. Emergency Contacts & Safety Hotlines (Приложение B ТЗ) */}
      <EmergencySafetyBanner />
    </div>
  );
}
