"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  ShieldCheck,
  Phone,
  Trash2,
  Edit,
  Globe,
  Award,
  X,
  Save,
  Users,
} from "lucide-react";
import {
  AdminStorageService,
  AdminGuideItem,
} from "@/lib/services/admin-storage.service";
import { I18nFieldEditor } from "@/components/features/admin/I18nFieldEditor";
import { CustomCheckbox } from "@/components/ui/CustomCheckbox";
import { CustomMultiSelect, MultiSelectOption } from "@/components/ui/CustomMultiSelect";

const LANGUAGE_OPTIONS: MultiSelectOption[] = [
  { value: "Кыргызча", label: "Кыргызча", sublabel: "Мамлекеттик тил" },
  { value: "Русский", label: "Русский", sublabel: "Официальный язык" },
  { value: "English", label: "English", sublabel: "International" },
  { value: "Deutsch", label: "Deutsch", sublabel: "Немецкий" },
  { value: "Français", label: "Français", sublabel: "Французский" },
  { value: "Türkçe", label: "Türkçe", sublabel: "Турецкий" },
  { value: "Español", label: "Español", sublabel: "Испанский" },
  { value: "Italiano", label: "Italiano", sublabel: "Итальянский" },
  { value: "العربية", label: "العربية (Arabic)", sublabel: "Арабский" },
  { value: "中文", label: "中文 (Chinese)", sublabel: "Китайский" },
  { value: "한국어", label: "한국어 (Korean)", sublabel: "Корейский" },
  { value: "日本語", label: "日本語 (Japanese)", sublabel: "Японский" },
];

const POPULAR_QUICK_LANGS = [
  "Кыргызча",
  "Русский",
  "English",
  "Deutsch",
  "Français",
  "Türkçe",
  "中文",
];

