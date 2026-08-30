"use client";

import React from "react";
import { Map, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { InnerPageBanner } from "@/components/ui/InnerPageBanner";
import { ComingSoonSection } from "@/components/ui/ComingSoonSection";

export default function MapPage() {
  const { dict } = useLanguage();

  return (
    <div className="w-full bg-white min-h-screen">
      <InnerPageBanner
        breadcrumbLabel={dict.nav.map}
        badge={dict.nav.map}
        badgeIcon={<Map className="w-3.5 h-3.5" />}
        titlePrefix="ИНТЕРАКТИВНАЯ КАРТА"
        titleHighlight="МАРШРУТОВ"
        subtitle="Пешие и треккинговые тропы, точки безопасности, проверенные отели и спасательные пункты в Кыргызстане."
      />

      <ComingSoonSection
        icon={<MapPin className="w-8 h-8" />}
        title="Раздел интерактивной карты в разработке"
        description="Здесь будет доступна интерактивная карта с GeoJSON/GPX треками, перепадами высот, безопасными хабами и проверенными локациями для путешественниц."
        ctaText="Посмотреть гидов и экскурсии"
        ctaHref="/tours"
      />
    </div>
  );
}
