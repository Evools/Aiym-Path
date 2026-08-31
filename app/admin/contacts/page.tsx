"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  PhoneCall,
  Mail,
  Phone,
  MapPin,
  Clock,
  ShieldAlert,
  Save,
  RotateCcw,
  ExternalLink,
  Plus,
  Trash2,
  AlertCircle,
} from "lucide-react";
import {
  AdminStorageService,
  AdminProjectContacts,
  AdminEmergencyContact,
  DEFAULT_CONTACTS,
} from "@/lib/services/admin-storage.service";
import { useToast } from "@/context/ToastContext";
import { I18nFieldEditor } from "@/components/features/admin/I18nFieldEditor";

export default function AdminContactsPage() {
  const toast = useToast();
  const [contacts, setContacts] = useState<AdminProjectContacts>(DEFAULT_CONTACTS);

  useEffect(() => {
    setContacts(AdminStorageService.getContacts());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    AdminStorageService.saveContacts(contacts);
    toast.success("Контакты и номера экстренных служб успешно сохранены");
  };

  const handleReset = async () => {
    const isConfirmed = await toast.confirm({
      title: "Сбросить контакты?",
      message: "Вернуть все контакты и номера экстренных служб к официальным значениям по умолчанию?",
      confirmText: "Сбросить",
      cancelText: "Отмена",
      isDestructive: true,
    });

    if (isConfirmed) {
      setContacts(DEFAULT_CONTACTS);
      AdminStorageService.saveContacts(DEFAULT_CONTACTS);
      toast.success("Контакты сброшены к значениям по умолчанию");
    }
  };

  const handleUpdateEmergencyNumber = (id: string, newNumber: string) => {
    setContacts((prev) => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.map((c) =>
        c.id === id ? { ...c, number: newNumber } : c
      ),
    }));
  };

  const handleUpdateEmergencyDesc = (id: string, newDesc: string) => {
    setContacts((prev) => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.map((c) =>
        c.id === id
          ? { ...c, description: { ...c.description, ru: newDesc } }
          : c
      ),
    }));
  };

  const handleAddCustomEmergency = () => {
    const newContact: AdminEmergencyContact = {
      id: `sos-${Date.now()}`,
      name: {
        ru: "Новая служба помощи",
        kg: "Жаңы жардам кызматы",
        en: "New Safety Hotline",
      },
      number: "+996 000 00 00 00",
      badge: { ru: "24/7", kg: "24/7", en: "24/7" },
      description: {
        ru: "Описание горячей линии помощи",
        kg: "Шашылыш жардам кызматы",
        en: "Emergency safety assistance hotline",
      },
    };

    setContacts((prev) => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, newContact],
    }));
    toast.info("Добавлена новая строка службы. Отредактируйте номер и нажмите «Сохранить».");
  };

  const handleDeleteEmergency = (id: string) => {
    setContacts((prev) => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter((c) => c.id !== id),
    }));
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-200">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E1E1E1]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(7,98,106,0.08)] text-[#07626A] text-xs font-bold mb-2">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Настройки контактов</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D0D0D] tracking-tight">
            Контакты проекта и Экстренные службы
          </h1>
          <p className="text-xs sm:text-sm text-[#0D0D0D]/65 mt-1">
            Управляйте официальными контактами проекта Aiym Path и номерами экстренных служб безопасности.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/contacts"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-[#E1E1E1] hover:border-[#07626A] text-xs font-bold text-[#0D0D0D]/75 hover:text-[#07626A] transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Страница контактов</span>
          </Link>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-[#E1E1E1] hover:border-rose-300 text-xs font-bold text-[#0D0D0D]/75 hover:text-rose-600 transition-colors cursor-pointer"
            title="Сбросить к умолчанию"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Сброс</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-8">
        {/* 2. Main Project Contacts Card */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E1E1E1] flex flex-col gap-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E1E1E1]">
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#07626A]" />
              <h2 className="text-base font-bold text-[#0D0D0D]">
                Основные контакты Aiym Path
              </h2>
            </div>
            <span className="text-[11px] text-[#0D0D0D]/50 font-medium">
              Отображаются в футере и на странице /contacts
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-[#0D0D0D] uppercase tracking-wider mb-1.5">
                Официальный Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0D0D0D]/40" />
                <input
                  type="email"
                  required
                  value={contacts.email}
                  onChange={(e) => setContacts({ ...contacts, email: e.target.value })}
                  placeholder="info@aiympath.kg"
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#E1E1E1] bg-white text-xs font-medium text-[#0D0D0D] focus:outline-none focus:border-[#07626A]"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-[#0D0D0D] uppercase tracking-wider mb-1.5">
                Основной номер телефона <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0D0D0D]/40" />
                <input
                  type="text"
                  required
                  value={contacts.phone}
                  onChange={(e) => setContacts({ ...contacts, phone: e.target.value })}
                  placeholder="+996 700 000 001"
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#E1E1E1] bg-white text-xs font-medium text-[#0D0D0D] font-mono focus:outline-none focus:border-[#07626A]"
                />
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-[#E1E1E1]">
            {/* Address I18n */}
            <I18nFieldEditor
              label="Адрес офиса / Локация"
              value={contacts.address}
              onChange={(val) =>
                setContacts((prev) => ({ ...prev, address: val }))
              }
              placeholder={{
                ru: "г. Бишкек, Кыргызская Республика",
                kg: "Бишкек ш., Кыргыз Республикасы",
                en: "Bishkek, Kyrgyz Republic",
              }}
              required
            />

            {/* Working Hours I18n */}
            <I18nFieldEditor
              label="График работы"
              value={contacts.workingHours}
              onChange={(val) =>
                setContacts((prev) => ({ ...prev, workingHours: val }))
              }
              placeholder={{
                ru: "Пн–Пт, 09:00–18:00",
                kg: "Дүй–Жум, 09:00–18:00",
                en: "Mon–Fri, 09:00–18:00",
              }}
              required
            />
          </div>
        </div>

        {/* 3. Emergency Services Management */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E1E1E1] flex flex-col gap-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E1E1E1]">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <div>
                <h2 className="text-base font-bold text-[#0D0D0D]">
                  Номера экстренных служб и горячих линий (SOS)
                </h2>
                <span className="text-[11px] text-[#0D0D0D]/50">
                  Отображаются на странице путеводителя /guide в блоке экстренной безопасности
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddCustomEmergency}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F0F2F2] hover:bg-[#07626A] text-[#07626A] hover:text-white text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Добавить службу</span>
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {contacts.emergencyContacts.map((contact) => (
              <div
                key={contact.id}
                className="p-4 rounded-2xl bg-[#FAFBFB] border border-[#E1E1E1] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#0D0D0D]">
                      {contact.name.ru}
                    </span>
                    {contact.isMain && (
                      <span className="text-[9px] font-extrabold uppercase text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                        SOS
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={contact.description.ru}
                    onChange={(e) =>
                      handleUpdateEmergencyDesc(contact.id, e.target.value)
                    }
                    placeholder="Краткое назначение службы"
                    className="w-full h-8 px-2.5 rounded-lg border border-[#E1E1E1] bg-white text-[11px] text-[#0D0D0D]/70 focus:outline-none focus:border-[#07626A]"
                  />
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
                  <div className="w-full sm:w-48">
                    <input
                      type="text"
                      required
                      value={contact.number}
                      onChange={(e) =>
                        handleUpdateEmergencyNumber(contact.id, e.target.value)
                      }
                      placeholder="Номер телефона"
                      className="w-full h-9 px-3 rounded-xl border border-[#E1E1E1] bg-white text-xs font-bold font-mono text-[#07626A] focus:outline-none focus:border-[#07626A]"
                    />
                  </div>

                  {!contact.isMain && (
                    <button
                      type="button"
                      onClick={() => handleDeleteEmergency(contact.id)}
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white transition-colors cursor-pointer"
                      title="Удалить"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Sticky Bottom Save Bar */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-[#E1E1E1] shadow-sm">
          <div className="flex items-center gap-2 text-xs text-[#0D0D0D]/60 font-medium">
            <AlertCircle className="w-4 h-4 text-[#07626A]" />
            <span>Все изменения сразу синхронизируются с публичным сайтом.</span>
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#07626A] hover:bg-[#07626A]/90 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Сохранить контакты</span>
          </button>
        </div>
      </form>
    </div>
  );
}
