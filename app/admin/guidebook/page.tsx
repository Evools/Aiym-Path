"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Languages,
  Sparkles,
  X,
  CheckCircle2,
  HelpCircle,
  Loader2,
} from "lucide-react";
import {
  AdminStorageService,
} from "@/lib/services/admin-storage.service";
import { GuidebookItem, GuidebookAudience, GuidebookCategory } from "@/types/guidebook.types";
import { useToast } from "@/context/ToastContext";

export default function AdminGuidebookPage() {
  const toast = useToast();
  const [items, setItems] = useState<GuidebookItem[]>([]);
  const [selectedAudience, setSelectedAudience] = useState<"all" | GuidebookAudience>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GuidebookItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    id: string;
    audience: GuidebookAudience;
    category: GuidebookCategory;
    iconName: GuidebookItem["iconName"];
    title: { ru: string; kg: string; en: string };
    shortDescription: { ru: string; kg: string; en: string };
    badgeText: { ru: string; kg: string; en: string };
    detailsRu: string;
    detailsKg: string;
    detailsEn: string;
  }>({
    id: "",
    audience: "travelers",
    category: "safety",
    iconName: "ShieldCheck",
    title: { ru: "", kg: "", en: "" },
    shortDescription: { ru: "", kg: "", en: "" },
    badgeText: { ru: "", kg: "", en: "" },
    detailsRu: "",
    detailsKg: "",
    detailsEn: "",
  });

  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    setItems(AdminStorageService.getGuidebookItems());
  }, []);

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
      detailsRu: "Обязательно соблюдайте правила безопасности\nПроверяйте снаряжение перед выходом",
      detailsKg: "Коопсуздук эрежелерин сактаңыз\nЖөнөө алдында жабдууларды текшериңиз",
      detailsEn: "Always follow mountain safety standards\nCheck all gear before departing",
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
        ru: item.badgeText?.ru || "",
        kg: item.badgeText?.kg || "",
        en: item.badgeText?.en || "",
      },
      detailsRu: item.details.ru.join("\n"),
      detailsKg: item.details.kg.join("\n"),
      detailsEn: item.details.en.join("\n"),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, titleRu: string) => {
    const isConfirmed = await toast.confirm({
      title: "Удалить рекомендацию?",
      message: `Вы действительно хотите удалить «${titleRu}» из путеводителя?`,
      confirmText: "Удалить",
      cancelText: "Отмена",
      isDestructive: true,
    });

    if (isConfirmed) {
      AdminStorageService.deleteGuidebookItem(id);
      setItems(AdminStorageService.getGuidebookItems());
      toast.success("Рекомендация удалена из путеводителя");
    }
  };

  const handleAutoTranslate = async () => {
    if (!formData.title.ru.trim() && !formData.shortDescription.ru.trim()) {
      toast.error("Сначала введите название или описание на русском языке");
      return;
    }

    setIsTranslating(true);
    try {
      // 1. Translate Title
      let translatedTitleKg = formData.title.kg;
      let translatedTitleEn = formData.title.en;
      if (formData.title.ru.trim()) {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: formData.title.ru }),
        });
        const data = await res.json();
        if (data.success) {
          translatedTitleEn = data.en || translatedTitleEn;
          translatedTitleKg = data.kg || translatedTitleKg;
        }
      }

      // 2. Translate Short Description
      let translatedDescKg = formData.shortDescription.kg;
      let translatedDescEn = formData.shortDescription.en;
      if (formData.shortDescription.ru.trim()) {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: formData.shortDescription.ru }),
        });
        const data = await res.json();
        if (data.success) {
          translatedDescEn = data.en || translatedDescEn;
          translatedDescKg = data.kg || translatedDescKg;
        }
      }

      setFormData((prev) => ({
        ...prev,
        title: {
          ru: prev.title.ru,
          kg: translatedTitleKg || prev.title.kg,
          en: translatedTitleEn || prev.title.en,
        },
        shortDescription: {
          ru: prev.shortDescription.ru,
          kg: translatedDescKg || prev.shortDescription.kg,
          en: translatedDescEn || prev.shortDescription.en,
        },
      }));

      toast.success("Автоперевод успешно выполнен на кыргызский и английский");
    } catch {
      toast.error("Не удалось выполнить автоперевод");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.ru.trim()) {
      toast.error("Введите название рекомендации на русском языке");
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
        en: formData.title.en.trim() || formData.shortDescription.ru.trim(),
      },
      badgeText: {
        ru: formData.badgeText.ru.trim() || "Рекомендация",
        kg: formData.badgeText.kg.trim() || "Сунуш",
        en: formData.badgeText.en.trim() || "Guideline",
      },
      details: {
        ru: formData.detailsRu.split("\n").map((s) => s.trim()).filter(Boolean),
        kg: formData.detailsKg.split("\n").map((s) => s.trim()).filter(Boolean),
        en: formData.detailsEn.split("\n").map((s) => s.trim()).filter(Boolean),
      },
    };

    AdminStorageService.saveGuidebookItem(itemToSave);
    setItems(AdminStorageService.getGuidebookItems());
    setIsModalOpen(false);
    toast.success(
      editingItem ? "Рекомендация успешно обновлена" : "Новая рекомендация добавлена"
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

      {/* 4. Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-[#E1E1E1] animate-in zoom-in-95 duration-150 my-8 flex flex-col gap-6 relative max-h-[90vh] overflow-y-auto">
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
                    Заполните данные на русском, кыргызском и английском языках
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-[#0D0D0D]/50 hover:text-[#0D0D0D] hover:bg-[#F0F2F2] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="space-y-5">
              {/* Audience & Category Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Audience */}
                <div>
                  <label className="block text-xs font-bold text-[#0D0D0D] uppercase tracking-wider mb-1.5">
                    Целевая аудитория <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.audience}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        audience: e.target.value as GuidebookAudience,
                      })
                    }
                    className="w-full h-11 px-3.5 rounded-xl border border-[#E1E1E1] bg-white text-xs text-[#0D0D0D] font-medium focus:outline-none focus:border-[#07626A]"
                  >
                    <option value="travelers">Для путешественниц (Travelers)</option>
                    <option value="providers">Для бизнеса / CBT (Providers)</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-[#0D0D0D] uppercase tracking-wider mb-1.5">
                    Категория <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as GuidebookCategory,
                      })
                    }
                    className="w-full h-11 px-3.5 rounded-xl border border-[#E1E1E1] bg-white text-xs text-[#0D0D0D] font-medium focus:outline-none focus:border-[#07626A]"
                  >
                    <option value="safety">Безопасность (Safety)</option>
                    <option value="female_tips">Female-friendly советы</option>
                    <option value="trekking">Треккинг и экипировка</option>
                    <option value="standards">Стандарты сервиса CBT</option>
                    <option value="infrastructure">Инфраструктура</option>
                    <option value="emergency">Экстренная помощь</option>
                  </select>
                </div>
              </div>

              {/* Title Fields (3 languages) with Auto-translate */}
              <div className="space-y-3 p-4 rounded-2xl bg-[#FAFBFB] border border-[#E1E1E1]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
                    Название статьи (RU / KG / EN)
                  </span>

                  <button
                    type="button"
                    onClick={handleAutoTranslate}
                    disabled={isTranslating}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[rgba(7,98,106,0.10)] text-[#07626A] text-[11px] font-bold hover:bg-[rgba(7,98,106,0.18)] transition-colors cursor-pointer"
                  >
                    {isTranslating ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    <span>Автоперевод (KG / EN)</span>
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#0D0D0D]/60 mb-1">
                    Русский (RU) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title.ru}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        title: { ...formData.title, ru: e.target.value },
                      })
                    }
                    placeholder="Например: Безопасность на маршруте"
                    className="w-full h-10 px-3 rounded-xl border border-[#E1E1E1] bg-white text-xs text-[#0D0D0D] focus:outline-none focus:border-[#07626A]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#0D0D0D]/60 mb-1">
                      Кыргызча (KG)
                    </label>
                    <input
                      type="text"
                      value={formData.title.kg}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          title: { ...formData.title, kg: e.target.value },
                        })
                      }
                      placeholder="Маршруттагы коопсуздук"
                      className="w-full h-10 px-3 rounded-xl border border-[#E1E1E1] bg-white text-xs text-[#0D0D0D] focus:outline-none focus:border-[#07626A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#0D0D0D]/60 mb-1">
                      English (EN)
                    </label>
                    <input
                      type="text"
                      value={formData.title.en}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          title: { ...formData.title, en: e.target.value },
                        })
                      }
                      placeholder="Trail Safety Standards"
                      className="w-full h-10 px-3 rounded-xl border border-[#E1E1E1] bg-white text-xs text-[#0D0D0D] focus:outline-none focus:border-[#07626A]"
                    />
                  </div>
                </div>
              </div>

              {/* Short Description Fields */}
              <div className="space-y-3 p-4 rounded-2xl bg-[#FAFBFB] border border-[#E1E1E1]">
                <span className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider block">
                  Краткое описание статьи
                </span>

                <div>
                  <label className="block text-[11px] font-bold text-[#0D0D0D]/60 mb-1">
                    Русский (RU) <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formData.shortDescription.ru}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shortDescription: {
                          ...formData.shortDescription,
                          ru: e.target.value,
                        },
                      })
                    }
                    placeholder="Краткая суть рекомендации для карточки..."
                    className="w-full p-3 rounded-xl border border-[#E1E1E1] bg-white text-xs text-[#0D0D0D] focus:outline-none focus:border-[#07626A]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#0D0D0D]/60 mb-1">
                      Кыргызча (KG)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.shortDescription.kg}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shortDescription: {
                            ...formData.shortDescription,
                            kg: e.target.value,
                          },
                        })
                      }
                      placeholder="Кыскача сүрөттөмө..."
                      className="w-full p-3 rounded-xl border border-[#E1E1E1] bg-white text-xs text-[#0D0D0D] focus:outline-none focus:border-[#07626A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#0D0D0D]/60 mb-1">
                      English (EN)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.shortDescription.en}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shortDescription: {
                            ...formData.shortDescription,
                            en: e.target.value,
                          },
                        })
                      }
                      placeholder="Short summary for the card..."
                      className="w-full p-3 rounded-xl border border-[#E1E1E1] bg-white text-xs text-[#0D0D0D] focus:outline-none focus:border-[#07626A]"
                    />
                  </div>
                </div>
              </div>

              {/* Detailed Points (каждый пункт с новой строки) */}
              <div className="space-y-3 p-4 rounded-2xl bg-[#FAFBFB] border border-[#E1E1E1]">
                <div>
                  <span className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider block">
                    Подробные пункты рекомендации (каждый с новой строки)
                  </span>
                  <span className="text-[11px] text-[#0D0D0D]/50">
                    Отображаются внутри модального окна при клике на карточку
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#0D0D0D]/60 mb-1">
                    Пункты на русском (RU)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.detailsRu}
                    onChange={(e) =>
                      setFormData({ ...formData, detailsRu: e.target.value })
                    }
                    placeholder="Пункт 1&#10;Пункт 2&#10;Пункт 3"
                    className="w-full p-3 rounded-xl border border-[#E1E1E1] bg-white text-xs text-[#0D0D0D] focus:outline-none focus:border-[#07626A]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#0D0D0D]/60 mb-1">
                      Пункты на кыргызском (KG)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.detailsKg}
                      onChange={(e) =>
                        setFormData({ ...formData, detailsKg: e.target.value })
                      }
                      placeholder="1-пункт&#10;2-пункт"
                      className="w-full p-3 rounded-xl border border-[#E1E1E1] bg-white text-xs text-[#0D0D0D] focus:outline-none focus:border-[#07626A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#0D0D0D]/60 mb-1">
                      Пункты на английском (EN)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.detailsEn}
                      onChange={(e) =>
                        setFormData({ ...formData, detailsEn: e.target.value })
                      }
                      placeholder="Point 1&#10;Point 2"
                      className="w-full p-3 rounded-xl border border-[#E1E1E1] bg-white text-xs text-[#0D0D0D] focus:outline-none focus:border-[#07626A]"
                    />
                  </div>
                </div>
              </div>

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