export default function AdminGuidesPage() {
  const [guides, setGuides] = useState<AdminGuideItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [editingGuide, setEditingGuide] = useState<AdminGuideItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [role, setRole] = useState({ ru: "", kg: "", en: "" });
  const [image, setImage] = useState("");
  const [phone, setPhone] = useState("+996 700 000 000");
  const [experienceYears, setExperienceYears] = useState(5);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([
    "Кыргызча",
    "Русский",
    "English",
  ]);
  const [isVerified, setIsVerified] = useState(true);

  useEffect(() => {
    setGuides(AdminStorageService.getGuides());
    setIsMounted(true);
  }, []);

  const openCreateModal = () => {
    setEditingGuide(null);
    setName("");
    setRole({
      ru: "Горный гид и спасатель",
      kg: "Тоо гиди жана куткаруучу",
      en: "Mountain Guide & First Responder",
    });
    setImage(
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"
    );
    setPhone("+996 700 000 000");
    setExperienceYears(4);
    setSelectedLanguages(["Кыргызча", "Русский", "English"]);
    setIsVerified(true);
    setIsModalOpen(true);
  };

  const openEditModal = (guide: AdminGuideItem) => {
    setEditingGuide(guide);
    setName(guide.name);
    setRole({
      ru: guide.role.ru,
      kg: guide.role.kg || guide.role.ru,
      en: guide.role.en || guide.role.ru,
    });
    setImage(guide.image);
    setPhone(guide.phone);
    setExperienceYears(guide.experienceYears);
    setSelectedLanguages(
      guide.languages && guide.languages.length > 0
        ? guide.languages
        : ["Русский", "English"]
    );
    setIsVerified(guide.isVerified);
    setIsModalOpen(true);
  };

  const handleToggleQuickLanguage = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Введите имя гида");
      return;
    }

    const guideData: AdminGuideItem = {
      id: editingGuide ? editingGuide.id : `guide-${Date.now()}`,
      name,
      role,
      image,
      phone,
      experienceYears: Number(experienceYears),
      languages:
        selectedLanguages.length > 0 ? selectedLanguages : ["Русский", "English"],
      isVerified,
    };

    AdminStorageService.saveGuide(guideData);
    setGuides(AdminStorageService.getGuides());
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, guideName: string) => {
    if (confirm(`Удалить профиль гида «${guideName}»?`)) {
      AdminStorageService.deleteGuide(id);
      setGuides(AdminStorageService.getGuides());
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E1E1E1]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D0D0D] tracking-tight">
            Гиды (Female Guides CMS)
          </h1>
          <p className="text-xs sm:text-sm text-[#0D0D0D]/65 mt-1">
            Управление профилями проверенных женщин-гидов, верификацией и контактными данными.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#07626A] hover:bg-[#07626A]/90 text-white text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Добавить гида</span>
        </button>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {!isMounted ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-white border border-[#E1E1E1] h-56 animate-pulse flex flex-col justify-between"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-[#F0F2F2]" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-[#F0F2F2] rounded-md w-3/4" />
                  <div className="h-3 bg-[#F0F2F2] rounded-md w-1/2" />
                </div>
              </div>
              <div className="space-y-2 pt-3 border-t border-[#E1E1E1]">
                <div className="h-3 bg-[#F0F2F2] rounded-md w-full" />
                <div className="h-3 bg-[#F0F2F2] rounded-md w-2/3" />
              </div>
            </div>
          ))
        ) : (
          guides.map((guide) => {
            return (
              <div
                key={guide.id}
                className="p-5 rounded-3xl bg-white border border-[#E1E1E1] hover:border-[#07626A] transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-3.5">
                    <div className="relative w-14 h-14 rounded-2xl bg-[#F3F3F3] overflow-hidden shrink-0 border border-[#E1E1E1]">
                      <Image
                        src={guide.image}
                        alt={guide.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-[#0D0D0D] truncate">
                          {guide.name}
                        </h3>
                        {guide.isVerified && (
                          <ShieldCheck
                            className="w-4 h-4 text-[#07626A] shrink-0"
                          />
                        )}
                      </div>

                      <p className="text-xs text-[#0D0D0D]/65 truncate mt-0.5">
                        {guide.role.ru}
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mt-4 pt-3 border-t border-[#E1E1E1] text-xs">
                    <div className="flex items-center justify-between text-[#0D0D0D]/70">
                      <span className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-[#07626A]" />
                        <span>Опыт в туризме</span>
                      </span>
                      <span className="font-bold text-[#0D0D0D]">
                        {guide.experienceYears} лет
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[#0D0D0D]/70">
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#07626A]" />
                        <span>Контакты</span>
                      </span>
                      <span className="font-bold text-[#0D0D0D] font-mono">
                        {guide.phone}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-2 text-[#0D0D0D]/70 pt-1">
                      <span className="flex items-center gap-1.5 shrink-0">
                        <Globe className="w-3.5 h-3.5 text-[#07626A]" />
                        <span>Языки</span>
                      </span>
                      <div className="flex flex-wrap justify-end gap-1 max-w-[200px]">
                        {guide.languages.map((l) => (
                          <span
                            key={l}
                            className="px-1.5 py-0.5 rounded-md bg-[#07626A]/10 text-[#07626A] text-[10px] font-bold"
                          >
                            {l}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E1E1E1]">
                  <button
                    type="button"
                    onClick={() => handleDelete(guide.id, guide.name)}
                    className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                    title="Удалить профиль"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => openEditModal(guide)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#F3F3F3] hover:bg-[#07626A] text-[#0D0D0D] hover:text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Изменить</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Extra-Wide Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-5xl max-h-[92vh] bg-white rounded-3xl border border-[#E1E1E1] shadow-2xl flex flex-col animate-in zoom-in-95 duration-150 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-[#E1E1E1] bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-[#07626A]/10 text-[#07626A]">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#0D0D0D] tracking-tight">
                    {editingGuide ? "Редактирование профиля гида" : "Новый женский гид"}
                  </h3>
                  <p className="text-xs text-[#0D0D0D]/60 mt-0.5">
                    Управление данными гида, мультиязычной специализацией и языками сопровождения
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-[#0D0D0D]/50 hover:text-[#0D0D0D] hover:bg-[#F3F3F3] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body - Two Column Layout on Medium+ screens */}
            <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-hidden">
              <div className="overflow-y-auto px-6 sm:px-8 py-6 space-y-6 flex-1">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column: Basic Info & Contacts (5 cols) */}
                  <div className="lg:col-span-5 space-y-5">
                    <div className="flex items-center gap-2 pb-2 border-b border-[#E1E1E1]">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#07626A]">
                        1. Личные данные & Контакты
                      </span>
                    </div>

                    {/* Photo with live preview */}
                    <div>
                      <label className="block text-xs font-bold text-[#0D0D0D] uppercase tracking-wider mb-2">
                        Фотография гида
                      </label>
                      <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#FAFBFB] border border-[#E1E1E1]">
                        <div className="relative w-14 h-14 rounded-2xl bg-white overflow-hidden shrink-0 border border-[#E1E1E1] shadow-xs">
                          {image ? (
                            <Image
                              src={image}
                              alt="Preview"
                              fill
                              className="object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-[#0D0D0D]/40 font-bold">
                              НЕТ
                            </div>
                          )}
                        </div>
                        <input
                          type="url"
                          required
                          value={image}
                          onChange={(e) => setImage(e.target.value)}
                          placeholder="URL фотографии (https://...)"
                          className="flex-1 h-10 px-3 rounded-xl border border-[#E1E1E1] bg-white text-xs font-medium text-[#0D0D0D] focus:outline-none focus:border-[#07626A]"
                        />
                      </div>
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-xs font-bold text-[#0D0D0D] uppercase tracking-wider mb-1.5">
                        ФИО Гида <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Например: Айпери Садыкова"
                        className="w-full h-11 px-3.5 rounded-xl border border-[#E1E1E1] bg-white text-xs font-bold text-[#0D0D0D] focus:outline-none focus:border-[#07626A]"
                      />
                    </div>

                    {/* Phone & Experience */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#0D0D0D] uppercase tracking-wider mb-1.5">
                          Телефон / WhatsApp <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+996 700 000 000"
                          className="w-full h-11 px-3.5 rounded-xl border border-[#E1E1E1] bg-white text-xs font-bold text-[#0D0D0D] focus:outline-none focus:border-[#07626A]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#0D0D0D] uppercase tracking-wider mb-1.5">
                          Опыт (лет)
                        </label>
                        <input
                          type="number"
                          required
                          min="1"
                          max="50"
                          value={experienceYears}
                          onChange={(e) => setExperienceYears(Number(e.target.value))}
                          className="w-full h-11 px-3.5 rounded-xl border border-[#E1E1E1] bg-white text-xs font-bold text-[#0D0D0D] focus:outline-none focus:border-[#07626A]"
                        />
                      </div>
                    </div>

                    {/* Verification Status Checkbox using CustomCheckbox */}
                    <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-[#E1E1E1] hover:border-[#07626A]/40 transition-colors">
                      <CustomCheckbox
                        checked={isVerified}
                        onChange={setIsVerified}
                        label={
                          <span className="flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-[#07626A]" />
                            <span>Верифицированный женский гид</span>
                          </span>
                        }
                        description="Отображает бейдж доверия и безопасности Verified Female Guide"
                      />
                    </div>
                  </div>

                  {/* Right Column: Specialization & Language Selection (7 cols) */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-[#E1E1E1]">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#07626A]">
                        2. Специализация & Владение языками
                      </span>
                    </div>

                    {/* Multilingual Role */}
                    <div>
                      <I18nFieldEditor
                        label="Специализация / Роль гида"
                        required
                        value={role}
                        onChange={setRole}
                        placeholder={{
                          ru: "Горный гид, спасатель WFR",
                          kg: "Тоо гиди, WFR куткаруучусу",
                          en: "Mountain Guide, WFR Rescuer",
                        }}
                      />
                    </div>

                    {/* CustomMultiSelect Dropdown with Checkboxes */}
                    <div className="space-y-3 pt-2 border-t border-[#E1E1E1]">
                      <CustomMultiSelect
                        label="Языки сопровождения (выпадающий список с чекбоксами)"
                        options={LANGUAGE_OPTIONS}
                        selectedValues={selectedLanguages}
                        onChange={setSelectedLanguages}
                        placeholder="Нажмите, чтобы выбрать языки..."
                        searchPlaceholder="Поиск языка или ввод нового..."
                        allowCustom={true}
                      />

                      {/* Quick Popular Badges */}
                      <div className="pt-1">
                        <div className="text-[11px] font-bold text-[#0D0D0D]/60 uppercase tracking-wider mb-2">
                          Быстрый выбор популярных языков:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {POPULAR_QUICK_LANGS.map((lang) => {
                            const isSelected = selectedLanguages.includes(lang);
                            return (
                              <button
                                key={lang}
                                type="button"
                                onClick={() => handleToggleQuickLanguage(lang)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                                  isSelected
                                    ? "bg-[#07626A] text-white border-[#07626A] shadow-xs"
                                    : "bg-white text-[#0D0D0D]/75 border-[#E1E1E1] hover:border-[#07626A] hover:text-[#0D0D0D]"
                                }`}
                              >
                                {isSelected ? `✓ ${lang}` : `+ ${lang}`}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 sm:px-8 py-4 border-t border-[#E1E1E1] bg-[#FAFBFB] flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white border border-[#E1E1E1] text-xs font-bold text-[#0D0D0D] hover:bg-[#F3F3F3] transition-colors cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-7 py-2.5 rounded-xl bg-[#07626A] hover:bg-[#07626A]/90 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Сохранить профиль гида</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
