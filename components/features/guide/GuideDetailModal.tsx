"use client";

import React, { useEffect } from "react";
import { X, ShieldCheck, CheckCircle2 } from "lucide-react";
import { GuidebookItem } from "@/types/guidebook.types";
import { useLanguage } from "@/context/LanguageContext";

interface GuideDetailModalProps {
  item: GuidebookItem | null;
  onClose: () => void;
}

export const GuideDetailModal: React.FC<GuideDetailModalProps> = ({ item, onClose }) => {
  const { language } = useLanguage();

  useEffect(() => {
    if (item) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        document.body.style.overflow = prevOverflow;
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [item, onClose]);

  if (!item) return null;

  const title = item.title[language] || item.title.ru;
  const description = item.shortDescription[language] || item.shortDescription.ru;
  const details = (item.details && item.details[language]) || item.details?.ru || [];
  const badgeText = item.badgeText ? (item.badgeText[language] || item.badgeText.ru) : null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-[#E1E1E1] shadow-2xl animate-in zoom-in-95 duration-150 my-auto flex flex-col gap-5 relative"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          title="Закрыть"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3.5 pr-8">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-[#07626A] shrink-0 border border-[rgba(7,98,106,0.15)]"
            style={{ backgroundColor: "rgba(7, 98, 106, 0.08)" }}
          >
            <ShieldCheck className="w-6 h-6" />
          </div>

          <div>
            {badgeText && (
              <span className="text-[10px] font-bold uppercase text-[#07626A] tracking-wider block mb-1">
                {badgeText}
              </span>
            )}
            <h2 className="text-lg sm:text-xl font-extrabold text-[#0D0D0D] leading-snug">
              {title}
            </h2>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-[#0D0D0D]/75 leading-relaxed">
          {description}
        </p>

        {/* Detailed Points */}
        {details.length > 0 && (
          <div className="space-y-2.5 pt-2 border-t border-gray-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0D0D0D]/60 block mb-2">
              Рекомендации и правила:
            </span>
            {details.map((detail, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-[13px] text-[#0D0D0D]/85">
                <CheckCircle2 className="w-4 h-4 text-[#07626A] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{detail}</span>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full mt-2 py-3 rounded-xl bg-[#07626A] hover:bg-[#07626A]/90 text-white text-xs font-bold transition-colors cursor-pointer"
        >
          Понятно
        </button>
      </div>
    </div>
  );
};
