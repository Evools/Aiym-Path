"use client";

import React, { useState } from "react";

interface I18nFieldEditorProps {
  label: string;
  value: {
    ru: string;
    kg: string;
    en: string;
  };
  onChange: (value: { ru: string; kg: string; en: string }) => void;
  isTextarea?: boolean;
  rows?: number;
  placeholder?: {
    ru?: string;
    kg?: string;
    en?: string;
  };
  required?: boolean;
}

export const I18nFieldEditor: React.FC<I18nFieldEditorProps> = ({
  label,
  value,
  onChange,
  isTextarea = false,
  rows = 3,
  placeholder,
  required = false,
}) => {
  const [activeLang, setActiveLang] = useState<"ru" | "kg" | "en">("ru");

  const handleChange = (text: string) => {
    onChange({
      ...value,
      [activeLang]: text,
    });
  };

  const currentPlaceholder =
    placeholder?.[activeLang] ||
    (activeLang === "ru"
      ? "Введите текст на русском..."
      : activeLang === "kg"
      ? "Кыргызча текстти жазыңыз..."
      : "Enter English text...");

  const isFilled = {
    ru: Boolean(value.ru?.trim()),
    kg: Boolean(value.kg?.trim()),
    en: Boolean(value.en?.trim()),
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Label and Language Tabs */}
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>

        {/* 3-Language Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#F3F3F3] rounded-xl border border-[#E1E1E1]">
          {(["ru", "kg", "en"] as const).map((lang) => {
            const isActive = activeLang === lang;
            const filled = isFilled[lang];

            return (
              <button
                key={lang}
                type="button"
                onClick={() => setActiveLang(lang)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#07626A] text-white shadow-2xs"
                    : "text-[#0D0D0D]/70 hover:text-[#0D0D0D] hover:bg-white"
                }`}
              >
                <span>{lang.toUpperCase()}</span>
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    filled
                      ? isActive
                        ? "bg-white"
                        : "bg-[#07626A]"
                      : "bg-[#0D0D0D]/20"
                  }`}
                  title={filled ? "Заполнено" : "Пусто"}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Input or Textarea */}
      <div className="relative">
        {isTextarea ? (
          <textarea
            rows={rows}
            value={value[activeLang] || ""}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={currentPlaceholder}
            className="w-full p-3.5 rounded-xl border border-[#E1E1E1] bg-white hover:border-[rgba(7,98,106,0.25)] focus:border-[#07626A] text-xs sm:text-sm text-[#0D0D0D] placeholder-[#0D0D0D]/40 focus:outline-none transition-colors resize-y leading-relaxed font-normal"
          />
        ) : (
          <input
            type="text"
            value={value[activeLang] || ""}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={currentPlaceholder}
            className="w-full h-11 px-3.5 rounded-xl border border-[#E1E1E1] bg-white hover:border-[rgba(7,98,106,0.25)] focus:border-[#07626A] text-xs sm:text-sm text-[#0D0D0D] placeholder-[#0D0D0D]/40 focus:outline-none transition-colors font-medium"
          />
        )}

        <div className="absolute right-3 bottom-2 text-[10px] text-[#0D0D0D]/40 uppercase font-mono font-bold pointer-events-none">
          {activeLang}
        </div>
      </div>
    </div>
  );
};
