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

export default function AdminGuidesPage() {
  const [guides, setGuides] = useState<AdminGuideItem[]>([]);
  const [editingGuide, setEditingGuide] = useState<AdminGuideItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [role, setRole] = useState({ ru: "", kg: "", en: "" });
  const [image, setImage] = useState("");
  const [phone, setPhone] = useState("+996 700 000 000");
  const [experienceYears, setExperienceYears] = useState(5);
  const [languagesStr, setLanguagesStr] = useState("Русский, Кыргызча, English");
  const [isVerified, setIsVerified] = useState(true);

  useEffect(() => {
    setGuides(AdminStorageService.getGuides());
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
    setLanguagesStr("Русский, Кыргызча, English");
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
    setLanguagesStr(guide.languages.join(", "));
    setIsVerified(guide.isVerified);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Введите имя гида");
      return;
    }

    const languages = languagesStr
      .split(",")
      .map((l) => l.trim())
      .filter(Boolean);

    const guideData: AdminGuideItem = {
      id: editingGuide ? editingGuide.id : `guide-${Date.now()}`,
      name,
      role,
      image,
      phone,
      experienceYears: Number(experienceYears),
      languages: languages.length > 0 ? languages : ["Русский", "English"],
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
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#07626A] hover:bg-[#07626A]/90 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Добавить гида</span>
        </button>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {guides.map((guide) => {
          return (
            <div
              key={guide.id}
              className="p-5 rounded-3xl bg-white border border-[#E1E1E1] hover:border-[#07626A] transition-colors flex flex-col justify-between gap-4"
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

                  <div className="flex items-center justify-between text-[#0D0D0D]/70">
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-[#07626A]" />
                      <span>Языки</span>
                    </span>
                    <span className="font-medium text-[#0D0D0D] truncate max-w-[150px]">
                      {guide.languages.join(", ")}
                    </span>
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
        })}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-[#E1E1E1] shadow-2xl flex flex-col gap-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E1E1E1]">
              <h3 className="text-lg font-bold text-[#0D0D0D]">
                {editingGuide ? "Редактирование профиля гида" : "Новый женский гид"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-[#0D0D0D]/50 hover:text-[#0D0D0D] hover:bg-[#F3F3F3]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-4">
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

              {/* Multilingual Role */}
              <I18nFieldEditor
                label="Специализация / Роль"
                required
                value={role}
                onChange={setRole}
                placeholder={{
                  ru: "Горный гид, спасатель WFR",
                  kg: "Тоо гиди, WFR куткаруучусу",
                  en: "Mountain Guide, WFR Rescuer",
                }}
              />

              {/* Photo & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0D0D0D] uppercase tracking-wider mb-1.5">
                    URL Фотографии
                  </label>
                  <input
                    type="url"
                    required
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#E1E1E1] bg-white text-xs font-medium text-[#0D0D0D] focus:outline-none focus:border-[#07626A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0D0D0D] uppercase tracking-wider mb-1.5">
                    Телефон / WhatsApp
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#E1E1E1] bg-white text-xs font-bold text-[#0D0D0D] focus:outline-none focus:border-[#07626A]"
                  />
                </div>
              </div>

              {/* Experience & Languages Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                <div>
                  <label className="block text-xs font-bold text-[#0D0D0D] uppercase tracking-wider mb-1.5">
                    Языки (через запятую)
                  </label>
                  <input
                    type="text"
                    required
                    value={languagesStr}
                    onChange={(e) => setLanguagesStr(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#E1E1E1] bg-white text-xs font-bold text-[#0D0D0D] focus:outline-none focus:border-[#07626A]"
                  />
                </div>
              </div>

              {/* Verified Badge Checkbox */}
              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F3F3F3] border border-[#E1E1E1] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isVerified}
                  onChange={(e) => setIsVerified(e.target.checked)}
                  className="w-4 h-4 rounded text-[#07626A] focus:ring-0"
                />
                <span className="text-xs font-bold text-[#0D0D0D] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#07626A]" />
                  <span>Верифицированный женский гид (Verified Female Guide)</span>
                </span>
              </label>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white border border-[#E1E1E1] text-xs font-bold text-[#0D0D0D] hover:bg-[#F3F3F3]"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#07626A] hover:bg-[#07626A]/90 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Сохранить профиль</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
