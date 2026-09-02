"use client";

import React, { useState } from "react";
import { Sparkles, Loader2, Check, ArrowRight, Eye, LayoutGrid } from "lucide-react";
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
  const [showAllLangs, setShowAllLangs] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [lastTranslatedPreview, setLastTranslatedPreview] = useState<{
    kg: string;
    en: string;
  } | null>(null);

  const handleLangChange = (lang: "ru" | "kg" | "en", text: string) => {
    onChange({
      ...value,
      [lang]: text,
    });
  };

  const handleAutoTranslate = async () => {
    const sourceText = value.ru?.trim();
    if (!sourceText) {
      toast.warning(
        "Сначала введите текст на русском языке (RU) для перевода",
        "Текст не найден"
      );
      return;
    }

    setIsTranslating(true);
    setLastTranslatedPreview(null);

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: sourceText, from: "ru" }),
      });

      if (!res.ok) throw new Error("Ошибка сервиса перевода");

      const data = await res.json();
      if (data.success) {
        const newKg = data.kg || value.kg || sourceText;
        const newEn = data.en || value.en || sourceText;

        onChange({
          ru: value.ru,
          kg: newKg,
          en: newEn,
        });

        setLastTranslatedPreview({ kg: newKg, en: newEn });

        toast.success(
          `Кыргызча: «${newKg.slice(0, 35)}${newKg.length > 35 ? "..." : ""}» • English: «${newEn.slice(0, 35)}${newEn.length > 35 ? "..." : ""}»`,
          "Переведено на KG и EN"
        );
      } else {
        throw new Error(data.error || "Не удалось получить перевод");
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

  const isFilled = {
    ru: Boolean(value.ru?.trim()),
    kg: Boolean(value.kg?.trim()),
    en: Boolean(value.en?.trim()),
  };

  const getPlaceholder = (lang: "ru" | "kg" | "en") =>
    placeholder?.[lang] ||
    (lang === "ru"
      ? "Введите текст на русском..."
      : lang === "kg"
      ? "Кыргызча текстти жазыңыз..."
      : "Enter text in English...");

  return (
    <div className="flex flex-col gap-2.5 p-4 rounded-2xl bg-[#FAFAFA] border border-[#E1E1E1]">
      {/* Header: Label, Auto-Translate Button & Display Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <label className="text-xs font-extrabold text-[#0D0D0D] uppercase tracking-wider">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Fast Auto-Translate Magic Button */}
          <button
            type="button"
            onClick={handleAutoTranslate}
            disabled={isTranslating || !value.ru?.trim()}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs ${
              isTranslating
                ? "bg-[#07626A]/10 text-[#07626A] border-[#07626A]/30"
                : lastTranslatedPreview
                ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                : "bg-white hover:bg-[#07626A] text-[#07626A] hover:text-white border-[#E1E1E1] hover:border-[#07626A]"
            }`}
            title="Автоматически перевести текст из поля RU на Кыргызский (KG) и Английский (EN)"
          >
            {isTranslating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#07626A]" />
                <span>Переводим на KG и EN...</span>
              </>
            ) : lastTranslatedPreview ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Переведено! (Обновить)</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Автоперевод (KG • EN)</span>
              </>
            )}
          </button>

          {/* Toggle "Все 3 языка" / "Вкладки" */}
          <button
            type="button"
            onClick={() => setShowAllLangs((prev) => !prev)}
            className="p-1.5 rounded-xl bg-white border border-[#E1E1E1] hover:border-[#07626A] text-[#0D0D0D]/70 hover:text-[#07626A] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            title={showAllLangs ? "Переключить на вкладки" : "Показать все 3 языка одновременно"}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {showAllLangs ? "Вкладки" : "Все 3 языка"}
            </span>
          </button>

          {/* 3-Language Tabs (Visible only if not in "All Languages" mode) */}
          {!showAllLangs && (
            <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-[#E1E1E1]">
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
                        : "text-[#0D0D0D]/70 hover:text-[#0D0D0D] hover:bg-[#F3F3F3]"
                    }`}
                  >
                    <span>{lang.toUpperCase()}</span>
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        filled
                          ? isActive
                            ? "bg-white"
                            : "bg-emerald-500"
                          : "bg-[#0D0D0D]/25"
                      }`}
                      title={filled ? "Поле заполнено" : "Поле пустое"}
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Editor Body: Single Tab View OR All 3 Languages View */}
      {showAllLangs ? (
        /* All 3 Languages Mode */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(["ru", "kg", "en"] as const).map((lang) => {
            const langLabels = {
              ru: "🇷🇺 Русский (RU)",
              kg: "🇰🇬 Кыргызча (KG)",
              en: "🇬🇧 English (EN)",
            };

            return (
              <div key={lang} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#0D0D0D]/75">
                    {langLabels[lang]}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-md ${
                      isFilled[lang]
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {isFilled[lang] ? "Заполнено" : "Пусто"}
                  </span>
                </div>

                {isTextarea ? (
                  <textarea
                    rows={rows}
                    value={value[lang] || ""}
                    onChange={(e) => handleLangChange(lang, e.target.value)}
                    placeholder={getPlaceholder(lang)}
                    className="w-full p-3 rounded-xl border border-[#E1E1E1] bg-white hover:border-[#07626A]/30 focus:border-[#07626A] text-xs text-[#0D0D0D] placeholder-[#0D0D0D]/35 focus:outline-none transition-colors resize-y leading-relaxed font-normal"
                  />
                ) : (
                  <input
                    type="text"
                    value={value[lang] || ""}
                    onChange={(e) => handleLangChange(lang, e.target.value)}
                    placeholder={getPlaceholder(lang)}
                    className="w-full h-10 px-3 rounded-xl border border-[#E1E1E1] bg-white hover:border-[#07626A]/30 focus:border-[#07626A] text-xs text-[#0D0D0D] placeholder-[#0D0D0D]/35 focus:outline-none transition-colors font-medium"
                  />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Single Tab Mode */
        <div className="relative">
          {isTextarea ? (
            <textarea
              rows={rows}
              value={value[activeLang] || ""}
              onChange={(e) => handleLangChange(activeLang, e.target.value)}
              placeholder={getPlaceholder(activeLang)}
              className="w-full p-3.5 rounded-xl border border-[#E1E1E1] bg-white hover:border-[#07626A]/30 focus:border-[#07626A] text-xs sm:text-sm text-[#0D0D0D] placeholder-[#0D0D0D]/40 focus:outline-none transition-colors resize-y leading-relaxed font-normal"
            />
          ) : (
            <input
              type="text"
              value={value[activeLang] || ""}
              onChange={(e) => handleLangChange(activeLang, e.target.value)}
              placeholder={getPlaceholder(activeLang)}
              className="w-full h-11 px-3.5 rounded-xl border border-[#E1E1E1] bg-white hover:border-[#07626A]/30 focus:border-[#07626A] text-xs sm:text-sm text-[#0D0D0D] placeholder-[#0D0D0D]/40 focus:outline-none transition-colors font-medium"
            />
          )}

          <div className="absolute right-3 bottom-2 text-[10px] text-[#0D0D0D]/40 uppercase font-mono font-bold pointer-events-none">
            {activeLang}
          </div>
        </div>
      )}

      {/* Visual Live Translation Chips / Result Feedback */}
      {(!showAllLangs && (value.kg?.trim() || value.en?.trim())) && (
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#E1E1E1]/80 text-xs">
          <span className="text-[11px] font-semibold text-[#0D0D0D]/60 flex items-center gap-1">
            <Eye className="w-3 h-3 text-[#07626A]" />
            <span>Переводы:</span>
          </span>

          {value.kg?.trim() && (
            <button
              type="button"
              onClick={() => setActiveLang("kg")}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer max-w-[240px] truncate ${
                activeLang === "kg"
                  ? "bg-[#07626A] text-white border-[#07626A]"
                  : "bg-white text-[#0D0D0D]/80 border-[#E1E1E1] hover:border-[#07626A]"
              }`}
              title="Перейти к редактированию на кыргызском"
            >
              <span className="font-bold">KG:</span>
              <span className="truncate">{value.kg}</span>
              <ArrowRight className="w-3 h-3 shrink-0 opacity-70" />
            </button>
          )}

          {value.en?.trim() && (
            <button
              type="button"
              onClick={() => setActiveLang("en")}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer max-w-[240px] truncate ${
                activeLang === "en"
                  ? "bg-[#07626A] text-white border-[#07626A]"
                  : "bg-white text-[#0D0D0D]/80 border-[#E1E1E1] hover:border-[#07626A]"
              }`}
              title="Перейти к редактированию на английском"
            >
              <span className="font-bold">EN:</span>
              <span className="truncate">{value.en}</span>
              <ArrowRight className="w-3 h-3 shrink-0 opacity-70" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
