"use client";

import React, { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
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
      {/* Trigger Button: Clean white capsule */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-150 cursor-pointer border ${
          isOpen
            ? "bg-[rgba(7,98,106,0.08)] border-[#07626A] text-[#07626A]"
            : "bg-white hover:bg-[rgba(7,98,106,0.04)] text-[#0D0D0D] border-[#E1E1E1] hover:border-[rgba(7,98,106,0.30)]"
        }`}
        aria-label="Выбрать язык"
      >
        <Globe className="w-3.5 h-3.5 text-[#07626A]" />
        <span className="tracking-wider uppercase font-extrabold text-[11px]">
          {current.shortLabel}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#0D0D0D]/50 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#07626A]" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 p-1.5 rounded-2xl bg-white border border-[#E1E1E1] shadow-lg z-50 animate-in fade-in zoom-in-95 duration-150 flex flex-col gap-0.5">
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
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-[rgba(7,98,106,0.08)] text-[#07626A] font-bold border border-[rgba(7,98,106,0.15)]"
                    : "text-[#0D0D0D]/80 hover:bg-[rgba(7,98,106,0.05)] hover:text-[#07626A] border border-transparent"
                }`}
              >
                <span className="font-semibold">{lang.label}</span>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                      isSelected
                        ? "bg-[#07626A] text-white"
                        : "bg-[#F0F2F2] text-[#0D0D0D]/60"
                    }`}
                  >
                    {lang.shortLabel}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#07626A]" />}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
