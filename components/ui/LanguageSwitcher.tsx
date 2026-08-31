"use client";

import React, { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { useLanguage, Language } from "@/context/LanguageContext";

const LANGUAGES: { code: Language; label: string; shortLabel: string }[] = [
  { code: "ru", label: "Русский", shortLabel: "RU" },
  { code: "kg", label: "Кыргызча", shortLabel: "KG" },
  { code: "en", label: "English", shortLabel: "EN" },
];

export const LanguageSwitcher: React.FC<{ isScrolled?: boolean }> = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#0D0D0D] bg-white hover:bg-[#F0F2F2] border border-[#E1E1E1] hover:border-[#07626A] rounded-xl transition-colors cursor-pointer"
        aria-label="Выбрать язык"
      >
        <Globe className="w-3.5 h-3.5 text-[#07626A]" />
        <span className="tracking-wide uppercase">{current.shortLabel}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#0D0D0D]/50 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-white border border-[#E1E1E1] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 flex flex-col gap-0.5">
          {LANGUAGES.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-[rgba(7,98,106,0.10)] text-[#07626A] font-bold"
                    : "text-[#0D0D0D]/80 hover:bg-[#F0F2F2]"
                }`}
              >
                <span>{lang.label}</span>
                <span className="text-[10px] text-[#0D0D0D]/40 font-mono font-bold">
                  {lang.shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
