"use client";

import React, { useState } from "react";
import { Sparkles, Loader2, Languages, Check } from "lucide-react";
import { useToast } from "@/context/ToastContext";

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
  const toast = useToast();
  const [activeLang, setActiveLang] = useState<"ru" | "kg" | "en">("ru");
  const [isTranslating, setIsTranslating] = useState(false);
  const [justTranslated, setJustTranslated] = useState(false);

  const handleChange = (text: string) => {
    onChange({
      ...value,
      [activeLang]: text,
    });
  };

  const handleAutoTranslate = async () => {
    const sourceText = value.ru?.trim();
    if (!sourceText) {
      toast.warning(
        "Сначала введите текст на русском языке для автоперевода",
        "Текст не найден"
      );
      return;
    }

    setIsTranslating(true);
    setJustTranslated(false);

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: sourceText, from: "ru" }),
      });

      if (!res.ok) throw new Error("Ошибка сервиса перевода");

      const data = await res.json();
      if (data.success) {
        onChange({
          ru: value.ru,
          kg: data.kg || value.kg || sourceText,
          en: data.en || value.en || sourceText,
        });
        setJustTranslated(true);
        toast.success(
          "Текст успешно переведен на Кыргызский (KG) и Английский (EN)",
          "Автоперевод готов"
        );
        setTimeout(() => setJustTranslated(false), 3000);
      }
    } catch {
      toast.error(
        "Не удалось выполнить автоперевод. Проверьте интернет-соединение.",
        "Ошибка перевода"
      );
    } finally {
      setIsTranslating(false);
    }
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
      {/* Label, Auto-Translate & Language Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
        </div>

        <div className="flex items-center gap-2">
          {/* Auto Translate Magic Button */}
          <button
            type="button"
            onClick={handleAutoTranslate}
            disabled={isTranslating || !value.ru?.trim()}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border disabled:opacity-40 disabled:cursor-not-allowed ${
              justTranslated
                ? "bg-emerald-50 text-emerald-700 border-emerald-300 shadow-2xs"
                : "bg-[rgba(7,98,106,0.08)] hover:bg-[#07626A] text-[#07626A] hover:text-white border-[rgba(7,98,106,0.20)] hover:border-[#07626A] shadow-2xs"
            }`}
            title="Автоматически перевести русский текст на Кыргызский (KG) и Английский (EN)"
          >
            {isTranslating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : justTranslated ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            )}
            <span>
              {isTranslating
                ? "Перевод..."
                : justTranslated
                ? "Переведено!"
                : "Автоперевод (KG • EN)"}
            </span>
          </button>

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
                          : "bg-emerald-500"
                        : "bg-[#0D0D0D]/20"
                    }`}
                    title={filled ? "Заполнено" : "Пусто"}
                  />
                </button>
              );
            })}
          </div>
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
