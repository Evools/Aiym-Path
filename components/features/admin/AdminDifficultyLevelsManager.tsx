"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Edit2,
  Clock,
  MapPin,
  CheckCircle2,
  X,
  Footprints,
  Compass,
  Mountain,
  AlertTriangle,
} from "lucide-react";
import { AdminStorageService } from "@/lib/services/admin-storage.service";
import { DifficultyLevelGuide } from "@/types/guidebook.types";
import { useToast } from "@/context/ToastContext";
import { I18nFieldEditor } from "@/components/features/admin/I18nFieldEditor";

export const AdminDifficultyLevelsManager: React.FC = () => {
  const toast = useToast();
  const [items, setItems] = useState<DifficultyLevelGuide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DifficultyLevelGuide | null>(null);

  const [formData, setFormData] = useState<{
    id: "easy" | "medium" | "hard" | "expert";
    badge: { ru: string; kg: string; en: string };
    title: { ru: string; kg: string; en: string };
    duration: { ru: string; kg: string; en: string };
    elevation: { ru: string; kg: string; en: string };
    description: { ru: string; kg: string; en: string };
    suitableFor: { ru: string; kg: string; en: string };
    requiredGear: { ru: string; kg: string; en: string };
  }>({
    id: "easy",
    badge: { ru: "", kg: "", en: "" },
    title: { ru: "", kg: "", en: "" },
    duration: { ru: "", kg: "", en: "" },
    elevation: { ru: "", kg: "", en: "" },
    description: { ru: "", kg: "", en: "" },
    suitableFor: { ru: "", kg: "", en: "" },
    requiredGear: { ru: "", kg: "", en: "" },
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await AdminStorageService.getDifficultyLevels();
      setItems(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenEdit = (item: DifficultyLevelGuide) => {
    setEditingItem(item);
    setFormData({
      id: item.id,
      badge: { ...item.badge },
      title: { ...item.title },
      duration: { ...item.duration },
      elevation: { ...item.elevation },
      description: { ...item.description },
      suitableFor: { ...item.suitableFor },
      requiredGear: {
        ru: (item.requiredGear?.ru || []).join("\n"),
        kg: (item.requiredGear?.kg || []).join("\n"),
        en: (item.requiredGear?.en || []).join("\n"),
      },
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.ru.trim()) {
      toast.error("Пожалуйста, заполните название уровня сложности на русском языке");
      return;
    }

    const itemToSave: DifficultyLevelGuide = {
      id: formData.id,
      badge: {
        ru: formData.badge.ru || "Уровень сложности",
        kg: formData.badge.kg || formData.badge.ru || "Татаалдык деңгээли",
        en: formData.badge.en || formData.badge.ru || "Difficulty Level",
      },
      title: {
        ru: formData.title.ru,
        kg: formData.title.kg || formData.title.ru,
        en: formData.title.en || formData.title.ru,
      },
      duration: {
        ru: formData.duration.ru,
        kg: formData.duration.kg || formData.duration.ru,
        en: formData.duration.en || formData.duration.ru,
      },
      elevation: {
        ru: formData.elevation.ru,
        kg: formData.elevation.kg || formData.elevation.ru,
        en: formData.elevation.en || formData.elevation.ru,
      },
      description: {
        ru: formData.description.ru,
        kg: formData.description.kg || formData.description.ru,
        en: formData.description.en || formData.description.ru,
      },
      suitableFor: {
        ru: formData.suitableFor.ru,
        kg: formData.suitableFor.kg || formData.suitableFor.ru,
        en: formData.suitableFor.en || formData.suitableFor.ru,
      },
      requiredGear: {
        ru: formData.requiredGear.ru
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        kg: (formData.requiredGear.kg || formData.requiredGear.ru)
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        en: (formData.requiredGear.en || formData.requiredGear.ru)
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
      },
    };

    const ok = await AdminStorageService.saveDifficultyLevel(itemToSave);
    if (ok) {
      toast.success("Информация об уровне сложности успешно сохранена");
      setIsModalOpen(false);
      await loadData();
    } else {
      toast.error("Не удалось сохранить данные");
    }
  };

  const levelIcons: Record<string, React.ReactNode> = {
    easy: <Footprints className="w-5 h-5 text-[#07626A]" />,
    medium: <Compass className="w-5 h-5 text-[#07626A]" />,
    hard: <TrendingUp className="w-5 h-5 text-[#07626A]" />,
    expert: <Mountain className="w-5 h-5 text-[#07626A]" />,
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-150">
      {/* Top Description Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#F0F2F2] border border-[#E1E1E1]">
        <div>
          <h2 className="text-sm sm:text-base font-extrabold text-[#0D0D0D]">
            Классификация уровней сложности и подготовка
          </h2>
          <p className="text-xs text-[#0D0D0D]/70 mt-0.5">
            Управляйте описаниями, требованиями к перепаду высот, необходимому снаряжению и примерами локаций для каждого уровня.
          </p>
        </div>
      </div>

      {/* Grid of Difficulty Level Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-6 rounded-3xl bg-white border border-[#E1E1E1] h-48 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {items.map((level) => (
            <div
              key={level.id}
              className="p-6 rounded-3xl bg-white border border-[#E1E1E1] hover:border-[#07626A]/40 transition-colors flex flex-col justify-between gap-5"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#E1E1E1]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#F0F2F2] flex items-center justify-center shrink-0 border border-[#E1E1E1]">
                      {levelIcons[level.id] || <TrendingUp className="w-5 h-5 text-[#07626A]" />}
                    </div>
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#07626A] block">
                        {level.badge?.ru}
                      </span>
                      <h3 className="text-base font-bold text-[#0D0D0D] leading-snug">
                        {level.title?.ru}
                      </h3>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(level)}
                    className="p-2 rounded-xl border border-[#E1E1E1] bg-[#F0F2F2] hover:bg-white hover:border-[#07626A] text-[#07626A] transition-colors cursor-pointer shrink-0"
                    title="Редактировать уровень"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FAFBFB] border border-[#E1E1E1] text-[#0D0D0D]/80 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#07626A]" />
                    <span>{level.duration?.ru}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FAFBFB] border border-[#E1E1E1] text-[#0D0D0D]/80 font-medium">
                    <TrendingUp className="w-3.5 h-3.5 text-[#07626A]" />
                    <span>{level.elevation?.ru}</span>
                  </span>
                </div>

                <p className="text-xs text-[#0D0D0D]/75 leading-relaxed">
                  {level.description?.ru}
                </p>

                {level.suitableFor?.ru && (
                  <div className="p-3 rounded-xl bg-[#FAFBFB] border border-[#E1E1E1] text-xs text-[#0D0D0D]/80 flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#07626A] shrink-0 mt-0.5" />
                    <span>
                      <strong className="font-semibold text-[#0D0D0D]">Локации: </strong>
                      {level.suitableFor.ru}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#E1E1E1] flex items-center justify-between text-xs text-[#0D0D0D]/60 font-medium">
                <span>Обязательное снаряжение:</span>
                <span className="font-bold text-[#07626A]">
                  {(level.requiredGear?.ru || []).length} предм.
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-2xl w-full border border-[#E1E1E1] my-auto flex flex-col max-h-[92vh] overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#E1E1E1] bg-[#FAFBFB]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F0F2F2] flex items-center justify-center text-[#07626A] border border-[#E1E1E1]">
                  {levelIcons[formData.id] || <TrendingUp className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0D0D0D]">
                    Редактирование уровня: {formData.badge.ru || formData.id}
                  </h3>
                  <span className="text-[11px] text-[#0D0D0D]/50">
                    ID: {formData.id} • Мультиязычный контент
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-[#0D0D0D]/60 hover:text-[#0D0D0D] hover:bg-[#F0F2F2] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6 flex-1">
              <I18nFieldEditor
                label="Бейдж / Название уровня"
                value={formData.badge}
                onChange={(badge) => setFormData({ ...formData, badge })}
                placeholder={{
                  ru: "Легкий уровень",
                  kg: "Жеңил деңгээл",
                  en: "Easy Trail",
                }}
                required
              />

              <I18nFieldEditor
                label="Главный заголовок уровня"
                value={formData.title}
                onChange={(title) => setFormData({ ...formData, title })}
                placeholder={{
                  ru: "Прогулочные и однодневные маршруты",
                  kg: "Сейилдөө жана 1 күндүк маршруттар",
                  en: "Walking & Day Nature Trips",
                }}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <I18nFieldEditor
                  label="Длительность маршрута"
                  value={formData.duration}
                  onChange={(duration) => setFormData({ ...formData, duration })}
                  placeholder={{
                    ru: "1–4 часа (до 6 км)",
                    kg: "1–4 саат (6 км чейин)",
                    en: "1–4 hours (up to 6 km)",
                  }}
                  required
                />

                <I18nFieldEditor
                  label="Перепад высот"
                  value={formData.elevation}
                  onChange={(elevation) => setFormData({ ...formData, elevation })}
                  placeholder={{
                    ru: "Перепад высот: до 300 м",
                    kg: "Бийиктик айырмасы: 300 м чейин",
                    en: "Elevation gain: up to 300 m",
                  }}
                  required
                />
              </div>

              <I18nFieldEditor
                label="Описание уровня и требования"
                value={formData.description}
                onChange={(description) => setFormData({ ...formData, description })}
                isTextarea={true}
                rows={3}
                placeholder={{
                  ru: "Оборудованные тропы с плавным набором высоты. Подходит новичкам...",
                  kg: "Жакшы чыйырлар, кескин эмес бийиктик...",
                  en: "Well-marked gentle trails. Ideal for beginners...",
                }}
                required
              />

              <I18nFieldEditor
                label="Примеры подходящих локаций"
                value={formData.suitableFor}
                onChange={(suitableFor) => setFormData({ ...formData, suitableFor })}
                placeholder={{
                  ru: "Чункурчак, Теплые Ключи (Аламедин), каньон «Сказка»",
                  kg: "Чүңкүрчак, Жылуу Булактар (Аламүдүн), «Жомок» каньону",
                  en: "Chunkurchak, Teplye Klyuchi (Alamedin), Skazka Canyon",
                }}
              />

              <I18nFieldEditor
                label="Обязательное снаряжение (каждый пункт с новой строки)"
                value={formData.requiredGear}
                onChange={(requiredGear) => setFormData({ ...formData, requiredGear })}
                isTextarea={true}
                rows={4}
                placeholder={{
                  ru: "Удобные кроссовки с подошвой\nВетровка / легкая кофта\nБутылка воды 1.5 л\nКрем SPF 50+",
                  kg: "Тайгаланбаган ыңгайлуу кроссовка\nЖеңил куртка\n1.5 л суу\nSPF 50+ крем",
                  en: "Comfortable traction sneakers\nWindbreaker\n1.5L water bottle\nSPF 50+ sunscreen",
                }}
              />

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E1E1E1]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E1E1E1] text-[#0D0D0D]/70 text-xs font-bold hover:bg-[#F0F2F2] transition-colors cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#07626A] text-white text-xs font-bold hover:bg-[#07626A]/90 transition-colors cursor-pointer"
                >
                  Сохранить изменения
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
