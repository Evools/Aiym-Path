"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  X,
  HelpCircle,
} from "lucide-react";
import { AdminStorageService } from "@/lib/services/admin-storage.service";
import { GuidebookItem, GuidebookAudience, GuidebookCategory } from "@/types/guidebook.types";
import { useToast } from "@/context/ToastContext";
import { CustomSelect, CustomSelectOption } from "@/components/ui/CustomSelect";
import { I18nFieldEditor } from "@/components/features/admin/I18nFieldEditor";

const AUDIENCE_OPTIONS: CustomSelectOption[] = [
  {
    value: "travelers",
    label: "Для путешественниц (Travelers)",
    sublabel: "Рекомендации, правила безопасности, снаряжение",
  },
  {
    value: "providers",
    label: "Для бизнеса и CBT (Providers)",
    sublabel: "Стандарты гостеприимства, инфраструктура, обучение",
  },
];

const CATEGORY_OPTIONS: CustomSelectOption[] = [
  { value: "safety", label: "Безопасность на маршруте (Safety)" },
  { value: "female_tips", label: "Female-friendly специфика" },
  { value: "trekking", label: "Треккинг и экипировка" },
  { value: "standards", label: "Стандарты сервиса CBT" },
  { value: "infrastructure", label: "Инфраструктура и гигиена" },
  { value: "emergency", label: "Экстренная помощь (SOS)" },
  { value: "eco_culture", label: "Экология и культурные нормы" },
  { value: "planning", label: "Планирование поездки" },
];

