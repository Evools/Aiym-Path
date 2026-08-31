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
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-[#E1E1E1]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[#07626A] text-xs font-semibold uppercase mb-3"
              style={{ backgroundColor: "rgba(7, 98, 106, 0.10)" }}
            >
              <Backpack className="w-3.5 h-3.5" />
              <span>{dict.guidebook?.checklistTitle || "Чек-лист экипировки"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D0D0D] tracking-tight">
              {language === "kg"
                ? "Тоо сапарына керектүү буюмдар"
                : language === "en"
                ? "Essential Mountain Gear Checklist"
                : "Что взять с собой в горный треккинг"}
            </h2>
            <p className="text-sm text-[#0D0D0D]/75 mt-2 max-w-xl">
              {dict.guidebook?.checklistSubtitle ||
                "Отметьте вещи, которые вы уже собрали в рюкзак перед выходом в горы"}
            </p>
          </div>

          {/* Progress & Reset */}
          <div className="flex items-center gap-4 bg-white p-3.5 rounded-2xl border border-[#E1E1E1] self-start md:self-auto">
            <div className="text-left">
              <span className="text-xs text-[#0D0D0D]/70 font-medium block">
                {dict.guidebook?.checklistProgress || "Собрано"}: {current} / {total}
              </span>
              <div
                className="w-32 h-2 rounded-full overflow-hidden mt-1.5"
                style={{ backgroundColor: "rgba(7, 98, 106, 0.10)" }}
              >
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
                className="p-2 rounded-xl text-[#0D0D0D]/60 hover:text-[#0D0D0D] transition-colors cursor-pointer"
                style={{ backgroundColor: "rgba(7, 98, 106, 0.05)" }}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Checklist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
          {EQUIPMENT_CHECKLIST.map((item) => {
            const isChecked = checkedIds.includes(item.id);
            const label = item.label[language] || item.label.ru;
            const note = item.note ? item.note[language] || item.note.ru : null;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleItem(item.id)}
                className={`flex items-start gap-3.5 p-4 rounded-2xl text-left transition-colors duration-150 cursor-pointer border select-none ${
                  isChecked
                    ? "border-[#07626A]"
                    : "bg-white border-[#E1E1E1] hover:border-[#07626A]"
                }`}
                style={isChecked ? { backgroundColor: "rgba(7, 98, 106, 0.05)" } : undefined}
              >
                <div
                  className={`mt-0.5 shrink-0 transition-colors ${
                    isChecked ? "text-[#07626A]" : "text-[#0D0D0D]/30"
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
                          ? "line-through text-[#0D0D0D]/50"
                          : "text-[#0D0D0D]"
                      }`}
                    >
                      {label}
                    </span>
                  </div>

                  {note && (
                    <p
                      className={`text-xs mt-1 transition-colors ${
                        isChecked ? "text-[#0D0D0D]/40" : "text-[#0D0D0D]/70"
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
          <div
            className="mt-6 p-4 rounded-2xl border border-[#07626A] text-[#07626A] flex items-center gap-3 text-sm font-semibold"
            style={{ backgroundColor: "rgba(7, 98, 106, 0.10)" }}
          >
            <Sparkles className="w-5 h-5 shrink-0" />
            <span>{dict.guidebook?.checklistCompleted || "Отлично! Вы полностью готовы к безопасному походу."}</span>
          </div>
        )}
      </div>
    </section>
  );
};
