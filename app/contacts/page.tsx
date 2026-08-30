"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  ArrowLeft,
  Send,
  User,
  MessageSquare,
  Copy,
  Check,
  ChevronDown,
  HelpCircle,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function ContactsPage() {
  const { dict } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("general");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

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
    // If user pasted with 996 or 0
    if (raw.startsWith("996")) {
      raw = raw.slice(3);
    } else if (raw.startsWith("0")) {
      raw = raw.slice(1);
    }
    setPhoneDigits(raw.slice(0, 9));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !phoneDigits.trim() || !formData.message.trim()) {
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
      setPhoneDigits("");
    }, 600);
  };

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Top Banner with White Background & Kyrgyz Ornament */}
      <section className="relative w-full bg-white pt-8 sm:pt-12 pb-16 sm:pb-20 overflow-hidden border-b border-gray-100">
        {/* Kyrgyz national ornament on the left */}
        <div className="absolute top-0 left-0 bottom-0 z-0 w-full max-w-[280px] sm:max-w-[380px] lg:max-w-[480px] pointer-events-none select-none overflow-hidden flex items-center justify-start opacity-70">
          <div className="relative w-full h-full">
            <Image
              src="/images/banner/uzor.webp"
              alt="Кыргызский узор"
              fill
              priority
              className="object-contain object-left"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-500 hover:text-[#07626A] transition-colors mb-6 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{dict.nav.home}</span>
          </Link>

          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-[#07626A] text-xs font-semibold uppercase mb-4">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{dict.contactsPage.badge}</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-gray-900 tracking-tight uppercase leading-[1.15] mb-4">
              <span>{dict.contactsPage.titlePrefix} </span>
              <span style={{ color: "#07626A" }}>{dict.contactsPage.titleHighlight}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
              {dict.contactsPage.subtitle}
            </p>
          </div>
        </div>

        {/* Bottom Ragged Edge Effect */}
        <div className="absolute -bottom-1 left-0 right-0 w-full h-12 sm:h-16 lg:h-20 z-10 pointer-events-none select-none">
          <div className="relative w-full h-full">
            <Image
              src="/images/banner/effect.webp"
              alt="Edge effect"
              fill
              priority
              className="object-cover object-bottom"
            />
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Direct Contacts & FAQ Accordion (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* 1. Email Card */}
              <div className="p-4 rounded-2xl bg-white border border-gray-200/90 hover:border-teal-200 hover:shadow-xs transition-all flex items-center justify-between gap-3 group">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-100/80 text-[#07626A] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-500 mb-0.5">
                      {dict.contactsPage.emailDesc}
                    </p>
                    <a
                      href="mailto:hello@tumar-project.kg"
                      className="text-[15px] font-bold text-gray-900 hover:text-[#07626A] transition-colors truncate block"
                    >
                      {dict.contactsPage.emailTitle}
                    </a>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy("hello@tumar-project.kg", "email")}
                  title="Скопировать email"
                  className="p-2 rounded-xl text-gray-400 hover:text-[#07626A] hover:bg-gray-50 transition-colors shrink-0 cursor-pointer"
                >
                  {copiedField === "email" ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* 2. Phone Card */}
              <div className="p-4 rounded-2xl bg-white border border-gray-200/90 hover:border-teal-200 hover:shadow-xs transition-all flex items-center justify-between gap-3 group">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-100/80 text-[#07626A] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-500 mb-0.5">
                      {dict.contactsPage.phoneDesc}
                    </p>
                    <a
                      href="tel:+996700000000"
                      className="text-[15px] font-bold text-gray-900 hover:text-[#07626A] transition-colors block"
                    >
                      {dict.contactsPage.phoneTitle}
                    </a>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy("+996 700 000 000", "phone")}
                  title="Скопировать телефон"
                  className="p-2 rounded-xl text-gray-400 hover:text-[#07626A] hover:bg-gray-50 transition-colors shrink-0 cursor-pointer"
                >
                  {copiedField === "phone" ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* 3. Address Card */}
              <div className="p-4 rounded-2xl bg-white border border-gray-200/90 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-100/80 text-[#07626A] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-0.5">
                    {dict.contactsPage.addressDesc}
                  </p>
                  <p className="text-[15px] font-bold text-gray-900">
                    {dict.contactsPage.addressTitle}
                  </p>
                </div>
              </div>

              {/* 4. Mini FAQ Accordion replacing Map */}
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-3 px-1">
                  <HelpCircle className="w-4 h-4 text-[#07626A]" />
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    {dict.contactsPage.faqTitle}
                  </h4>
                </div>

                <div className="space-y-2.5">
                  {dict.contactsPage.faqs.map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;

                    return (
                      <div
                        key={idx}
                        className="rounded-2xl border border-gray-200/80 bg-white overflow-hidden transition-all duration-200"
                      >
                        <button
                          type="button"
                          onClick={() => toggleFaq(idx)}
                          className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-[13px] font-semibold text-gray-900 hover:text-[#07626A] transition-colors cursor-pointer"
                        >
                          <span>{faq.q}</span>
                          <ChevronDown
                            className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
                              isOpen ? "rotate-180 text-[#07626A]" : ""
                            }`}
                          />
                        </button>

                        {isOpen && (
                          <div className="px-4 pb-4 pt-0">
                            <p className="text-xs text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
                              {faq.a}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Response Time Notice */}
              <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-100/80 flex items-center gap-3">
                <Clock className="w-4.5 h-4.5 text-[#07626A] shrink-0" />
                <p className="text-xs text-gray-600 leading-snug">
                  Время ответа: в течение 24 рабочих часов (Пн–Пт, 09:00–18:00).
                </p>
              </div>

            </div>

            {/* Right Column: Enhanced Modern Contact Form (7 cols) */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-gray-200/90 bg-white p-6 sm:p-8 lg:p-9 shadow-xs">
                
                {submitted ? (
                  <div className="py-12 sm:py-16 text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-teal-50 text-[#07626A] flex items-center justify-center mx-auto border border-teal-100 shadow-xs">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div className="max-w-md mx-auto">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {dict.contactsPage.successMessage}
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed mb-6">
                        Мы получили ваше обращение и ответим на указанный email в ближайшее рабочее время.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-2.5 rounded-xl bg-[#07626A] hover:bg-[#065057] text-white text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-[0.98]"
                    >
                      Отправить ещё одно сообщение
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Header of Form */}
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight mb-1">
                        Напишите нам
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Выберите тему обращения и оставьте контакты для обратной связи.
                      </p>
                    </div>

                    {/* Topic Selector Chips */}
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
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
                              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-[#07626A] text-white shadow-xs"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200/80"
                              }`}
                            >
                              {t.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Name & Phone Grid (Both Required) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
                        >
                          {dict.contactsPage.nameLabel} <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            id="contact-name"
                            required
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            placeholder={dict.contactsPage.namePlaceholder}
                            className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white focus:bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#07626A] focus:ring-1 focus:ring-[#07626A] transition-all"
                          />
                        </div>
                      </div>

                      {/* Phone (Required with fixed +996 prefix) */}
                      <div>
                        <label
                          htmlFor="contact-phone"
                          className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
                        >
                          Номер телефона <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative flex items-center">
                          <div className="absolute left-3.5 flex items-center text-xs sm:text-sm font-semibold text-gray-700 pointer-events-none select-none border-r border-gray-200 pr-2.5">
                            <span>+996</span>
                          </div>
                          <input
                            type="tel"
                            id="contact-phone"
                            required
                            value={formatLocalDigits(phoneDigits)}
                            onChange={handlePhoneChange}
                            placeholder="700 000 000"
                            className="w-full h-11 pl-18 pr-4 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white focus:bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#07626A] focus:ring-1 focus:ring-[#07626A] transition-all font-medium tracking-wide"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Email Field (Optional) */}
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
                      >
                        {dict.contactsPage.emailLabel} <span className="text-gray-400 font-normal normal-case">(необязательно)</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          id="contact-email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder={dict.contactsPage.emailPlaceholder}
                          className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white focus:bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#07626A] focus:ring-1 focus:ring-[#07626A] transition-all"
                        />
                      </div>
                    </div>

                    {/* Message Textarea */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label
                          htmlFor="contact-message"
                          className="block text-xs font-bold text-gray-700 uppercase tracking-wider"
                        >
                          {dict.contactsPage.messageLabel} <span className="text-rose-500">*</span>
                        </label>
                        <span className="text-[11px] text-gray-400">
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
                          className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white focus:bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#07626A] focus:ring-1 focus:ring-[#07626A] transition-all resize-y min-h-[120px] sm:min-h-[140px]"
                        />
                      </div>
                    </div>

                    {/* Submit Bar */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <p className="text-[11px] text-gray-400 text-center sm:text-left leading-tight">
                        Нажимая «{dict.contactsPage.submit}», вы даете согласие на обработку обращения.
                      </p>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto px-8 py-3 rounded-xl text-white text-sm font-semibold transition-all active:scale-[0.98] cursor-pointer hover:opacity-95 shadow-xs flex items-center justify-center gap-2 shrink-0 disabled:opacity-70"
                        style={{ backgroundColor: "#07626A" }}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Отправка...</span>
                          </>
                        ) : (
                          <>
                            <span>{dict.contactsPage.submit}</span>
                            <Send className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>

                  </form>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