export default function AdminGuidebookPage() {
  const toast = useToast();
  const [items, setItems] = useState<GuidebookItem[]>([]);
  const [selectedAudience, setSelectedAudience] = useState<"all" | GuidebookAudience>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GuidebookItem | null>(null);

  // Form State using I18n models
  const [formData, setFormData] = useState<{
    id: string;
    audience: GuidebookAudience;
    category: GuidebookCategory;
    iconName: GuidebookItem["iconName"];
    title: { ru: string; kg: string; en: string };
    shortDescription: { ru: string; kg: string; en: string };
    badgeText: { ru: string; kg: string; en: string };
    details: { ru: string; kg: string; en: string };
  }>({
    id: "",
    audience: "travelers",
    category: "safety",
    iconName: "ShieldCheck",
    title: { ru: "", kg: "", en: "" },
    shortDescription: { ru: "", kg: "", en: "" },
    badgeText: { ru: "Рекомендация", kg: "Сунуш", en: "Guideline" },
    details: {
      ru: "Обязательно соблюдайте правила безопасности\nПроверяйте прогноз погоды перед выходом\nБерите с собой аптечку и пауэрбанк",
      kg: "Коопсуздук эрежелерин сактаңыз\nЖөнөө алдында аба ырайын текшериңиз\nАптечка жана кубаттагыч ала жүрүңүз",
      en: "Always follow mountain safety standards\nCheck weather forecast before departing\nPack a first-aid kit and power bank",
    },
  });

  const loadItems = async () => {
    const data = await AdminStorageService.getGuidebookItems();
    setItems(data);
  };

  useEffect(() => {
    loadItems();
  }, []);

  // Close modal on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        setIsModalOpen(false);
      }
    },
    [isModalOpen]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedAudience !== "all" && item.audience !== selectedAudience) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleRu = item.title.ru.toLowerCase();
        const descRu = item.shortDescription.ru.toLowerCase();
        if (!titleRu.includes(q) && !descRu.includes(q)) return false;
      }
      return true;
    });
  }, [items, selectedAudience, searchQuery]);

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setFormData({
      id: `guide-${Date.now()}`,
      audience: "travelers",
      category: "safety",
      iconName: "ShieldCheck",
      title: { ru: "", kg: "", en: "" },
      shortDescription: { ru: "", kg: "", en: "" },
      badgeText: { ru: "Рекомендация", kg: "Сунуш", en: "Guideline" },
      details: {
        ru: "Обязательно соблюдайте правила безопасности\nПроверяйте прогноз погоды перед выходом\nБерите с собой аптечку и пауэрбанк",
        kg: "Коопсуздук эрежелерин сактаңыз\nЖөнөө алдында аба ырайын текшериңиз\nАптечка жана кубаттагыч ала жүрүңүз",
        en: "Always follow mountain safety standards\nCheck weather forecast before departing\nPack a first-aid kit and power bank",
      },
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: GuidebookItem) => {
    setEditingItem(item);
    setFormData({
      id: item.id,
      audience: item.audience,
      category: item.category,
      iconName: item.iconName || "ShieldCheck",
      title: { ...item.title },
      shortDescription: { ...item.shortDescription },
      badgeText: {
        ru: item.badgeText?.ru || "Рекомендация",
        kg: item.badgeText?.kg || "Сунуш",
        en: item.badgeText?.en || "Guideline",
      },
      details: {
        ru: (item.details?.ru || []).join("\n"),
        kg: (item.details?.kg || []).join("\n"),
        en: (item.details?.en || []).join("\n"),
      },
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, titleRu: string) => {
    const isConfirmed = await toast.confirm({
      title: "Удалить статью?",
      message: `Вы уверены, что хотите удалить «${titleRu}» из базы данных путеводителя?`,
      confirmText: "Удалить",
      cancelText: "Отмена",
      isDestructive: true,
    });

    if (isConfirmed) {
      await AdminStorageService.deleteGuidebookItem(id);
      await loadItems();
      toast.success("Статья удалена из путеводителя");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.ru.trim()) {
      toast.error("Введите название статьи на русском языке");
      return;
    }

    const itemToSave: GuidebookItem = {
      id: formData.id,
      audience: formData.audience,
      category: formData.category,
      iconName: formData.iconName || "ShieldCheck",
      title: {
        ru: formData.title.ru.trim(),
        kg: formData.title.kg.trim() || formData.title.ru.trim(),
        en: formData.title.en.trim() || formData.title.ru.trim(),
      },
      shortDescription: {
        ru: formData.shortDescription.ru.trim(),
        kg: formData.shortDescription.kg.trim() || formData.shortDescription.ru.trim(),
        en: formData.shortDescription.en.trim() || formData.shortDescription.ru.trim(),
      },
      badgeText: {
        ru: formData.badgeText.ru.trim() || "Рекомендация",
        kg: formData.badgeText.kg.trim() || "Сунуш",
        en: formData.badgeText.en.trim() || "Guideline",
      },
      details: {
        ru: formData.details.ru.split("\n").map((s) => s.trim()).filter(Boolean),
        kg: formData.details.kg.split("\n").map((s) => s.trim()).filter(Boolean),
        en: formData.details.en.split("\n").map((s) => s.trim()).filter(Boolean),
      },
      actionType: editingItem?.actionType,
    };

    await AdminStorageService.saveGuidebookItem(itemToSave);
    await loadItems();
    setIsModalOpen(false);
    toast.success(
      editingItem ? "Статья успешно обновлена" : "Новая статья добавлена в путеводитель"
    );
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-200">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E1E1E1]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(7,98,106,0.08)] text-[#07626A] text-xs font-bold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Управление контентом</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D0D0D] tracking-tight">
            Путеводитель и рекомендации
          </h1>
          <p className="text-xs sm:text-sm text-[#0D0D0D]/65 mt-1">
            Управляйте правилами безопасности, чек-листами и рекомендациями для путешественниц и CBT.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/guide"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-[#E1E1E1] hover:border-[#07626A] text-xs font-bold text-[#0D0D0D]/75 hover:text-[#07626A] transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Смотреть на сайте</span>
          </Link>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#07626A] hover:bg-[#07626A]/90 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Добавить статью</span>
          </button>
        </div>
      </div>

      {/* 2. Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Audience Filter Tabs */}
        <div className="inline-flex p-1 rounded-xl bg-[#F0F2F2] border border-[#E1E1E1] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setSelectedAudience("all")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedAudience === "all"
                ? "bg-white text-[#0D0D0D] shadow-xs"
                : "text-[#0D0D0D]/60 hover:text-[#0D0D0D]"
            }`}
          >
            Все ({items.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedAudience("travelers")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedAudience === "travelers"
                ? "bg-white text-[#07626A] shadow-xs"
                : "text-[#0D0D0D]/60 hover:text-[#0D0D0D]"
            }`}
          >
            Для путешественниц ({items.filter((i) => i.audience === "travelers").length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedAudience("providers")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedAudience === "providers"
                ? "bg-white text-[#07626A] shadow-xs"
                : "text-[#0D0D0D]/60 hover:text-[#0D0D0D]"
            }`}
          >
            Для бизнеса / CBT ({items.filter((i) => i.audience === "providers").length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0D0D0D]/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск статей..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#E1E1E1] bg-white text-xs text-[#0D0D0D] placeholder-[#0D0D0D]/40 focus:outline-none focus:border-[#07626A] transition-colors"
          />
        </div>
      </div>

      {/* 3. Items Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white border border-[#E1E1E1] hover:border-[rgba(7,98,106,0.30)] transition-colors flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                      item.audience === "travelers"
                        ? "bg-teal-50 text-[#07626A] border-teal-100"
                        : "bg-amber-50 text-amber-800 border-amber-200"
                    }`}
                  >
                    {item.audience === "travelers" ? "Путешественницы" : "Бизнес & CBT"}
                  </span>

                  <span className="text-[10px] font-semibold text-[#0D0D0D]/50">
                    {item.details.ru.length} рекомендаций
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-[#0D0D0D] leading-snug">
                  {item.title.ru}
                </h3>

                <p className="text-xs text-[#0D0D0D]/70 leading-relaxed mt-1.5 line-clamp-3">
                  {item.shortDescription.ru}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E1E1E1] flex items-center justify-between gap-2">
                <span className="text-[11px] font-medium text-[#07626A]">
                  {item.badgeText?.ru || "Статья"}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(item)}
                    className="p-2 rounded-xl bg-[#F0F2F2] hover:bg-[#07626A] text-[#0D0D0D]/70 hover:text-white transition-colors cursor-pointer"
                    title="Редактировать"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, item.title.ru)}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white transition-colors cursor-pointer"
                    title="Удалить"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-3xl bg-white border border-[#E1E1E1]">
          <HelpCircle className="w-10 h-10 text-[#0D0D0D]/40 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#0D0D0D] mb-1">
            Статьи не найдены
          </h3>
          <p className="text-xs text-[#0D0D0D]/60 max-w-sm mx-auto">
            Попробуйте изменить поисковый запрос или создайте новую рекомендацию для путеводителя.
          </p>
        </div>
      )}

      {/* 4. Create / Edit Modal with Backdrop Click & ESC support */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsModalOpen(false);
            }
          }}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-[#E1E1E1] shadow-2xl relative my-8 flex flex-col gap-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E1E1E1]">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-[#07626A] shrink-0"
                  style={{ backgroundColor: "rgba(7, 98, 106, 0.08)" }}
                >
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0D0D0D]">
                    {editingItem ? "Редактирование статьи" : "Новая статья путеводителя"}
                  </h3>
                  <span className="text-xs text-[#0D0D0D]/50">
                    Заполните данные с поддержкой автоперевода на 3 языка (RU, KG, EN)
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-[#0D0D0D]/50 hover:text-[#0D0D0D] hover:bg-[#F0F2F2] transition-colors cursor-pointer"
                title="Закрыть (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="space-y-6">
              {/* Custom Selects for Audience & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CustomSelect
                  label="Целевая аудитория"
                  options={AUDIENCE_OPTIONS}
                  value={formData.audience}
                  onChange={(val) =>
                    setFormData((prev) => ({
                      ...prev,
                      audience: val as GuidebookAudience,
                    }))
                  }
                  required
                />

                <CustomSelect
                  label="Категория"
                  options={CATEGORY_OPTIONS}
                  value={formData.category}
                  onChange={(val) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: val as GuidebookCategory,
                    }))
                  }
                  required
                />
              </div>

              {/* I18n: Title */}
              <I18nFieldEditor
                label="Название статьи"
                value={formData.title}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, title: val }))
                }
                placeholder={{
                  ru: "Например: Безопасность на маршруте",
                  kg: "Мисалы: Маршруттагы коопсуздук",
                  en: "E.g.: Trail Safety Guidelines",
                }}
                required
              />

              {/* I18n: Short Description */}
              <I18nFieldEditor
                label="Краткое описание для карточки"
                value={formData.shortDescription}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, shortDescription: val }))
                }
                isTextarea
                rows={2}
                placeholder={{
                  ru: "Краткая суть рекомендации...",
                  kg: "Кыскача сүрөттөмөсү...",
                  en: "Brief description for the preview card...",
                }}
                required
              />

              {/* I18n: Badge Text */}
              <I18nFieldEditor
                label="Текст бейджа карточки"
                value={formData.badgeText}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, badgeText: val }))
                }
                placeholder={{
                  ru: "Например: Приоритет №1 / Рекомендация",
                  kg: "Мисалы: №1 Артыкчылык / Сунуш",
                  en: "E.g.: Priority #1 / Guideline",
                }}
              />

              {/* I18n: Detailed Points */}
              <I18nFieldEditor
                label="Подробные пункты (каждый с новой строки)"
                value={formData.details}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, details: val }))
                }
                isTextarea
                rows={5}
                placeholder={{
                  ru: "Пункт 1\nПункт 2\nПункт 3",
                  kg: "1-пункт\n2-пункт\n3-пункт",
                  en: "Point 1\nPoint 2\nPoint 3",
                }}
              />

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E1E1E1]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#E1E1E1] text-xs font-bold text-[#0D0D0D]/70 hover:bg-[#F0F2F2] transition-colors cursor-pointer"
                >
                  Отмена
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#07626A] hover:bg-[#07626A]/90 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  {editingItem ? "Сохранить изменения" : "Создать статью"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
