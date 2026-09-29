"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Save,
  RotateCcw,
  Eye,
  Info,
  Type,
  Image as ImageIcon,
  CheckCircle2,
  Sliders,
  Sparkles,
} from "lucide-react";
import { AdminStorageService } from "@/lib/services/admin-storage.service";
import { SiteLogoData, DEFAULT_SITE_LOGO } from "@/types/settings.types";
import { useToast } from "@/context/ToastContext";
import { I18nFieldEditor } from "@/components/features/admin/I18nFieldEditor";
import { CustomCheckbox } from "@/components/ui/CustomCheckbox";
import { BrandLogo } from "@/components/ui/BrandLogo";

export const AdminLogoManager: React.FC = () => {
  const toast = useToast();
  const [formData, setFormData] = useState<SiteLogoData>(DEFAULT_SITE_LOGO);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewLang, setPreviewLang] = useState<"ru" | "kg" | "en">("ru");

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await AdminStorageService.getLogoSettings();
      setFormData(data);
    } catch (err) {
      console.error("Failed to load logo settings:", err);
      toast.error("Не удалось загрузить настройки логотипа");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const success = await AdminStorageService.saveLogoSettings(formData);
      if (success) {
        toast.success("Логотип и брендинг сайта успешно сохранены");
      } else {
        toast.error("Ошибка при сохранении в базу данных");
      }
    } catch (err) {
      console.error(err);
      toast.error("Не удалось сохранить изменения");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    const isConfirmed = await toast.confirm({
      title: "Сбросить логотип к значениям по умолчанию?",
      message: "Название, подписи и пути к графическому логотипу вернутся к исходным заводским настройкам (Aiym Path).",
      confirmText: "Сбросить",
      cancelText: "Отмена",
      isDestructive: true,
    });

    if (isConfirmed) {
      setIsSaving(true);
      try {
        await AdminStorageService.resetLogoSettings();
        setFormData({ ...DEFAULT_SITE_LOGO });
        toast.info("Настройки логотипа сброшены");
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-[#07626A] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold text-[#0D0D0D]/60 uppercase tracking-wider">
          Загрузка настроек логотипа...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-[#07626A]/10 text-[#07626A] text-[11px] font-bold uppercase tracking-wider">
              Брендинг
            </span>
            <span className="text-[11px] text-[#0D0D0D]/40 font-semibold uppercase">
              • Шапка, подвал и CMS
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0D0D0D] mt-1 tracking-tight">
            Управление логотипом сайта
          </h1>
          <p className="text-xs text-[#0D0D0D]/60 mt-1 max-w-2xl leading-relaxed">
            Настройте отображение главного логотипа проекта: текстовый бренд, графическое изображение (SVG / PNG / WebP) или комбинированный вариант.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E1E1E1] bg-white text-[#0D0D0D]/70 hover:bg-[#F0F2F2] hover:text-[#0D0D0D] text-xs font-bold transition-colors cursor-pointer"
            title="Сбросить к исходным настройкам"
          >
            <RotateCcw className="w-4 h-4 text-[#0D0D0D]/50" />
            <span>Сброс</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#07626A] hover:bg-[#064e55] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Сохранение..." : "Сохранить логотип"}</span>
          </button>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Logo Mode Selection */}
        <div className="p-6 rounded-2xl bg-white border border-[#E1E1E1] space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#E1E1E1]">
            <Sliders className="w-4 h-4 text-[#07626A]" />
            <h2 className="text-sm font-extrabold text-[#0D0D0D] uppercase tracking-wide">
              1. Формат отображения логотипа
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: "text",
                title: "Только текст",
                desc: "Название проекта и подпись фирменным шрифтом",
                icon: Type,
              },
              {
                id: "image",
                title: "Только изображение",
                desc: "Графический логотип или эмблема (SVG/PNG)",
                icon: ImageIcon,
              },
              {
                id: "both",
                title: "Комбинированный",
                desc: "Графический знак рядом с текстовым названием",
                icon: Sparkles,
              },
            ].map((option) => {
              const Icon = option.icon;
              const isSelected = formData.type === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      type: option.id as "text" | "image" | "both",
                    }))
                  }
                  className={`p-4 rounded-xl text-left border transition-colors flex flex-col justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? "border-[#07626A] bg-[rgba(7,98,106,0.04)] ring-1 ring-[#07626A]"
                      : "border-[#E1E1E1] bg-white hover:bg-[#F0F2F2]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected
                          ? "bg-[#07626A] text-white"
                          : "bg-[#F0F2F2] text-[#0D0D0D]/60"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    {isSelected && (
                      <span className="text-[10px] font-extrabold text-[#07626A] bg-[#07626A]/10 px-2 py-0.5 rounded-full uppercase">
                        Активен
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#0D0D0D]">{option.title}</h3>
                    <p className="text-[11px] text-[#0D0D0D]/55 mt-0.5 leading-snug">
                      {option.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Text Settings */}
        {(formData.type === "text" || formData.type === "both") && (
          <div className="p-6 rounded-2xl bg-white border border-[#E1E1E1] space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#E1E1E1]">
              <Type className="w-4 h-4 text-[#07626A]" />
              <h2 className="text-sm font-extrabold text-[#0D0D0D] uppercase tracking-wide">
                2. Текстовое название и слоган
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Main Brand Text */}
              <div className="p-4 rounded-xl bg-[#FAFBFB] border border-[#E1E1E1]">
                <I18nFieldEditor
                  label="Главное название бренда (напр. Aiym Path)"
                  value={formData.text}
                  onChange={(text) => setFormData((prev) => ({ ...prev, text }))}
                  required
                />
              </div>

              {/* Subtitle / Tagline */}
              <div className="p-4 rounded-xl bg-[#FAFBFB] border border-[#E1E1E1] space-y-4">
                <I18nFieldEditor
                  label="Подпись / Слоган (напр. female-friendly туризм)"
                  value={formData.subtext}
                  onChange={(subtext) => setFormData((prev) => ({ ...prev, subtext }))}
                />

                <div className="pt-2 border-t border-[#E1E1E1]">
                  <CustomCheckbox
                    checked={formData.showSubtext}
                    onChange={(showSubtext) =>
                      setFormData((prev) => ({ ...prev, showSubtext }))
                    }
                    label="Отображать подпись под названием"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Graphic Image Settings */}
        {(formData.type === "image" || formData.type === "both") && (
          <div className="p-6 rounded-2xl bg-white border border-[#E1E1E1] space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#E1E1E1]">
              <ImageIcon className="w-4 h-4 text-[#07626A]" />
              <h2 className="text-sm font-extrabold text-[#0D0D0D] uppercase tracking-wide">
                3. Графический файл логотипа
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 p-4 rounded-xl bg-[#FAFBFB] border border-[#E1E1E1] space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0D0D0D] block">
                    Путь или ссылка на изображение логотипа (SVG / PNG / WebP)
                  </label>
                  <p className="text-[11px] text-[#0D0D0D]/60 leading-relaxed">
                    Укажите локальный путь (например, <code className="px-1 py-0.5 rounded bg-gray-100 font-mono">/images/logo.svg</code> или <code className="px-1 py-0.5 rounded bg-gray-100 font-mono">/images/logo.png</code>) либо полный веб-URL.
                  </p>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))
                    }
                    placeholder="/images/logo.svg или https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1E1E1] text-xs font-medium focus:border-[#07626A] focus:outline-none bg-white text-[#0D0D0D]"
                  />
                </div>

                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#0D0D0D]">
                      Высота отображения логотипа: {formData.imageHeight || 36}px
                    </label>
                    <span className="text-[10px] text-[#0D0D0D]/50 font-medium">
                      24px – 60px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="24"
                    max="60"
                    step="2"
                    value={formData.imageHeight || 36}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        imageHeight: Number(e.target.value),
                      }))
                    }
                    className="w-full accent-[#07626A] cursor-pointer"
                  />
                </div>
              </div>

              {/* Graphic Logo Preview */}
              <div className="p-4 rounded-xl bg-[#FAFBFB] border border-[#E1E1E1] flex flex-col items-center justify-center gap-2">
                <span className="text-[10px] font-bold text-[#0D0D0D]/40 uppercase tracking-wider">
                  Изображение
                </span>
                <div className="relative w-full h-24 rounded-lg overflow-hidden border border-[#E1E1E1] bg-[radial-gradient(#e1e1e1_1px,transparent_1px)] [background-size:8px_8px] flex items-center justify-center p-2">
                  {formData.imageUrl ? (
                    <div
                      className="relative w-full h-full flex items-center justify-center"
                    >
                      <Image
                        src={formData.imageUrl}
                        alt="Logo Preview"
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="text-center text-gray-400 text-xs">
                      <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-50" />
                      <span>Изображение не указано</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Live Interactive Previews */}
        <div className="p-6 rounded-2xl bg-white border border-[#E1E1E1] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E1E1E1]">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#07626A]" />
              <h2 className="text-sm font-extrabold text-[#0D0D0D] uppercase tracking-wide">
                Интерактивный предпросмотр логотипа
              </h2>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center gap-1 p-1 bg-[#F0F2F2] rounded-xl self-start sm:self-auto">
              {(["ru", "kg", "en"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setPreviewLang(lang)}
                  className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-colors uppercase ${
                    previewLang === lang
                      ? "bg-[#07626A] text-white"
                      : "text-[#0D0D0D]/60 hover:text-[#0D0D0D]"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Header Simulation Box */}
            <div className="p-4 rounded-xl border border-[#E1E1E1] bg-white space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-[#E1E1E1]">
                <span className="text-[10px] font-bold uppercase text-[#0D0D0D]/50">
                  В Шапке сайта (Header)
                </span>
                <span className="text-[10px] text-gray-400">Фон: Белый</span>
              </div>
              <div className="py-3 px-2 flex items-center justify-between">
                <div className="inline-flex items-center gap-2.5">
                  {(formData.type === "image" || formData.type === "both") &&
                    formData.imageUrl && (
                      <div
                        className="relative shrink-0 flex items-center justify-center overflow-hidden"
                        style={{
                          height: `${formData.imageHeight || 36}px`,
                          width: `${Math.round((formData.imageHeight || 36) * 1.3)}px`,
                        }}
                      >
                        <Image
                          src={formData.imageUrl}
                          alt="Logo"
                          fill
                          className="object-contain object-left"
                        />
                      </div>
                    )}
                  {(formData.type === "text" ||
                    formData.type === "both" ||
                    !formData.imageUrl) && (
                    <div className="flex flex-col">
                      <span
                        className="text-2xl font-extrabold tracking-tight leading-none text-[#07626A]"
                        style={{
                          fontFamily:
                            "var(--font-nunito-sans), 'Nunito Sans', sans-serif",
                        }}
                      >
                        {formData.text[previewLang] || formData.text.ru}
                      </span>
                      {formData.showSubtext && (
                        <span className="text-[10px] text-[#0D0D0D]/60 font-semibold tracking-wider uppercase mt-0.5">
                          {formData.subtext[previewLang] || formData.subtext.ru}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <div className="h-6 w-12 bg-gray-100 rounded-lg" />
                  <div className="h-6 w-12 bg-gray-100 rounded-lg" />
                </div>
              </div>
            </div>

            {/* Admin Sidebar Simulation Box */}
            <div className="p-4 rounded-xl border border-[#E1E1E1] bg-white space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-[#E1E1E1]">
                <span className="text-[10px] font-bold uppercase text-[#0D0D0D]/50">
                  В Админ-панели (CMS Sidebar)
                </span>
                <span className="text-[10px] text-gray-400">Бейдж: CMS</span>
              </div>
              <div className="py-3 px-2 flex items-center">
                <div className="inline-flex items-center gap-2.5">
                  {(formData.type === "image" || formData.type === "both") &&
                    formData.imageUrl && (
                      <div
                        className="relative shrink-0 flex items-center justify-center overflow-hidden"
                        style={{
                          height: `${Math.min(formData.imageHeight || 36, 32)}px`,
                          width: `${Math.round(
                            Math.min(formData.imageHeight || 36, 32) * 1.3
                          )}px`,
                        }}
                      >
                        <Image
                          src={formData.imageUrl}
                          alt="Logo"
                          fill
                          className="object-contain object-left"
                        />
                      </div>
                    )}
                  {(formData.type === "text" ||
                    formData.type === "both" ||
                    !formData.imageUrl) && (
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="text-xl font-extrabold tracking-tight leading-none text-[#07626A]"
                          style={{
                            fontFamily:
                              "var(--font-nunito-sans), 'Nunito Sans', sans-serif",
                          }}
                        >
                          {formData.text[previewLang] || formData.text.ru}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-[rgba(7,98,106,0.10)] text-[#07626A] text-[9px] font-extrabold uppercase">
                          CMS
                        </span>
                      </div>
                      <span className="text-[9px] text-[#0D0D0D]/50 font-semibold tracking-wider uppercase mt-0.5">
                        Панель управления
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#07626A] hover:bg-[#064e55] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Сохранение..." : "Сохранить логотип"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
