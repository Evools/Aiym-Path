"use client";

import React from "react";
import { Map } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { InnerPageBanner } from "@/components/ui/InnerPageBanner";
import { MapExplorerSection } from "@/components/features/map/MapExplorerSection";

export default function MapPage() {
  const { dict } = useLanguage();

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Top Banner */}
      <InnerPageBanner
        breadcrumbLabel={dict.nav.map}
        badge={dict.nav.map}
        badgeIcon={<Map className="w-3.5 h-3.5" />}
        titlePrefix="ИНТЕРАКТИВНАЯ КАРТА"
        titleHighlight="МАРШРУТОВ"
        subtitle="Пешие и треккинговые тропы, точки безопасности, проверенные отели и спасательные пункты в Кыргызстане."
      />

      {/* Map Explorer with Tabs, OSM Map, Legend and Route Cards */}
      <MapExplorerSection />
    </div>
  );
}
