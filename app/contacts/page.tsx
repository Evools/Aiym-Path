"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, CheckCircle2, ArrowLeft, Send } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function ContactsPage() {
  const { dict } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      return;
    }
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
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

      {/* Contacts Main Section (2-Columns Matching Figma Screenshot) */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: 3 Contact Info Cards & Map Preview (5.5 cols) */}
            <div className="lg:col-span-6 space-y-4">
              
              {/* 1. Email Card */}
              <a
                href="mailto:hello@tumar-project.kg"
                className="flex items-center gap-4 p-4 sm:p-4.5 rounded-2xl bg-[#F4F8F8] border border-teal-50/80 hover:border-teal-100 hover:shadow-xs transition-all group"
              >
                <div className="w-11 h-11 rounded-full bg-[#07626A] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-[15px] font-bold text-gray-900 group-hover:text-[#07626A] transition-colors truncate">
                    {dict.contactsPage.emailTitle}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {dict.contactsPage.emailDesc}
                  </p>
                </div>
              </a>

              {/* 2. Phone Card */}
              <a
                href="tel:+996700000000"
                className="flex items-center gap-4 p-4 sm:p-4.5 rounded-2xl bg-[#F4F8F8] border border-teal-50/80 hover:border-teal-100 hover:shadow-xs transition-all group"
              >
                <div className="w-11 h-11 rounded-full bg-[#07626A] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-[15px] font-bold text-gray-900 group-hover:text-[#07626A] transition-colors">
                    {dict.contactsPage.phoneTitle}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {dict.contactsPage.phoneDesc}
                  </p>
                </div>
              </a>

              {/* 3. Address Card */}
              <div className="flex items-center gap-4 p-4 sm:p-4.5 rounded-2xl bg-[#F4F8F8] border border-teal-50/80">
                <div className="w-11 h-11 rounded-full bg-[#07626A] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-[15px] font-bold text-gray-900">
                    {dict.contactsPage.addressTitle}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {dict.contactsPage.addressDesc}
                  </p>
                </div>
              </div>

              {/* 4. Map Preview Embed (Bishkek, Kyrgyzstan) */}
              <div className="relative w-full h-[200px] sm:h-[220px] rounded-2xl overflow-hidden border border-gray-200/80 shadow-xs">
                <iframe
                  title="Bishkek Map"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=74.5500%2C42.8500%2C74.6300%2C42.8900&amp;layer=mapnik"
                  className="w-full h-full border-0 pointer-events-auto"
                  loading="lazy"
                />
              </div>

            </div>

            {/* Right Column: Contact Form (6.5 cols) */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs">
                {submitted ? (
                  <div className="py-12 text-center">
                    <div className="w-12 h-12 rounded-full bg-teal-50 text-[#07626A] flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {dict.contactsPage.successMessage}
                    </h3>
                    <p className="text-xs text-gray-500 max-w-xs mx-auto mb-6">
                      Мы свяжемся с вами в ближайшее рабочее время.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-700 transition-colors cursor-pointer"
                    >
                      Отправить еще сообщение
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name Field */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-semibold text-gray-900 mb-2"
                      >
                        {dict.contactsPage.nameLabel}
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder={dict.contactsPage.namePlaceholder}
                        className="w-full h-11 sm:h-12 px-4 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#07626A] focus:ring-1 focus:ring-[#07626A] transition-colors"
                      />
                    </div>

                    {/* Email Field */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-gray-900 mb-2"
                      >
                        {dict.contactsPage.emailLabel}
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder={dict.contactsPage.emailPlaceholder}
                        className="w-full h-11 sm:h-12 px-4 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#07626A] focus:ring-1 focus:ring-[#07626A] transition-colors"
                      />
                    </div>

                    {/* Message Field */}
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-semibold text-gray-900 mb-2"
                      >
                        {dict.contactsPage.messageLabel}
                      </label>
                      <textarea
                        id="message"
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        placeholder={dict.contactsPage.messagePlaceholder}
                        className="w-full p-4 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#07626A] focus:ring-1 focus:ring-[#07626A] transition-colors resize-y min-h-[140px] sm:min-h-[160px]"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-1">
                      <button
                        type="submit"
                        className="px-7 py-3 rounded-xl text-white text-sm font-medium transition-all active:scale-[0.98] cursor-pointer hover:opacity-95 shadow-xs"
                        style={{ backgroundColor: "#07626A" }}
                      >
                        {dict.contactsPage.submit}
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
