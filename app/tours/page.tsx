"use client";

import React from "react";
import { Compass } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { InnerPageBanner } from "@/components/ui/InnerPageBanner";
import { ToursGuideListSection } from "@/components/features/tours/ToursGuideListSection";

export default function ToursPage() {
  const { dict } = useLanguage();

  return (
    <div className="w-full bg-white min-h-screen">
      <InnerPageBanner
        breadcrumbLabel={dict.nav.tours}
        badge={dict.nav.tours}
        badgeIcon={<Compass className="w-3.5 h-3.5" />}
        titlePrefix={dict.guides.titlePrefix}
        titleHighlight={dict.guides.titleHighlight}
        subtitle={dict.guides.subtitle}
      />
      <ToursGuideListSection />
    </div>
  );
}

