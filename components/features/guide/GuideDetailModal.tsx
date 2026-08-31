"use client";

import React from "react";
import { X, CheckCircle2, Phone } from "lucide-react";
import { GuidebookItem } from "@/types/guidebook.types";
import { useLanguage } from "@/context/LanguageContext";

interface GuideDetailModalProps {
  item: GuidebookItem | null;
  onClose: () => void;
}

export const GuideDetailModal: React.FC<GuideDetailModalProps> = ({ item, onClose }) => {
  const { language, dict } = useLanguage();

  if (!item) return null;

  const title = item.title[language] || item.title.ru;
  const shortDesc = item.shortDescription[language] || item.shortDescription.ru;
  const details = item.details[language] || item.details.ru;
  const badge = item.badgeText ? item.badgeText[language] || item.badgeText.ru : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0D0D0D]/60 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-[#E1E1E1] p-6 sm:p-8 z-10 my-8 overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 w-9 h-9 rounded-xl text-[#07626A] flex items-center justify-center transition-colors cursor-pointer"
          style={{ backgroundColor: "rgba(7, 98, 106, 0.10)" }}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="mb-6 pr-8">
          {badge && (
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-[#07626A] mb-3"
              style={{ backgroundColor: "rgba(7, 98, 106, 0.10)" }}
            >
              {badge}
            </span>
          )}
          <h2 className="text-xl sm:text-2xl font-bold text-[#0D0D0D] leading-snug">
            {title}
          </h2>
          <p className="text-sm text-[#0D0D0D]/75 mt-2 leading-relaxed">
            {shortDesc}
          </p>
        </div>

        {/* Detailed Points */}
        <div className="mb-8">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#0D0D0D]/50 mb-4">
            {language === "kg"
              ? "Негизги сунуштар жана эрежелер"
              : language === "en"
              ? "Key Guidelines & Rules"
              : "Ключевые рекомендации и правила"}
          </h4>

          <div className="space-y-3">
            {details.map((point, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3.5 p-3.5 rounded-xl border border-[#E1E1E1]"
                style={{ backgroundColor: "rgba(7, 98, 106, 0.05)" }}
              >
                <div
                  className="w-6 h-6 rounded-lg text-[#07626A] flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: "rgba(7, 98, 106, 0.10)" }}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <p className="text-sm text-[#0D0D0D] leading-relaxed">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-5 border-t border-[#E1E1E1]">
          {item.category === "emergency" ? (
            <a
              href="tel:112"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#07626A] text-white text-xs font-semibold hover:bg-[#07626A]/90 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>SOS: 112</span>
            </a>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#07626A] text-white text-xs font-semibold hover:bg-[#07626A]/90 transition-colors cursor-pointer"
          >
            {dict.guidebook?.close || "Закрыть"}
          </button>
        </div>
      </div>
    </div>
  );
};
