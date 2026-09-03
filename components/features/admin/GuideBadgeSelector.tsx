"use client";

import React, { useState } from "react";
import { Plus, X, Sparkles, Loader2, Check } from "lucide-react";
import { AdminGuideBadge } from "@/lib/services/admin-storage.service";
import {
  PRESET_GUIDE_BADGES,
  AVAILABLE_BADGE_ICONS,
  getBadgeIconComponent,
} from "@/lib/constants/guide-badges";
import { useToast } from "@/context/ToastContext";

interface GuideBadgeSelectorProps {
  selectedBadges: AdminGuideBadge[];
  onChange: (badges: AdminGuideBadge[]) => void;
}

export const GuideBadgeSelector: React.FC<GuideBadgeSelectorProps> = ({
  selectedBadges,
  onChange,
}) => {
  const toast = useToast();
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customIcon, setCustomIcon] = useState("Award");
  const [customRu, setCustomRu] = useState("");
  const [customKg, setCustomKg] = useState("");
  const [customEn, setCustomEn] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);

  // Toggle a preset badge
  const togglePresetBadge = (preset: typeof PRESET_GUIDE_BADGES[0]) => {
    const exists = selectedBadges.some((b) => b.id === preset.id);
    if (exists) {
      onChange(selectedBadges.filter((b) => b.id !== preset.id));
    } else {
      const newBadge: AdminGuideBadge = {
        id: preset.id,
        icon: preset.icon,
        label: { ...preset.label },
      };
      onChange([...selectedBadges, newBadge]);
    }
  };

  // Remove any badge
  const removeBadge = (id: string) => {
    onChange(selectedBadges.filter((b) => b.id !== id));
  };

  // Auto-translate custom badge
  const handleAutoTranslate = async () => {
    if (!customRu.trim()) {
      toast.warning("Введите название бейджа на русском");
      return;
    }

    setIsTranslating(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: customRu }),
      });
      const data = await res.json();
      if (data.success || data.en || data.kg) {
        setCustomKg(data.kg || customRu);
        setCustomEn(data.en || customRu);
        toast.success("Автоперевод выполнен");
      }
    } catch {
      toast.error("Не удалось выполнить автоперевод");
    } finally {
      setIsTranslating(false);
    }
  };

  // Save custom badge
  const handleSaveCustomBadge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRu.trim()) {
      toast.warning("Укажите название бейджа");
      return;
    }

    const newBadge: AdminGuideBadge = {
      id: `badge-${Date.now()}`,
      icon: customIcon,
      label: {
        ru: customRu.trim(),
        kg: customKg.trim() || customRu.trim(),
        en: customEn.trim() || customRu.trim(),
      },
    };

    onChange([...selectedBadges, newBadge]);
    setCustomRu("");
    setCustomKg("");
    setCustomEn("");
    setIsAddingCustom(false);
    toast.success("Новый бейдж компетенции добавлен");
  };

  return (
    <div className="space-y-4">
      {/* 1. Presets Grid */}
      <div>
        <label className="block text-xs font-bold text-[#0D0D0D] uppercase tracking-wider mb-2">
          Выберите компетенции, сертификаты и иконки
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {PRESET_GUIDE_BADGES.map((preset) => {
            const isSelected = selectedBadges.some((b) => b.id === preset.id);

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => togglePresetBadge(preset)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                  isSelected
                    ? "bg-[rgba(7,98,106,0.08)] border-[#07626A] text-[#07626A] font-bold ring-1 ring-[#07626A]/20"
                    : "bg-white border-[#E1E1E1] hover:border-[rgba(7,98,106,0.30)] text-[#0D0D0D]/80"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                      isSelected
                        ? "bg-[#07626A] text-white border-[#07626A]"
                        : "bg-[#F0F2F2] text-[#07626A] border-[#E1E1E1]"
                    }`}
                  >
                    {getBadgeIconComponent(preset.icon, "w-3.5 h-3.5")}
                  </div>
                  <span className="text-xs truncate">{preset.label.ru}</span>
                </div>

                {isSelected && (
                  <Check className="w-4 h-4 text-[#07626A] shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Active Selected Badges Pills */}
      {selectedBadges.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-[#F0F4F4] border border-[#E1E1E1]/80">
          <span className="block text-[11px] font-bold text-[#07626A] uppercase tracking-wider mb-2">
            Выбранные иконки в профиле ({selectedBadges.length}):
          </span>
          <div className="flex flex-wrap gap-2">
            {selectedBadges.map((badge) => (
              <div
                key={badge.id}
                className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-xl bg-white border border-[#07626A]/25 text-[#07626A] text-xs font-semibold shadow-2xs"
              >
                <span className="shrink-0">
                  {getBadgeIconComponent(badge.icon, "w-3.5 h-3.5 text-[#07626A]")}
                </span>
                <span>{badge.label.ru}</span>
                <button
                  type="button"
                  onClick={() => removeBadge(badge.id)}
                  className="p-1 rounded-lg hover:bg-rose-50 hover:text-rose-600 text-gray-400 transition-colors cursor-pointer ml-1"
                  title="Удалить"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Add Custom Badge Toggle & Form */}
      <div>
        {!isAddingCustom ? (
          <button
            type="button"
            onClick={() => setIsAddingCustom(true)}
            className="px-4 py-2.5 rounded-xl border border-dashed border-[#07626A]/40 bg-[#07626A]/5 hover:bg-[#07626A]/10 text-xs font-bold text-[#07626A] flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Добавить свой уникальный бейдж с иконкой</span>
          </button>
        ) : (
          <div className="p-4 rounded-2xl bg-[#FAFBFB] border border-[#E1E1E1] space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
                Создание собственного бейджа
              </span>
              <button
                type="button"
                onClick={() => setIsAddingCustom(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Icon Picker Grid */}
            <div>
              <span className="block text-[11px] font-bold text-[#0D0D0D]/60 uppercase tracking-wider mb-1.5">
                Выберите иконку:
              </span>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_BADGE_ICONS.map((ic) => {
                  const isCur = customIcon === ic.name;
                  return (
                    <button
                      key={ic.name}
                      type="button"
                      onClick={() => setCustomIcon(ic.name)}
                      className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                        isCur
                          ? "bg-[#07626A] text-white border-[#07626A] shadow-xs font-bold"
                          : "bg-white text-gray-700 border-[#E1E1E1] hover:border-[#07626A]"
                      }`}
                      title={ic.label}
                    >
                      {getBadgeIconComponent(ic.name, "w-3.5 h-3.5")}
                      <span className="text-[11px]">{ic.label.split(" / ")[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title Inputs with Auto-Translate */}
            <div className="space-y-2">
              <div>
                <label className="block text-[11px] font-bold text-[#0D0D0D]/60 uppercase tracking-wider mb-1">
                  Название на русском:
                </label>
                <input
                  type="text"
                  value={customRu}
                  onChange={(e) => setCustomRu(e.target.value)}
                  placeholder="Например: Инструктор по парапланеризму"
                  className="w-full h-10 px-3 text-xs rounded-xl border border-[#E1E1E1] bg-white text-[#0D0D0D] focus:border-[#07626A] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <input
                    type="text"
                    value={customKg}
                    onChange={(e) => setCustomKg(e.target.value)}
                    placeholder="Кыргызча"
                    className="w-full h-9 px-3 text-xs rounded-xl border border-[#E1E1E1] bg-white text-[#0D0D0D] focus:border-[#07626A] focus:outline-none"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={customEn}
                    onChange={(e) => setCustomEn(e.target.value)}
                    placeholder="English"
                    className="w-full h-9 px-3 text-xs rounded-xl border border-[#E1E1E1] bg-white text-[#0D0D0D] focus:border-[#07626A] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between gap-2 pt-2">
              <button
                type="button"
                onClick={handleAutoTranslate}
                disabled={isTranslating || !customRu.trim()}
                className="px-3 py-1.5 rounded-xl bg-white border border-[#E1E1E1] hover:border-[#07626A] text-xs font-bold text-[#07626A] transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                {isTranslating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>Автоперевод</span>
              </button>

              <button
                type="button"
                onClick={handleSaveCustomBadge}
                disabled={!customRu.trim()}
                className="px-4 py-1.5 rounded-xl bg-[#07626A] text-white text-xs font-bold hover:bg-[#07626A]/90 transition-colors cursor-pointer disabled:opacity-50"
              >
                Добавить бейдж
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
