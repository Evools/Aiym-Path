"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  User,
  MessageSquare,
  Copy,
  Check,
  ChevronDown,
  HelpCircle,
  Clock,
  AlertCircle,
  X,
  ArrowUpRight,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { InnerPageBanner } from "@/components/ui/InnerPageBanner";
import { AdminStorageService, AdminProjectContacts, DEFAULT_CONTACTS } from "@/lib/services/admin-storage.service";

export default function ContactsPage() {
  const { language, dict } = useLanguage();
  const [contactsData, setContactsData] = useState<AdminProjectContacts>(DEFAULT_CONTACTS);
  const [selectedTopic, setSelectedTopic] = useState("general");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [showUnavailableModal, setShowUnavailableModal] = useState<boolean>(false);

  useEffect(() => {
    setContactsData(AdminStorageService.getContacts());
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const topics = [
    { id: "general", label: "Общие вопросы" },
    { id: "partnership", label: "Партнёрство" },
    { id: "guide", label: "Стать гидом / Обучение" },
    { id: "safety", label: "Безопасность и маршруты" },
  ];

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const [phoneDigits, setPhoneDigits] = useState("");

  const formatLocalDigits = (digitsOnly: string): string => {
    const d = digitsOnly.slice(0, 9);
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
    return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, "");
    if (raw.startsWith("996")) {
      raw = raw.slice(3);
    } else if (raw.startsWith("0")) {
      raw = raw.slice(1);
    }
    setPhoneDigits(raw.slice(0, 9));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowUnavailableModal(true);
  };

  return (
    <div className="w-full bg-white min-h-screen">
      <InnerPageBanner
        breadcrumbLabel={dict.nav.contacts}
        badge={dict.contactsPage.badge}
        badgeIcon={<MessageSquare className="w-3.5 h-3.5" />}
        titlePrefix={dict.contactsPage.titlePrefix}
        titleHighlight={dict.contactsPage.titleHighlight}
        subtitle={dict.contactsPage.subtitle}
      />

      {/* Main Content Section */}
      <section className="py-10 sm:py-14 lg:py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

            {/* Left Column: Compact Direct Contacts & Smooth FAQ (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">

              {/* Consolidated Compact Contact Card */}
              <div className="p-5 rounded-2xl bg-white border border-[#E1E1E1] hover:border-[rgba(7,98,106,0.25)] transition-colors flex flex-col gap-3.5">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#E1E1E1]">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-[#0D0D0D]">
                      Общие вопросы и партнёрство
                    </h3>
                    <span className="text-[11px] text-[#0D0D0D]/60 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-[#07626A]" />
                      <span>{contactsData.workingHours[language] || contactsData.workingHours.ru}</span>
                    </span>
                  </div>
                </div>

                {/* Email Row */}
                <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#F0F2F2] border border-[#E1E1E1] hover:border-[rgba(7,98,106,0.20)] transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[#07626A] shrink-0 border border-[#E1E1E1]">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <a
                        href={`mailto:${contactsData.email}`}
                        className="text-xs font-bold text-[#0D0D0D] hover:text-[#07626A] transition-colors truncate block"
                      >
                        {contactsData.email}
                      </a>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(contactsData.email, "email")}
                    title="Скопировать email"
                    className="p-1.5 rounded-lg text-[#0D0D0D]/50 hover:text-[#07626A] hover:bg-white transition-colors shrink-0 cursor-pointer"
                  >
                    {copiedField === "email" ? (
                      <Check className="w-3.5 h-3.5 text-[#07626A]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Phone Row */}
                <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#F0F2F2] border border-[#E1E1E1] hover:border-[rgba(7,98,106,0.20)] transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[#07626A] shrink-0 border border-[#E1E1E1]">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <a
                        href={`tel:${contactsData.phone.replace(/[^0-9+]/g, "")}`}
                        className="text-xs font-bold text-[#0D0D0D] hover:text-[#07626A] transition-colors block"
                      >
                        {contactsData.phone}
                      </a>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(contactsData.phone, "phone")}
                    title="Скопировать телефон"
                    className="p-1.5 rounded-lg text-[#0D0D0D]/50 hover:text-[#07626A] hover:bg-white transition-colors shrink-0 cursor-pointer"
                  >
                    {copiedField === "phone" ? (
                      <Check className="w-3.5 h-3.5 text-[#07626A]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Address Row */}
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#F0F2F2] border border-[#E1E1E1] hover:border-[rgba(7,98,106,0.20)] transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[#07626A] shrink-0 border border-[#E1E1E1] mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#0D0D0D]">
                      {contactsData.address[language] || contactsData.address.ru}
                    </p>
                    <p className="text-[11px] text-[#0D0D0D]/60 mt-0.5">
                      Фонд Ага Хана (AKF) / MSDSP Кыргызстан • Программа GESI
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. Smooth FAQ Accordion */}
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-3 px-1">
                  <HelpCircle className="w-4 h-4 text-[#07626A]" />
                  <h4 className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
                    {dict.contactsPage.faqTitle}
                  </h4>
                </div>

                <div className="space-y-2">
                  {dict.contactsPage.faqs.map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;

                    return (
                      <div
                        key={idx}
                        className={`rounded-2xl border bg-white overflow-hidden transition-colors duration-200 ${isOpen
                          ? "border-[rgba(7,98,106,0.25)]"
                          : "border-[#E1E1E1] hover:border-[rgba(7,98,106,0.20)]"
                          }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleFaq(idx)}
                          className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-[13px] font-bold text-[#0D0D0D] transition-colors cursor-pointer"
                        >
                          <span>{faq.q}</span>
                          <div
                            className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 ease-out ${isOpen ? "rotate-180 bg-[rgba(7,98,106,0.10)] text-[#07626A]" : "text-[#0D0D0D]/50"
                              }`}
                          >
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </button>

                        {/* Smooth Animated Height Grid */}
                        <div
                          className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                            }`}
                        >
                          <div className="overflow-hidden">
                            <div className="px-4 pb-4 pt-0">
                              <p className="text-xs text-[#0D0D0D]/75 leading-relaxed border-t border-[#E1E1E1] pt-3 font-normal">
                                {faq.a}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right Column: Contact Form (7 cols) */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-[#E1E1E1] bg-white p-6 sm:p-8 lg:p-9">

                <form onSubmit={handleSubmit} className="space-y-5">

                  {/* Header of Form with Info Button */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-[#0D0D0D] tracking-tight mb-1">
                        Напишите нам
                      </h3>
                      <p className="text-xs sm:text-sm text-[#0D0D0D]/70">
                        Выберите тему обращения и оставьте контакты для обратной связи.
                      </p>
                    </div>

                    {/* Subtle Info Icon Trigger with ripple pulse */}
                    <button
                      type="button"
                      onClick={() => setShowUnavailableModal(true)}
                      className="p-2 rounded-xl text-[#07626A] bg-white hover:bg-[#F3F3F3] border border-[#E1E1E1] hover:border-[#07626A] transition-colors cursor-pointer shrink-0 button-pulse"
                      title="Информация о форме"
                    >
                      <AlertCircle className="w-4 h-4 text-[#07626A]" />
                    </button>
                  </div>

                  {/* Topic Selector Chips */}
                  <div>
                    <label className="block text-xs font-bold text-[#0D0D0D]/60 uppercase tracking-wider mb-2">
                      Тема обращения
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {topics.map((t) => {
                        const isSelected = selectedTopic === t.id;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setSelectedTopic(t.id)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${isSelected
                              ? "bg-[#07626A] text-white border-[#07626A]"
                              : "bg-[#F3F3F3] text-[#0D0D0D]/75 border-[#E1E1E1] hover:border-[rgba(7,98,106,0.20)]"
                              }`}
                          >
                            {t.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Name & Phone Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-xs font-bold text-[#0D0D0D] uppercase tracking-wider mb-1.5"
                      >
                        {dict.contactsPage.nameLabel} <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0D0D0D]/40" />
                        <input
                          type="text"
                          id="contact-name"
                          required
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder={dict.contactsPage.namePlaceholder}
                          className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#E1E1E1] bg-white hover:border-[rgba(7,98,106,0.25)] focus:border-[#07626A] text-sm text-[#0D0D0D] placeholder-[#0D0D0D]/40 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label
                        htmlFor="contact-phone"
                        className="block text-xs font-bold text-[#0D0D0D] uppercase tracking-wider mb-1.5"
                      >
                        Номер телефона <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <div className="absolute left-3.5 flex items-center text-xs sm:text-sm font-semibold text-[#0D0D0D] pointer-events-none select-none border-r border-[#E1E1E1] pr-2.5">
                          <span>+996</span>
                        </div>
                        <input
                          type="tel"
                          id="contact-phone"
                          required
                          value={formatLocalDigits(phoneDigits)}
                          onChange={handlePhoneChange}
                          placeholder="700 000 000"
                          className="w-full h-11 pl-18 pr-4 rounded-xl border border-[#E1E1E1] bg-white hover:border-[rgba(7,98,106,0.25)] focus:border-[#07626A] text-sm text-[#0D0D0D] placeholder-[#0D0D0D]/40 focus:outline-none transition-colors font-medium tracking-wide"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-bold text-[#0D0D0D] uppercase tracking-wider mb-1.5"
                    >
                      {dict.contactsPage.emailLabel} <span className="text-[#0D0D0D]/50 font-normal normal-case">(необязательно)</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0D0D0D]/40" />
                      <input
                        type="email"
                        id="contact-email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder={dict.contactsPage.emailPlaceholder}
                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#E1E1E1] bg-white hover:border-[rgba(7,98,106,0.25)] focus:border-[#07626A] text-sm text-[#0D0D0D] placeholder-[#0D0D0D]/40 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Message Textarea */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="contact-message"
                        className="block text-xs font-bold text-[#0D0D0D] uppercase tracking-wider"
                      >
                        {dict.contactsPage.messageLabel} <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[11px] text-[#0D0D0D]/40">
                        {formData.message.length} символов
                      </span>
                    </div>
                    <div className="relative">
                      <textarea
                        id="contact-message"
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        placeholder={dict.contactsPage.messagePlaceholder}
                        className="w-full p-4 rounded-xl border border-[#E1E1E1] bg-white hover:border-[rgba(7,98,106,0.25)] focus:border-[#07626A] text-sm text-[#0D0D0D] placeholder-[#0D0D0D]/40 focus:outline-none transition-colors resize-y min-h-[110px]"
                      />
                    </div>
                  </div>

                  {/* Submit Bar */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-[11px] text-[#0D0D0D]/50 text-center sm:text-left leading-tight">
                      Нажимая «{dict.contactsPage.submit}», вы даете согласие на обработку обращения.
                    </p>

                    <button
                      type="submit"
                      className="w-full sm:w-auto px-8 py-3 rounded-xl text-white text-xs font-bold transition-colors hover:bg-[#07626A]/90 cursor-pointer flex items-center justify-center gap-2 shrink-0 bg-[#07626A]"
                    >
                      <span>{dict.contactsPage.submit}</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </form>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Modal: Form Temporarily Unavailable Notice */}
      {showUnavailableModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-[#E1E1E1] animate-in zoom-in-95 duration-150 flex flex-col gap-5 relative">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowUnavailableModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-[#0D0D0D]/50 hover:text-[#0D0D0D] hover:bg-[#F3F3F3] transition-colors cursor-pointer"
              title="Закрыть"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header with Icon Badge */}
            <div className="flex items-start gap-3.5 pr-8">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-[#07626A] shrink-0 border border-[rgba(7,98,106,0.15)]"
                style={{ backgroundColor: "rgba(7, 98, 106, 0.08)" }}
              >
                <AlertCircle className="w-5 h-5 text-[#07626A]" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-[#07626A] tracking-wider block mb-0.5">
                  Уведомление
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[#0D0D0D] leading-snug">
                  Форма временно не работает
                </h3>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-[13px] text-[#0D0D0D]/75 leading-relaxed font-normal">
              Данная форма обратной связи временно находится на техническом обслуживании. Пожалуйста, напишите нам напрямую на почту или свяжитесь по номеру телефона:
            </p>

            {/* Direct Contact Cards */}
            <div className="flex flex-col gap-2.5">
              {/* Email Card */}
              <a
                href={`mailto:${contactsData.email}`}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#E1E1E1] hover:border-[rgba(7,98,106,0.30)] transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-[#07626A] shrink-0 border border-[#E1E1E1]"
                    style={{ backgroundColor: "rgba(7, 98, 106, 0.06)" }}
                  >
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-[#0D0D0D]/50 tracking-wider block">
                      Электронная почта
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#0D0D0D] group-hover:text-[#07626A] transition-colors truncate block">
                      {contactsData.email}
                    </span>
                  </div>
                </div>

                <div className="px-3 py-1.5 rounded-lg bg-[#F0F2F2] group-hover:bg-[#07626A] text-[#07626A] group-hover:text-white text-[11px] font-bold transition-colors shrink-0 flex items-center gap-1">
                  <span>Написать</span>
                  <ArrowUpRight className="w-3 h-3" />
                </div>
              </a>

              {/* Phone Card */}
              <a
                href={`tel:${contactsData.phone.replace(/[^0-9+]/g, "")}`}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#E1E1E1] hover:border-[rgba(7,98,106,0.30)] transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-[#07626A] shrink-0 border border-[#E1E1E1]"
                    style={{ backgroundColor: "rgba(7, 98, 106, 0.06)" }}
                  >
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-[#0D0D0D]/50 tracking-wider block">
                      Прямой телефон
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#0D0D0D] group-hover:text-[#07626A] transition-colors block">
                      {contactsData.phone}
                    </span>
                  </div>
                </div>

                <div className="px-3 py-1.5 rounded-lg bg-[#F0F2F2] group-hover:bg-[#07626A] text-[#07626A] group-hover:text-white text-[11px] font-bold transition-colors shrink-0 flex items-center gap-1">
                  <span>Позвонить</span>
                  <ArrowUpRight className="w-3 h-3" />
                </div>
              </a>
            </div>

            {/* Bottom Button */}
            <button
              type="button"
              onClick={() => setShowUnavailableModal(false)}
              className="w-full py-3 rounded-xl bg-[#07626A] text-white text-xs font-bold hover:bg-[#07626A]/90 transition-colors cursor-pointer"
            >
              Понятно
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
