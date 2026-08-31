"use client";

import React, { useState } from "react";
import { CheckSquare, Square, RotateCcw, Backpack, Sparkles } from "lucide-react";
import { EQUIPMENT_CHECKLIST } from "@/data/guidebook.data";
import { useLanguage } from "@/context/LanguageContext";

export const EquipmentChecklistSection: React.FC = () => {
  const { language, dict } = useLanguage();
  const [checkedIds, setCheckedIds] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleReset = () => {
    setCheckedIds([]);
  };

  const total = EQUIPMENT_CHECKLIST.length;
  const current = checkedIds.length;
  const percentage = Math.round((current / total) * 100);

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50/70 border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/70 text-[#07626A] text-xs font-semibold uppercase mb-3">
              <Backpack className="w-3.5 h-3.5" />
              <span>{dict.guidebook?.checklistTitle || "Чек-лист экипировки"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {language === "kg"
                ? "Тоо сапарына керектүү буюмдар"
                : language === "en"
                ? "Essential Mountain Gear Checklist"
                : "Что взять с собой в горный треккинг"}
            </h2>
            <p className="text-sm text-gray-600 mt-2 max-w-xl">
              {dict.guidebook?.checklistSubtitle ||
                "Отметьте вещи, которые вы уже собрали в рюкзак перед выходом в горы"}
            </p>
          </div>

          {/* Progress & Reset */}
          <div className="flex items-center gap-4 bg-white p-3.5 rounded-2xl border border-gray-200/80 shadow-2xs self-start md:self-auto">
            <div className="text-left">
              <span className="text-xs text-gray-500 font-medium block">
                {dict.guidebook?.checklistProgress || "Собрано"}: {current} / {total}
              </span>
              <div className="w-32 h-2 rounded-full bg-gray-100 overflow-hidden mt-1.5">
                <div
                  className="h-full bg-[#07626A] transition-all duration-300 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            {current > 0 && (
              <button
                type="button"
                onClick={handleReset}
                title={dict.guidebook?.checklistReset || "Сбросить"}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Checklist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
          {EQUIPMENT_CHECKLIST.map((item) => {
            const isChecked = checkedIds.includes(item.id);
            const label = item.label[language] || item.label.ru;
            const note = item.note ? item.note[language] || item.note.ru : null;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleItem(item.id)}
                className={`flex items-start gap-3.5 p-4 rounded-2xl text-left transition-all duration-200 cursor-pointer border select-none ${
                  isChecked
                    ? "bg-teal-50/50 border-teal-200/80 shadow-2xs"
                    : "bg-white border-gray-200/90 hover:border-teal-200 hover:shadow-2xs"
                }`}
              >
                <div
                  className={`mt-0.5 shrink-0 transition-colors ${
                    isChecked ? "text-[#07626A]" : "text-gray-300"
                  }`}
                >
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-semibold transition-colors ${
                        isChecked
                          ? "line-through text-gray-500"
                          : "text-gray-900"
                      }`}
                    >
                      {label}
                    </span>
                  </div>

                  {note && (
                    <p
                      className={`text-xs mt-1 transition-colors ${
                        isChecked ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {note}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {percentage === 100 && (
          <div className="mt-6 p-4 rounded-2xl bg-teal-50 border border-teal-200 text-[#07626A] flex items-center gap-3 text-sm font-semibold animate-in fade-in">
            <Sparkles className="w-5 h-5 shrink-0" />
            <span>{dict.guidebook?.checklistCompleted || "Отлично! Вы полностью готовы к безопасному походу."}</span>
          </div>
        )}
      </div>
    </section>
  );
};
