"use client";

import React, { useState } from "react";
import { Phone, ShieldAlert, Check, Copy } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const EmergencySafetyBanner: React.FC = () => {
  const { language, dict } = useLanguage();
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  const emergencyContacts = [
    {
      title: language === "kg" ? "Куткаруу кызматы (ӨКМ)" : language === "en" ? "Rescue Service (MES)" : "Служба спасения (МЧС)",
      number: "112",
      badge: "24/7 Free",
      isPrimary: true,
    },
    {
      title: language === "kg" ? "Тез жардам" : language === "en" ? "Ambulance / First Aid" : "Скорая помощь",
      number: "103",
      badge: "24/7",
      isPrimary: false,
    },
    {
      title: language === "kg" ? "Туристтик милиция" : language === "en" ? "Tourist Police" : "Туристическая милиция",
      number: "+996 312 88-12-02",
      badge: "Hotline",
      isPrimary: false,
    },
  ];

  const handleCopy = (number: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(number.replace(/\s+/g, ""));
      setCopiedNumber(number);
      setTimeout(() => setCopiedNumber(null), 2000);
    }
  };

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#07626A] to-[#043E44] text-white p-7 sm:p-10 lg:p-12 shadow-xl">
          {/* Subtle Background Pattern */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 pointer-events-none flex items-center justify-end pr-10">
            <ShieldAlert className="w-80 h-80 text-white" />
          </div>

          <div className="relative z-10 max-w-3xl">
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-semibold uppercase tracking-wider mb-4 text-teal-100">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{dict.guidebook?.safetyBadge || "Безопасность"}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-3 leading-tight">
              {dict.guidebook?.sosTitle || "Экстренные службы и безопасность"}
            </h2>

            <p className="text-sm sm:text-base text-teal-100/90 leading-relaxed mb-8 max-w-2xl">
              {dict.guidebook?.sosSubtitle ||
                "Сохраните эти номера в телефон или запишите на карточку перед выходом на маршрут"}
            </p>

            {/* Emergency Contacts Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {emergencyContacts.map((contact, idx) => (
                <div
                  key={idx}
                  className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-teal-200 font-medium">
                        {contact.title}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
                        {contact.badge}
                      </span>
                    </div>

                    <div className="text-xl sm:text-2xl font-extrabold text-white mb-4 tracking-wide">
                      {contact.number}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <a
                      href={`tel:${contact.number.replace(/\s+/g, "")}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white text-[#07626A] text-xs font-bold hover:bg-teal-50 transition-colors shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{dict.guidebook?.sosCall || "Позвонить"}</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleCopy(contact.number)}
                      title={dict.guidebook?.copied || "Скопировать"}
                      className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
                    >
                      {copiedNumber === contact.number ? (
                        <Check className="w-4 h-4 text-teal-300" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
