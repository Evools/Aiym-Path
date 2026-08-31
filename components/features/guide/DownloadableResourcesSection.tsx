"use client";

import React from "react";
import { FileText, Download, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const DownloadableResourcesSection: React.FC = () => {
  const { language } = useLanguage();

  const resources = [
    {
      id: "pdf-travelers",
      title: {
        ru: "Путеводитель для женщин-путешественниц",
        kg: "Саякатчы аялдар үчүн жол көрсөткүч",
        en: "Guidebook for Solo & Female Travelers",
      },
      description: {
        ru: "Полный справочник по безопасности, проверенным местам отдыха, подготовке к горам и культурным особенностям Кыргызстана.",
        kg: "Кыргызстандагы коопсуздук, текшерилген эс алуу жайлары, тоого даярдык жана маданий өзгөчөлүктөр боюнча толук колдонмо.",
        en: "Comprehensive manual covering safety, verified stays, mountain prep, and cultural insights across Kyrgyzstan.",
      },
      fileSize: "PDF • 2.4 MB",
      badge: {
        ru: "Для путешественниц",
        kg: "Саякатчылар үчүн",
        en: "For Travelers",
      },
    },
    {
      id: "pdf-guides",
      title: {
        ru: "Пособие для женщин-гидов",
        kg: "Аял-гиддер үчүн колдонмо",
        en: "Handbook for Female Mountain Guides",
      },
      description: {
        ru: "Стандарты ведения групп, протоколы первой помощи в высокогорье, этика общения и управление рисками на сложных треках.",
        kg: "Топторду жетектөө стандарттары, бийик тоодогу алгачкы медициналык жардам протоколдору жана тобокелдиктерди башкаруу.",
        en: "Group leadership standards, high-altitude first aid protocols, communication ethics, and mountain risk management.",
      },
      fileSize: "PDF • 3.1 MB",
      badge: {
        ru: "Для гидов",
        kg: "Гиддер үчүн",
        en: "For Mountain Guides",
      },
    },
    {
      id: "pdf-providers",
      title: {
        ru: "Пособие для поставщиков услуг",
        kg: "Кызмат көрсөтүүчүлөр үчүн колдонмо",
        en: "Manual for Tourism Service Providers",
      },
      description: {
        ru: "Руководство для гостевых домов, отелей, CBT и водителей по внедрению стандартов гендерной инклюзивности и безопасности Aiym Path.",
        kg: "Aiym Path гендердик инклюзивдүүлүк жана коопсуздук стандарттарын киргизүү боюнча конок үйлөр, мейманканалар жана айдоочулар үчүн колдонмо.",
        en: "Guidelines for guesthouses, CBT hosts, and drivers on adopting Aiym Path gender-inclusive safety standards.",
      },
      fileSize: "PDF • 1.9 MB",
      badge: {
        ru: "Для бизнеса и CBT",
        kg: "Бизнес жана CBT үчүн",
        en: "For Guesthouses & CBT",
      },
    },
  ];

  const handleDownload = (resId: string, title: string) => {
    // Generates download simulation / alert
    alert(`Скачивание документа «${title}» (PDF)`);
  };

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-[#E1E1E1]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="max-w-2xl mb-10">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[#07626A] text-xs font-semibold uppercase mb-3"
            style={{ backgroundColor: "rgba(7, 98, 106, 0.10)" }}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>
              {language === "kg"
                ? "Жүктөп алуучу материалдар"
                : language === "en"
                ? "Downloadable Materials"
                : "Материалы для скачивания"}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D0D0D] tracking-tight">
            {language === "kg"
              ? "Оффлайн колдонмолор жана эрежелер (PDF)"
              : language === "en"
              ? "Official PDF Manuals & Guidelines"
              : "Официальные пособия и путеводители (PDF)"}
          </h2>

          <p className="text-sm text-[#0D0D0D]/70 mt-2">
            {language === "kg"
              ? "Сапарга чыгуудан мурун телефонуңузга жүктөп алыңыз — алар тоодо интернет жок кезде да жеткиликтүү болот."
              : language === "en"
              ? "Download these verified PDF handbooks to your phone for offline access on remote mountain trails."
              : "Скачайте проверенные справочники на телефон для доступа в горах при отсутствии мобильного интернета."}
          </p>
        </div>

        {/* 3 PDF Resource Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resources.map((res) => {
            const title = res.title[language] || res.title.ru;
            const desc = res.description[language] || res.description.ru;
            const badge = res.badge[language] || res.badge.ru;

            return (
              <div
                key={res.id}
                className="p-6 rounded-3xl bg-[#FAFBFB] border border-[#E1E1E1] hover:border-[rgba(7,98,106,0.30)] transition-colors flex flex-col justify-between gap-5 shadow-2xs"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-[#07626A] shrink-0 border border-[rgba(7,98,106,0.15)]"
                      style={{ backgroundColor: "rgba(7, 98, 106, 0.08)" }}
                    >
                      <FileText className="w-5 h-5" />
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#07626A] bg-white px-2.5 py-1 rounded-full border border-[#E1E1E1]">
                      {badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#0D0D0D] leading-snug">
                      {title}
                    </h3>
                    <p className="text-xs text-[#0D0D0D]/70 leading-relaxed mt-2">
                      {desc}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E1E1E1] flex items-center justify-between gap-3">
                  <span className="text-[11px] font-mono text-[#0D0D0D]/50 font-medium">
                    {res.fileSize}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleDownload(res.id, title)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#07626A] text-white text-xs font-bold hover:bg-[#07626A]/90 transition-colors cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Скачать</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
