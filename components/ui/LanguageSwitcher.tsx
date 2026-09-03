"use client";

import React from "react";
import { useLanguage, Language } from "@/context/LanguageContext";

const LANGUAGES: { code: Language; label: string; shortLabel: string }[] = [
  { code: "ru", label: "Русский", shortLabel: "RU" },
  { code: "kg", label: "Кыргызча", shortLabel: "KG" },
  { code: "en", label: "English", shortLabel: "EN" },
];

export const LanguageSwitcher: React.FC<{ isScrolled?: boolean }> = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className="inline-flex items-center p-1 rounded-xl bg-[#F0F2F2] border border-[#E1E1E1] select-none"
      role="group"
      aria-label="Переключение языка"
    >
      {LANGUAGES.map((lang) => {
        const isSelected = lang.code === language;

        return (
          <button
            key={lang.code}
            type="button"
            onClick={() => setLanguage(lang.code)}
            title={lang.label}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold tracking-wider transition-all duration-150 cursor-pointer ${
              isSelected
                ? "bg-[#07626A] text-white shadow-2xs"
                : "text-[#0D0D0D]/65 hover:text-[#07626A] hover:bg-white/70"
            }`}
          >
            {lang.shortLabel}
          </button>
        );
      })}
    </div>
  );
};
