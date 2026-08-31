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
    },
    {
      title: language === "kg" ? "Тез жардам" : language === "en" ? "Ambulance / First Aid" : "Скорая помощь",
      number: "103",
      badge: "24/7",
    },
    {
      title: language === "kg" ? "Туристтик милиция" : language === "en" ? "Tourist Police" : "Туристическая милиция",
      number: "+996 312 88-12-02",
      badge: "Hotline",
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
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-[#E1E1E1]">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-2xl bg-[#07626A] text-white p-6 sm:p-8 lg:p-10">
          <div className="max-w-3xl">
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold uppercase tracking-wider mb-4 text-white">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{dict.guidebook?.safetyBadge || "Безопасность"}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2 leading-tight">
              {dict.guidebook?.sosTitle || "Экстренные службы и безопасность"}
            </h2>

            <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-6 max-w-2xl">
              {dict.guidebook?.sosSubtitle ||
                "Сохраните эти номера в телефон или запишите на карточку перед выходом на маршрут"}
            </p>

            {/* Emergency Contacts Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {emergencyContacts.map((contact, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white/10 border border-white/20 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-white/80 font-medium">
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
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white text-[#07626A] text-xs font-bold hover:bg-white/90 transition-colors"
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
                        <Check className="w-4 h-4 text-white" />
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
