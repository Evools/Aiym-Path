"use client";

import React from "react";
import { X, CheckCircle2, Phone, Share2 } from "lucide-react";
import { GuidebookItem } from "@/types/guidebook.types";
import { useLanguage } from "@/context/LanguageContext";

interface GuideDetailModalProps {
  item: GuidebookItem | null;
  onClose: () => void;
}

export const GuideDetailModal: React.FC<GuideDetailModalProps> = ({ item, onClose }) => {
  const { language, dict } = useLanguage();
  const [copied, setCopied] = React.useState(false);

  if (!item) return null;

  const title = item.title[language] || item.title.ru;
  const shortDesc = item.shortDescription[language] || item.shortDescription.ru;
  const details = item.details[language] || item.details.ru;
  const badge = item.badgeText ? item.badgeText[language] || item.badgeText.ru : null;

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}/guide#${item.id}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-8 z-10 my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="mb-6 pr-8">
          {badge && (
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-[#07626A] mb-3">
              {badge}
            </span>
          )}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
            {title}
          </h2>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            {shortDesc}
          </p>
        </div>

        {/* Detailed Points */}
        <div className="mb-8">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
            {language === "kg"
              ? "Негизги сунуштар жана эрежелер"
              : language === "en"
              ? "Key Guidelines & Rules"
              : "Ключевые рекомендации и правила"}
          </h4>

          <div className="space-y-3.5">
            {details.map((point, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100"
              >
                <div className="w-6 h-6 rounded-full bg-teal-100 text-[#07626A] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-5 border-t border-gray-100">
          {item.category === "emergency" ? (
            <a
              href="tel:112"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-xs transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>SOS: 112 (МЧС КР)</span>
            </a>
          ) : (
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>{dict.guidebook?.copied || "Скопировано"}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{language === "kg" ? "Бөлүшүү" : language === "en" ? "Share Guide" : "Поделиться"}</span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#07626A] text-white text-xs font-semibold hover:bg-[#054d53] transition-colors cursor-pointer"
          >
            {dict.guidebook?.close || "Закрыть"}
          </button>
        </div>
      </div>
    </div>
  );
};
