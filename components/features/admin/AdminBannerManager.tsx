"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Sparkles,
  Save,
  RotateCcw,
  Eye,
  Info,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  MapPin,
  Users,
} from "lucide-react";
import { AdminStorageService } from "@/lib/services/admin-storage.service";
import { HeroBannerData, DEFAULT_HERO_BANNER } from "@/types/banner.types";
import { useToast } from "@/context/ToastContext";
import { I18nFieldEditor } from "@/components/features/admin/I18nFieldEditor";

export const AdminBannerManager: React.FC = () => {
  const toast = useToast();
  const [formData, setFormData] = useState<HeroBannerData>(DEFAULT_HERO_BANNER);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewLang, setPreviewLang] = useState<"ru" | "kg" | "en">("ru");

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await AdminStorageService.getHeroBanner();
      setFormData(data);
    } catch (err) {
      console.error("Failed to load banner data:", err);
      toast.error("Не удалось загрузить данные баннера");
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
      const success = await AdminStorageService.saveHeroBanner(formData);
      if (success) {
        toast.success("Главный баннер успешно сохранен и обновлен");
      } else {
        toast.error("Ошибка сохранения баннера");
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
      title: "Сбросить настройки баннера?",
      message: "Все тексты и пути к изображениям вернутся к исходным заводским значениям по умолчанию.",
      confirmText: "Сбросить",
      cancelText: "Отмена",
      isDestructive: true,
    });

    if (isConfirmed) {
      setIsSaving(true);
      try {
        await AdminStorageService.resetHeroBanner();
        setFormData({ ...DEFAULT_HERO_BANNER });
        toast.info("Баннер сброшен к исходным значениям");
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
          Загрузка настроек баннера...
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
              Главная страница
            </span>
            <span className="text-[11px] text-[#0D0D0D]/40 font-semibold uppercase">
              • Hero Секция
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0D0D0D] mt-1 tracking-tight">
            Управление главным баннером
          </h1>
          <p className="text-xs text-[#0D0D0D]/60 mt-1 max-w-2xl leading-relaxed">
            Редактирование всех текстовых строк (RU / KG / EN), ссылок на фоны и изображение путешественницы справа. Нижний рваный край является фиксированным элементом дизайна.
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
            <span>{isSaving ? "Сохранение..." : "Сохранить изменения"}</span>
          </button>
        </div>
      </div>

      {/* Rules and Guidelines for Right Girl Image */}
      <div className="p-6 rounded-2xl bg-[#FAFBFB] border border-[#E1E1E1] space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-[#07626A]/10 text-[#07626A] shrink-0 mt-0.5">
            <Info className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-extrabold text-[#0D0D0D]">
              Правила и пропорции для правого фото (Девушка-путешественница)
            </h2>
            <p className="text-xs text-[#0D0D0D]/70 leading-relaxed">
              Чтобы новое изображение идеально вписалось в баннер и не ломало верстку на мобильных и десктопных устройствах, следуйте этим рекомендациям:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Rule 1 */}
          <div className="p-3.5 rounded-xl bg-white border border-[#E1E1E1] space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#07626A]">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>1. Пропорции (Aspect Ratio)</span>
            </div>
            <p className="text-[11px] text-[#0D0D0D]/70 leading-normal">
              Вертикальный портрет <strong>~ 4:5</strong> или <strong>0.88 : 1</strong> (исходник: <strong>2664 × 3032 px</strong>). Рекомендуется не менее <strong>1200 × 1400 px</strong>.
            </p>
          </div>

          {/* Rule 2 */}
          <div className="p-3.5 rounded-xl bg-white border border-[#E1E1E1] space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#07626A]">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>2. Прозрачный фон (Cutout)</span>
            </div>
            <p className="text-[11px] text-[#0D0D0D]/70 leading-normal">
              Формат <strong>PNG</strong> или <strong>WebP</strong> с <strong>прозрачностью (alpha-канал)</strong>. Задний фон должен быть полностью удален/вырезан.
            </p>
          </div>

          {/* Rule 3 */}
          <div className="p-3.5 rounded-xl bg-white border border-[#E1E1E1] space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#07626A]">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>3. Позиционирование силуэта</span>
            </div>
            <p className="text-[11px] text-[#0D0D0D]/70 leading-normal">
              Низ силуэта (ноги/бедра) должен доходить до самого нижнего края холста (без пустых отступов снизу), чтобы касаться нижнего рваного края.
            </p>
          </div>

          {/* Rule 4 */}
          <div className="p-3.5 rounded-xl bg-white border border-[#E1E1E1] space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#07626A]">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>4. Направление и вес файла</span>
            </div>
            <p className="text-[11px] text-[#0D0D0D]/70 leading-normal">
              Взгляд и корпус девушки должны быть направлены <strong>влево (к текстам)</strong> или прямо. Размер файла: до <strong>600–800 КБ</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Main Edit Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Texts Configuration Section */}
        <div className="p-6 rounded-2xl bg-white border border-[#E1E1E1] space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#E1E1E1]">
            <Layers className="w-4 h-4 text-[#07626A]" />
            <h2 className="text-sm font-extrabold text-[#0D0D0D] uppercase tracking-wide">
              Текстовые блоки баннера (Мультиязычность)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Title Prefix (Строка 1) */}
            <div className="p-4 rounded-xl bg-[#FAFBFB] border border-[#E1E1E1]">
              <I18nFieldEditor
                label="Строка 1 (Название / Префикс, напр. AIYM PATH)"
                value={formData.titlePrefix}
                onChange={(titlePrefix) => setFormData((prev) => ({ ...prev, titlePrefix }))}
                required
              />
            </div>

            {/* Title Line 2 (Строка 2) */}
            <div className="p-4 rounded-xl bg-[#FAFBFB] border border-[#E1E1E1]">
              <I18nFieldEditor
                label="Строка 2 (напр. ПУТЕШЕСТВИЯ БЕЗ)"
                value={formData.titleLine2}
                onChange={(titleLine2) => setFormData((prev) => ({ ...prev, titleLine2 }))}
                required
              />
            </div>

            {/* Title Line 3 (Строка 3) */}
            <div className="p-4 rounded-xl bg-[#FAFBFB] border border-[#E1E1E1]">
              <I18nFieldEditor
                label="Строка 3 (напр. ГРАНИЦ)"
                value={formData.titleLine3}
                onChange={(titleLine3) => setFormData((prev) => ({ ...prev, titleLine3 }))}
                required
              />
            </div>
          </div>

          {/* Subtitle */}
          <div className="p-4 rounded-xl bg-[#FAFBFB] border border-[#E1E1E1]">
            <I18nFieldEditor
              label="Подзаголовок / Описание миссии (2-3 предложения)"
              isTextarea
              rows={3}
              value={formData.subtitle}
              onChange={(subtitle) => setFormData((prev) => ({ ...prev, subtitle }))}
              required
            />
          </div>

          {/* CTA Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[#FAFBFB] border border-[#E1E1E1]">
              <I18nFieldEditor
                label="Кнопка 1: Переход на Карту (напр. Карта)"
                value={formData.ctaMap}
                onChange={(ctaMap) => setFormData((prev) => ({ ...prev, ctaMap }))}
                required
              />
            </div>

            <div className="p-4 rounded-xl bg-[#FAFBFB] border border-[#E1E1E1]">
              <I18nFieldEditor
                label="Кнопка 2: Переход к Гидам (напр. Гиды)"
                value={formData.ctaGuides}
                onChange={(ctaGuides) => setFormData((prev) => ({ ...prev, ctaGuides }))}
                required
              />
            </div>
          </div>
        </div>

        {/* Media & Images Section */}
        <div className="p-6 rounded-2xl bg-white border border-[#E1E1E1] space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#E1E1E1]">
            <ImageIcon className="w-4 h-4 text-[#07626A]" />
            <h2 className="text-sm font-extrabold text-[#0D0D0D] uppercase tracking-wide">
              Графические ресурсы и изображения
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Background Image */}
            <div className="p-4 rounded-xl bg-[#FAFBFB] border border-[#E1E1E1] space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0D0D0D] block">
                  Фоновое изображение баннера
                </label>
                <p className="text-[10px] text-[#0D0D0D]/50">
                  Широкоформатный фон (~16:9, мин. 1920×1080)
                </p>
              </div>
              <input
                type="text"
                value={formData.backgroundImage}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, backgroundImage: e.target.value }))
                }
                placeholder="/images/banner/banner.webp"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1E1E1] text-xs font-medium focus:border-[#07626A] focus:outline-none bg-white text-[#0D0D0D]"
              />
              <div className="relative w-full h-28 rounded-lg overflow-hidden border border-[#E1E1E1] bg-gray-100">
                <Image
                  src={formData.backgroundImage || "/images/banner/banner.webp"}
                  alt="Background preview"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Girl / Traveler Image */}
            <div className="p-4 rounded-xl bg-[#FAFBFB] border border-[#E1E1E1] space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#0D0D0D] block">
                    Фото девушки справа
                  </label>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#07626A]/10 text-[#07626A]">
                    Cutout PNG/WebP
                  </span>
                </div>
                <p className="text-[10px] text-[#0D0D0D]/50">
                  Прозрачный фон, портрет ~4:5 (2664×3032 px)
                </p>
              </div>
              <input
                type="text"
                value={formData.girlImage}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, girlImage: e.target.value }))
                }
                placeholder="/images/banner/asia-girl.webp"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1E1E1] text-xs font-medium focus:border-[#07626A] focus:outline-none bg-white text-[#0D0D0D]"
              />
              <div className="relative w-full h-28 rounded-lg overflow-hidden border border-[#E1E1E1] bg-[radial-gradient(#e1e1e1_1px,transparent_1px)] [background-size:8px_8px]">
                <Image
                  src={formData.girlImage || "/images/banner/asia-girl.webp"}
                  alt="Girl preview"
                  fill
                  className="object-contain object-bottom"
                />
              </div>
            </div>

            {/* Kyrgyz Ornament Image */}
            <div className="p-4 rounded-xl bg-[#FAFBFB] border border-[#E1E1E1] space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0D0D0D] block">
                  Национальный узор (Слева)
                </label>
                <p className="text-[10px] text-[#0D0D0D]/50">
                  Прозрачный узор для левого края
                </p>
              </div>
              <input
                type="text"
                value={formData.ornamentImage}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, ornamentImage: e.target.value }))
                }
                placeholder="/images/banner/uzor.webp"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1E1E1] text-xs font-medium focus:border-[#07626A] focus:outline-none bg-white text-[#0D0D0D]"
              />
              <div className="relative w-full h-28 rounded-lg overflow-hidden border border-[#E1E1E1] bg-[radial-gradient(#e1e1e1_1px,transparent_1px)] [background-size:8px_8px]">
                <Image
                  src={formData.ornamentImage || "/images/banner/uzor.webp"}
                  alt="Ornament preview"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Interactive Preview */}
        <div className="p-6 rounded-2xl bg-white border border-[#E1E1E1] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E1E1E1]">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#07626A]" />
              <h2 className="text-sm font-extrabold text-[#0D0D0D] uppercase tracking-wide">
                Интерактивный предпросмотр баннера
              </h2>
            </div>

            {/* Language switcher for preview */}
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

          {/* Rendered Preview Box */}
          <div className="relative w-full rounded-2xl overflow-hidden border border-[#E1E1E1] bg-white min-h-[360px] sm:min-h-[420px] flex items-center p-6 sm:p-10">
            {/* Background */}
            <div className="absolute inset-0 z-0">
              <Image
                src={formData.backgroundImage || "/images/banner/banner.webp"}
                alt="Banner preview"
                fill
                className="object-cover object-center"
              />
            </div>

            {/* Ornament */}
            <div className="absolute top-0 left-0 bottom-0 z-[5] w-1/2 pointer-events-none select-none overflow-hidden flex items-center justify-start opacity-70">
              <div className="relative w-full h-full">
                <Image
                  src={formData.ornamentImage || "/images/banner/uzor.webp"}
                  alt="Uzor"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </div>

            {/* Girl */}
            <div className="hidden sm:flex absolute bottom-0 right-0 z-10 w-1/2 h-[90%] pointer-events-none select-none items-end justify-end">
              <div className="relative w-full h-full">
                <Image
                  src={formData.girlImage || "/images/banner/asia-girl.webp"}
                  alt="Girl"
                  fill
                  className="object-contain object-bottom"
                />
              </div>
            </div>

            {/* Text Overlay */}
            <div className="relative z-20 max-w-md">
              <h3 className="text-2xl sm:text-4xl font-black tracking-tight leading-[1.1] mb-3 uppercase">
                <span className="block text-gray-900">
                  {formData.titlePrefix[previewLang] || formData.titlePrefix.ru}
                </span>
                <span className="block text-[#07626A]">
                  {formData.titleLine2[previewLang] || formData.titleLine2.ru}
                </span>
                <span className="block text-[#07626A]">
                  {formData.titleLine3[previewLang] || formData.titleLine3.ru}
                </span>
              </h3>

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-5 max-w-sm">
                {formData.subtitle[previewLang] || formData.subtitle.ru}
              </p>

              <div className="flex flex-wrap items-center gap-2.5">
                <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-semibold bg-[#07626A]">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{formData.ctaMap[previewLang] || formData.ctaMap.ru}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>

                <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#E1E1E1] text-gray-800 text-xs font-semibold">
                  <Users className="w-3.5 h-3.5 text-[#07626A]" />
                  <span>{formData.ctaGuides[previewLang] || formData.ctaGuides.ru}</span>
                </div>
              </div>
            </div>

            {/* Fixed bottom effect visual note */}
            <div className="absolute bottom-2 left-4 z-30">
              <span className="text-[10px] font-bold text-gray-400 bg-white/80 px-2 py-0.5 rounded border border-gray-200">
                + Нижний эффект (эффект рваного края) накладывается автоматически
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#07626A] hover:bg-[#064e55] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Сохранение..." : "Сохранить главный баннер"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
