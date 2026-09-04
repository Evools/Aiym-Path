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

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Dropdown Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer border ${
          isOpen
            ? "bg-[rgba(7,98,106,0.10)] border-[#07626A] text-[#07626A]"
            : "bg-[#F0F2F2] hover:bg-[#E5EAEB] text-[#0D0D0D] border-[#E1E1E1] hover:border-[rgba(7,98,106,0.30)]"
        }`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Выбрать язык"
      >
        <Globe className="w-3.5 h-3.5 text-[#07626A] shrink-0" />
        <span className="tracking-wider uppercase font-extrabold text-xs">
          {current.shortLabel}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#0D0D0D]/50 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-[#07626A]" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute right-0 mt-2 w-44 p-1.5 rounded-2xl bg-white border border-[#E1E1E1] shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150 flex flex-col gap-0.5"
        >
          {LANGUAGES.map((lang) => {
            const isSelected = lang.code === language;

            return (
              <button
                key={lang.code}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-[rgba(7,98,106,0.10)] text-[#07626A] font-bold"
                    : "text-[#0D0D0D]/80 hover:bg-[#F0F2F2] hover:text-[#07626A]"
                }`}
              >
                <span className="font-bold">{lang.label}</span>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded-md ${
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
