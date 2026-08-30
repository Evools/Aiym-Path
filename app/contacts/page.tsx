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
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function ContactsPage() {
  const { dict } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("general");
  const [copiedField, setCopiedField] = useState<string | null>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
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

      {/* Main Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Direct Contacts & Interactive Map Card (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* 1. Email Card with Quick Copy */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#F7FAFA] border border-teal-100/70 hover:border-teal-200 transition-all flex items-center justify-between gap-3 group">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-[#07626A] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      {dict.contactsPage.emailDesc}
                    </p>
                    <a
                      href="mailto:hello@tumar-project.kg"
                      className="text-sm sm:text-[15px] font-bold text-gray-900 hover:text-[#07626A] transition-colors truncate block"
                    >
                      {dict.contactsPage.emailTitle}
                    </a>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy("hello@tumar-project.kg", "email")}
                  title="Скопировать email"
                  className="p-2 rounded-lg text-gray-400 hover:text-[#07626A] hover:bg-white transition-colors shrink-0 cursor-pointer"
                >
                  {copiedField === "email" ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* 2. Phone Card with Quick Call/Copy */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#F7FAFA] border border-teal-100/70 hover:border-teal-200 transition-all flex items-center justify-between gap-3 group">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-[#07626A] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      {dict.contactsPage.phoneDesc}
                    </p>
                    <a
                      href="tel:+996700000000"
                      className="text-sm sm:text-[15px] font-bold text-gray-900 hover:text-[#07626A] transition-colors block"
                    >
                      {dict.contactsPage.phoneTitle}
                    </a>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy("+996 700 000 000", "phone")}
                  title="Скопировать телефон"
                  className="p-2 rounded-lg text-gray-400 hover:text-[#07626A] hover:bg-white transition-colors shrink-0 cursor-pointer"
                >
                  {copiedField === "phone" ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* 3. Address Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#F7FAFA] border border-teal-100/70 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-[#07626A] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    {dict.contactsPage.addressDesc}
                  </p>
                  <p className="text-sm sm:text-[15px] font-bold text-gray-900">
                    {dict.contactsPage.addressTitle}
                  </p>
                </div>
              </div>

              {/* 4. Map Preview with Bishkek OpenStreetMap Embed */}
              <div className="relative w-full h-[210px] sm:h-[230px] rounded-2xl overflow-hidden border border-gray-200/90 shadow-xs">
                <iframe
                  title="Bishkek Map"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=74.5500%2C42.8500%2C74.6300%2C42.8900&amp;layer=mapnik"
                  className="w-full h-full border-0 pointer-events-auto"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-800 shadow-xs flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#07626A]" />
                  <span>Бишкек, Кыргызстан</span>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-100/80 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#07626A] shrink-0" />
                <p className="text-xs text-gray-600 leading-snug">
                  Официальная поддержка и ответы в течение 24 рабочих часов.
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

                    {/* Name & Phone Grid */}
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

                      {/* Email */}
                      <div>
                        <label
                          htmlFor="contact-email"
                          className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
                        >
                          {dict.contactsPage.emailLabel} <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="email"
                            id="contact-email"
                            required
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({ ...formData, email: e.target.value })
                            }
                            placeholder={dict.contactsPage.emailPlaceholder}
                            className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white focus:bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#07626A] focus:ring-1 focus:ring-[#07626A] transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Optional Phone Field */}
                    <div>
                      <label
                        htmlFor="contact-phone"
                        className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
                      >
                        Номер телефона <span className="text-gray-400 font-normal normal-case">(необязательно)</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          id="contact-phone"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          placeholder="+996 (___) __-__-__"
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
