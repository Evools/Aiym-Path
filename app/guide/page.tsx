"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Compass } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { InnerPageBanner } from "@/components/ui/InnerPageBanner";

export default function GuidePage() {
  const { dict } = useLanguage();

  return (
    <div className="w-full bg-white min-h-screen">
      <InnerPageBanner
        breadcrumbLabel={dict.nav.guide}
        badge={dict.nav.guide}
        badgeIcon={<BookOpen className="w-3.5 h-3.5" />}
        titlePrefix="ПУТЕВОДИТЕЛЬ"
        titleHighlight="AIYM PATH"
        subtitle="Полезные советы, правила безопасности, рекомендации по экипировке и маршрутам для женщин-путешественниц в Кыргызстане."
      />

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
