"use client";

import React from "react";
import { Phone, Mail, MapPin, Send, MessageSquare } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { InnerPageBanner } from "@/components/ui/InnerPageBanner";

export default function ContactsPage() {
  const { dict } = useLanguage();

  const contacts = [
    {
      icon: <MapPin className="w-5 h-5 text-[#07626A]" />,
      title: "Адрес офиса",
      value: "г. Бишкек, Кыргызская Республика",
      desc: "Центральный координационный хаб",
      href: null,
    },
    {
      icon: <Mail className="w-5 h-5 text-[#07626A]" />,
      title: "Электронная почта",
      value: "info@aiympath.kg",
      desc: "По вопросам партнерства и сотрудничества",
      href: "mailto:info@aiympath.kg",
    },
    {
      icon: <Phone className="w-5 h-5 text-[#07626A]" />,
      title: "Горячая линия",
      value: "+996 700 000 001",
      desc: "Консультации и поддержка путешественниц",
      href: "tel:+996700000001",
    },
    {
      icon: <Send className="w-5 h-5 text-[#07626A]" />,
      title: "Telegram",
      value: "@web_commander",
      desc: "Прямая связь с координатором в мессенджере",
      href: "https://t.me/web_commander",
    },
  ];

  return (
    <div className="w-full bg-white min-h-screen">
      <InnerPageBanner
        breadcrumbLabel={dict.nav.contacts}
        badge={dict.nav.contacts}
        badgeIcon={<MessageSquare className="w-3.5 h-3.5" />}
        titlePrefix="СВЯЗАТЬСЯ С"
        titleHighlight="AIYM PATH"
        subtitle="Мы всегда на связи с путешественницами, гидами и партнерами проекта в Кыргызстане."
      />

      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Contacts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contacts.map((c, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md hover:border-teal-100 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center mb-4">
                    {c.icon}
                  </div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    {c.title}
                  </h3>
                  {c.href ? (
                    <a
                      href={c.href}
                      target={c.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="text-base font-bold text-gray-900 hover:text-[#07626A] transition-colors block mb-2"
                    >
                      {c.value}
                    </a>
                  ) : (
                    <p className="text-base font-bold text-gray-900 mb-2">{c.value}</p>
                  )}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>

          {/* Emergency Notice */}
          <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase mb-1">
                <span>Экстренная помощь</span>
              </div>
              <h4 className="text-base font-bold text-gray-900">
                Единая служба спасения МЧС Кыргызской Республики
              </h4>
              <p className="text-xs text-gray-600 mt-0.5">
                Круглосуточный бесплатный номер для экстренных ситуаций в горах и на маршрутах
              </p>
            </div>
            <a
              href="tel:112"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold shadow-xs transition-colors shrink-0"
            >
              <span>Позвонить 112</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
