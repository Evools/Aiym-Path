"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Backpack,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  MapPin,
  X,
  HelpCircle,
} from "lucide-react";
import { AdminStorageService, AdminLocationItem } from "@/lib/services/admin-storage.service";
import { ChecklistItem, EquipmentCategory } from "@/types/guidebook.types";
import { useToast } from "@/context/ToastContext";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { I18nFieldEditor } from "@/components/features/admin/I18nFieldEditor";
import { INITIAL_LOCATIONS } from "@/data/locations.data";

const CATEGORY_OPTIONS = [
  { value: "clothing", label: "Одежда и обувь" },
  { value: "navigation", label: "Навигация и связь" },
  { value: "safety", label: "Аптечка и безопасность" },
  { value: "hygiene", label: "Гигиена и вода" },
  { value: "shelter", label: "Бивак и ночлег" },
];

export const AdminChecklistManager: React.FC = () => {
  const toast = useToast();
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [locations, setLocations] = useState<AdminLocationItem[]>(INITIAL_LOCATIONS as unknown as AdminLocationItem[]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ChecklistItem | null>(null);

  const [formData, setFormData] = useState<{
    id: string;
    category: EquipmentCategory;
    isEssential: boolean;
    locationIds: string[];
    label: { ru: string; kg: string; en: string };
    note: { ru: string; kg: string; en: string };
  }>({
    id: "",
    category: "clothing",
    isEssential: true,
    locationIds: [],
    label: { ru: "", kg: "", en: "" },
    note: { ru: "", kg: "", en: "" },
  });

  const loadData = async () => {
    const [dbItems, dbLocs] = await Promise.all([
      AdminStorageService.getChecklistItems(),
      AdminStorageService.getLocations(),
    ]);
    if (dbItems) setItems(dbItems);
    if (dbLocs && dbLocs.length > 0) setLocations(dbLocs);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const labelRu = item.label.ru.toLowerCase();
        const noteRu = item.note?.ru?.toLowerCase() || "";
        if (!labelRu.includes(q) && !noteRu.includes(q)) return false;
      }
      return true;
    });
  }, [items, selectedCategory, searchQuery]);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      id: `chk-${Date.now()}`,
      category: "clothing",
      isEssential: true,
      locationIds: [],
      label: { ru: "", kg: "", en: "" },
      note: { ru: "", kg: "", en: "" },
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ChecklistItem) => {
    setEditingItem(item);
    setFormData({
      id: item.id,
      category: item.category,
      isEssential: item.isEssential ?? true,
      locationIds: item.locationIds || [],
      label: { ...item.label },
      note: item.note ? { ...item.note } : { ru: "", kg: "", en: "" },
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, labelRu: string) => {
    const isConfirmed = await toast.confirm({
      title: "Удалить предмет из чек-листа?",
      message: `Вы уверены, что хотите удалить «${labelRu}»?`,
      confirmText: "Удалить",
      cancelText: "Отмена",
      isDestructive: true,
    });
    if (isConfirmed) {
      await AdminStorageService.deleteChecklistItem(id);
      await loadData();
      toast.success("Предмет удален из чек-листа");
    }
  };

  const handleToggleLocation = (locId: string) => {
    setFormData((prev) => {
      const exists = prev.locationIds.includes(locId);
      return {
        ...prev,
        locationIds: exists
          ? prev.locationIds.filter((id) => id !== locId)
          : [...prev.locationIds, locId],
      };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label.ru.trim()) {
      toast.error("Введите название предмета на русском языке");
      return;
    }

    const itemToSave: ChecklistItem = {
      id: formData.id,
      category: formData.category,
      isEssential: formData.isEssential,
      locationIds: formData.locationIds.length > 0 ? formData.locationIds : undefined,
      label: {
        ru: formData.label.ru.trim(),
        kg: formData.label.kg.trim() || formData.label.ru.trim(),
        en: formData.label.en.trim() || formData.label.ru.trim(),
      },
      note: formData.note.ru.trim()
        ? {
            ru: formData.note.ru.trim(),
            kg: formData.note.kg.trim() || formData.note.ru.trim(),
            en: formData.note.en.trim() || formData.note.ru.trim(),
          }
        : undefined,
    };

    await AdminStorageService.saveChecklistItem(itemToSave);
    await loadData();
    setIsModalOpen(false);
    toast.success(editingItem ? "Предмет обновлен" : "Предмет добавлен в чек-лист");
  };

  return (
    <div className="space-y-6">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar select-none">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              selectedCategory === "all"
                ? "bg-[#07626A] text-white border-[#07626A] shadow-xs"
                : "bg-[#F0F2F2] text-[#0D0D0D]/70 border-[#E1E1E1] hover:bg-white"
            }`}
          >
            Все ({items.length})
          </button>
          {CATEGORY_OPTIONS.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                selectedCategory === cat.value
                  ? "bg-[#07626A] text-white border-[#07626A] shadow-xs"
                  : "bg-[#F0F2F2] text-[#0D0D0D]/70 border-[#E1E1E1] hover:bg-white"
              }`}
            >
              {cat.label} ({items.filter((i) => i.category === cat.value).length})
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0D0D0D]/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск экипировки..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E1E1E1] bg-white text-xs text-[#0D0D0D] placeholder-[#0D0D0D]/40 focus:outline-none focus:border-[#07626A]"
            />
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#07626A] hover:bg-[#07626A]/90 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Добавить</span>
          </button>
        </div>
      </div>

      {/* Checklist Items Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-white border border-[#E1E1E1] hover:border-[rgba(7,98,106,0.30)] transition-colors flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F0F2F2] text-[#07626A]">
                    {CATEGORY_OPTIONS.find((c) => c.value === item.category)?.label || item.category}
                  </span>
                  {item.isEssential && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700">
                      Обязательно
                    </span>
                  )}
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-[#0D0D0D] leading-snug">
                  {item.label.ru}
                </h4>

                {item.note?.ru && (
                  <p className="text-[11px] text-[#0D0D0D]/65 leading-relaxed mt-1">
                    {item.note.ru}
                  </p>
                )}

                {item.locationIds && item.locationIds.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {item.locationIds.map((locId) => (
                      <span
                        key={locId}
                        className="px-2 py-0.5 rounded-md bg-[#FAFBFB] border border-[#E1E1E1] text-[10px] text-[#07626A] font-semibold"
                      >
                        {locations.find((l) => l.id === locId)?.title.ru || locId}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#E1E1E1] flex items-center justify-between gap-2">
                <span className="text-[10px] text-[#0D0D0D]/40">
                  {item.locationIds && item.locationIds.length > 0
                    ? `${item.locationIds.length} локаций`
                    : "Для всех локаций"}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 rounded-lg bg-[#F0F2F2] hover:bg-[#07626A] text-[#0D0D0D]/70 hover:text-white transition-colors cursor-pointer"
                    title="Редактировать"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, item.label.ru)}
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white transition-colors cursor-pointer"
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
        <div className="text-center py-12 px-4 rounded-2xl bg-white border border-[#E1E1E1]">
          <HelpCircle className="w-8 h-8 text-[#0D0D0D]/30 mx-auto mb-2" />
          <p className="text-xs font-bold text-[#0D0D0D]">Экипировка не найдена</p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-7 border border-[#E1E1E1] shadow-2xl relative my-8 flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E1E1E1]">
              <div className="flex items-center gap-2.5">
                <Backpack className="w-5 h-5 text-[#07626A]" />
                <h3 className="text-base font-bold text-[#0D0D0D]">
                  {editingItem ? "Редактирование предмета" : "Новый предмет экипировки"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-[#F0F2F2] text-[#0D0D0D]/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <CustomSelect
                  label="Категория"
                  options={CATEGORY_OPTIONS}
                  value={formData.category}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, category: val as EquipmentCategory }))
                  }
                  required
                />

                <div className="flex flex-col justify-end pb-1">
                  <label className="flex items-center gap-2 text-xs font-bold text-[#0D0D0D] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isEssential}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, isEssential: e.target.checked }))
                      }
                      className="w-4 h-4 rounded text-[#07626A] focus:ring-[#07626A]"
                    />
                    <span>Обязательное снаряжение</span>
                  </label>
                </div>
              </div>

              {/* I18n: Label */}
              <I18nFieldEditor
                label="Название предмета"
                value={formData.label}
                onChange={(val) => setFormData((prev) => ({ ...prev, label: val }))}
                placeholder={{
                  ru: "Например: Треккинговые ботинки",
                  kg: "Мисалы: Треккинг өтүктөрү",
                  en: "E.g.: Trekking boots",
                }}
                required
              />

              {/* I18n: Note */}
              <I18nFieldEditor
                label="Подсказка / примечание"
                value={formData.note}
                onChange={(val) => setFormData((prev) => ({ ...prev, note: val }))}
                placeholder={{
                  ru: "Например: Обязательно разношенные, с поддержкой голеностопа",
                  kg: "Мисалы: Сыналган жана ыңгайлуу",
                  en: "E.g.: Well broken-in with ankle support",
                }}
              />

              {/* Locations Selector */}
              <div>
                <label className="block text-xs font-bold text-[#0D0D0D] mb-2">
                  Привязать к локациям (если не выбрано — для всех):
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2.5 rounded-xl border border-[#E1E1E1] bg-[#FAFBFB]">
                  {locations.map((loc) => {
                    const isSelected = formData.locationIds.includes(loc.id);
                    return (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => handleToggleLocation(loc.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                          isSelected
                            ? "bg-[#07626A] text-white border-[#07626A]"
                            : "bg-white text-[#0D0D0D]/70 border-[#E1E1E1] hover:bg-[#F0F2F2]"
                        }`}
                      >
                        {loc.title.ru}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E1E1E1]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E1E1E1] text-xs font-bold text-[#0D0D0D]/70 hover:bg-[#F0F2F2]"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#07626A] hover:bg-[#07626A]/90 text-white text-xs font-bold"
                >
                  {editingItem ? "Сохранить" : "Добавить"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
