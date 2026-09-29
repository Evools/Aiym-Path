"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Download,
  Info,
  Link2,
  X,
  HardDriveDownload,
  BookOpen,
} from "lucide-react";
import {
  AdminStorageService,
  getGoogleDriveDirectDownloadLink,
} from "@/lib/services/admin-storage.service";
import { PdfResourceItem } from "@/types/guidebook.types";
import { useToast } from "@/context/ToastContext";
import { I18nFieldEditor } from "@/components/features/admin/I18nFieldEditor";

export const AdminPdfResourcesManager: React.FC = () => {
  const toast = useToast();
  const [items, setItems] = useState<PdfResourceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PdfResourceItem | null>(null);

  const [formData, setFormData] = useState<{
    id: string;
    title: { ru: string; kg: string; en: string };
    description: { ru: string; kg: string; en: string };
    badge: { ru: string; kg: string; en: string };
    fileUrl: string;
  }>({
    id: "",
    title: { ru: "", kg: "", en: "" },
    description: { ru: "", kg: "", en: "" },
    badge: { ru: "Для путешественниц", kg: "Саякатчылар үчүн", en: "For Travelers" },
    fileUrl: "",
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await AdminStorageService.getPdfResources();
      setItems(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      id: `pdf-${Date.now()}`,
      title: { ru: "", kg: "", en: "" },
      description: { ru: "", kg: "", en: "" },
      badge: { ru: "Для путешественниц", kg: "Саякатчылар үчүн", en: "For Travelers" },
      fileUrl: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: PdfResourceItem) => {
    setEditingItem(item);
    setFormData({
      id: item.id,
      title: { ...item.title },
      description: { ...item.description },
      badge: { ...item.badge },
      fileUrl: item.fileUrl,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, titleRu: string) => {
    const confirmed = await toast.confirm({
      title: "Удалить PDF пособие?",
      message: `Вы действительно хотите удалить «${titleRu}»? Ссылка на документ перестанет быть доступной на сайте.`,
      confirmText: "Удалить",
      cancelText: "Отмена",
      isDestructive: true,
    });

    if (confirmed) {
      await AdminStorageService.deletePdfResource(id);
      await loadData();
      toast.success("PDF пособие удалено");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.ru.trim()) {
      toast.error("Укажите название документа на русском языке");
      return;
    }
    if (!formData.fileUrl.trim()) {
      toast.error("Укажите ссылку на Google Диск или файл");
      return;
    }

    const itemToSave: PdfResourceItem = {
      id: formData.id,
      title: {
        ru: formData.title.ru.trim(),
        kg: formData.title.kg.trim() || formData.title.ru.trim(),
        en: formData.title.en.trim() || formData.title.ru.trim(),
      },
      description: {
        ru: formData.description.ru.trim(),
        kg: formData.description.kg.trim() || formData.description.ru.trim(),
        en: formData.description.en.trim() || formData.description.ru.trim(),
      },
      fileSize: "PDF",
      badge: {
        ru: formData.badge.ru.trim() || "Для чтения",
        kg: formData.badge.kg.trim() || "Окуу үчүн",
        en: formData.badge.en.trim() || "Document",
      },
      fileUrl: formData.fileUrl.trim(),
    };

    await AdminStorageService.savePdfResource(itemToSave);
    await loadData();
    setIsModalOpen(false);
    toast.success(editingItem ? "Пособие обновлено" : "Новое пособие добавлено");
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-150">
      {/* Top Banner / Google Drive Instructions */}
      <div className="p-5 rounded-2xl bg-[rgba(7,98,106,0.06)] border border-[rgba(7,98,106,0.15)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#07626A] text-white flex items-center justify-center shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0D0D0D]">
              Интеграция с Google Диском для чтения и скачивания PDF
            </h3>
            <p className="text-xs text-[#0D0D0D]/70 mt-0.5 leading-relaxed">
              Загрузите PDF на Google Диск → нажмите «Поделиться» → выберите доступ{" "}
              <strong>«Все, у кого есть ссылка (Читатель)»</strong> → вставьте ссылку сюда.
              Файл открывается для онлайн-чтения и скачивания.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#07626A] hover:bg-[#07626A]/90 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Добавить PDF документ</span>
        </button>
      </div>

      {/* Grid of PDF Resources */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-56 rounded-3xl bg-[#F0F2F2] animate-pulse" />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((res) => {
            const directDownload = getGoogleDriveDirectDownloadLink(res.fileUrl);

            return (
              <div
                key={res.id}
                className="p-6 rounded-3xl bg-white border border-[#E1E1E1] hover:border-[rgba(7,98,106,0.30)] transition-colors flex flex-col justify-between gap-5"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-[#07626A] shrink-0 border border-[rgba(7,98,106,0.15)]"
                      style={{ backgroundColor: "rgba(7, 98, 106, 0.08)" }}
                    >
                      <FileText className="w-5 h-5" />
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#07626A] bg-[#F0F2F2] px-2.5 py-1 rounded-full border border-[#E1E1E1]">
                      {res.badge?.ru || "Документ"}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-[#0D0D0D] leading-snug">
                      {res.title?.ru}
                    </h4>
                    <p className="text-xs text-[#0D0D0D]/70 leading-relaxed mt-2 line-clamp-3">
                      {res.description?.ru}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-[#E1E1E1]">
                  {/* Google Drive Link Preview */}
                  <div className="flex items-center justify-between text-[11px] text-[#0D0D0D]/60 bg-[#F0F2F2] px-3 py-1.5 rounded-xl border border-[#E1E1E1]">
                    <span className="font-semibold text-[#07626A] flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>PDF файл для чтения</span>
                    </span>
                    <a
                      href={res.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#07626A] hover:underline font-bold shrink-0"
                    >
                      <Link2 className="w-3.5 h-3.5" />
                      <span>Открыть</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <a
                      href={directDownload}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#07626A]/10 hover:bg-[#07626A] text-[#07626A] hover:text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Тест ссылки</span>
                    </a>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(res)}
                        className="p-2 rounded-xl bg-[#F0F2F2] hover:bg-[#07626A] text-[#0D0D0D]/70 hover:text-white transition-colors cursor-pointer"
                        title="Редактировать"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(res.id, res.title.ru)}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white transition-colors cursor-pointer"
                        title="Удалить"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-3xl bg-white border border-[#E1E1E1]">
          <HardDriveDownload className="w-10 h-10 text-[#0D0D0D]/40 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#0D0D0D] mb-1">
            Нет добавленных PDF пособий
          </h3>
          <p className="text-xs text-[#0D0D0D]/60 max-w-sm mx-auto mb-4">
            Добавьте первое пособие или официальный справочник с публичной ссылкой на Google Диск.
          </p>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#07626A] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Добавить PDF</span>
          </button>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-[#E1E1E1] relative my-8 flex flex-col gap-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#E1E1E1]">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-[#07626A] shrink-0"
                  style={{ backgroundColor: "rgba(7, 98, 106, 0.08)" }}
                >
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0D0D0D]">
                    {editingItem ? "Редактировать PDF пособие" : "Новое PDF пособие"}
                  </h3>
                  <span className="text-xs text-[#0D0D0D]/50">
                    Привязка файлов через Google Диск или прямую ссылку
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-[#0D0D0D]/50 hover:text-[#0D0D0D] hover:bg-[#F0F2F2] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              {/* Google Drive Link */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0D0D0D] flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5 text-[#07626A]" />
                  <span>Ссылка на Google Диск / URL файла (PDF) *</span>
                </label>
                <input
                  type="url"
                  value={formData.fileUrl}
                  onChange={(e) => setFormData((p) => ({ ...p, fileUrl: e.target.value }))}
                  placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E1E1E1] bg-white text-xs text-[#0D0D0D] placeholder-[#0D0D0D]/40 focus:outline-none focus:border-[#07626A]"
                />
                <p className="text-[11px] text-[#0D0D0D]/50">
                  Вставьте стандартную ссылку «Поделиться» из Google Диска с открытым доступом на чтение.
                </p>
              </div>

              {/* Title i18n */}
              <I18nFieldEditor
                label="Название документа *"
                value={formData.title}
                onChange={(val) => setFormData((p) => ({ ...p, title: val }))}
                placeholder={{
                  ru: "Путеводитель для женщин-путешественниц",
                  kg: "Саякатчы аялдар үчүн жол көрсөткүч",
                  en: "Guidebook for Solo & Female Travelers",
                }}
                required
              />

              {/* Description i18n */}
              <I18nFieldEditor
                label="Краткое описание пособия *"
                value={formData.description}
                onChange={(val) => setFormData((p) => ({ ...p, description: val }))}
                isTextarea
                rows={3}
                placeholder={{
                  ru: "Полный справочник по безопасности, проверенным местам отдыха...",
                  kg: "Кыргызстандагы коопсуздук боюнча толук колдонмо...",
                  en: "Comprehensive manual covering safety, verified stays...",
                }}
                required
              />

              {/* Badge Editor - Full Width under Description */}
              <I18nFieldEditor
                label="Бейдж документа"
                value={formData.badge}
                onChange={(val) => setFormData((p) => ({ ...p, badge: val }))}
                placeholder={{
                  ru: "Для путешественниц",
                  kg: "Саякатчылар үчүн",
                  en: "For Travelers",
                }}
              />

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
                  className="px-6 py-2.5 rounded-xl bg-[#07626A] hover:bg-[#07626A]/90 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  {editingItem ? "Сохранить изменения" : "Добавить документ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
