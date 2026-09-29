"use client";

import React, { useState, useEffect } from "react";
import { FileText, Download, ExternalLink } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  AdminStorageService,
  getGoogleDriveDirectDownloadLink,
} from "@/lib/services/admin-storage.service";
import { PdfResourceItem } from "@/types/guidebook.types";

export const DownloadableResourcesSection: React.FC = () => {
  const { language } = useLanguage();
  const [resources, setResources] = useState<PdfResourceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    AdminStorageService.getPdfResources()
      .then((data) => {
        if (isMounted) {
          setResources(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load PDF resources:", err);
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

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

        {/* PDF Resource Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-56 rounded-3xl bg-[#F0F2F2] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resources.map((res) => {
              const title = res.title[language] || res.title.ru;
              const desc = res.description[language] || res.description.ru;
              const badge = res.badge[language] || res.badge.ru;
              const downloadUrl = getGoogleDriveDirectDownloadLink(res.fileUrl);

              return (
                <div
                  key={res.id}
                  className="p-6 rounded-3xl bg-[#FAFBFB] border border-[#E1E1E1] hover:border-[rgba(7,98,106,0.30)] transition-colors flex flex-col justify-between gap-5"
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
                      <p className="text-xs text-[#0D0D0D]/70 leading-relaxed mt-2 line-clamp-3">
                        {desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E1E1E1] flex items-center justify-between gap-3">
                    <span className="text-[11px] font-mono text-[#0D0D0D]/50 font-medium">
                      {res.fileSize}
                    </span>

                    <a
                      href={downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#07626A] text-white text-xs font-bold hover:bg-[#07626A]/90 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>
                        {language === "kg"
                          ? "Жүктөө"
                          : language === "en"
                          ? "Download"
                          : "Скачать"}
                      </span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
