"use client";

import React, { useState } from "react";
import { Phone, ShieldAlert, Check, Copy, Info } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface EmergencyContact {
  id: string;
  name: {
    ru: string;
    kg: string;
    en: string;
  };
  number: string;
  badge: {
    ru: string;
    kg: string;
    en: string;
  };
  description: {
    ru: string;
    kg: string;
    en: string;
  };
  isMain?: boolean;
}

export const EmergencySafetyBanner: React.FC = () => {
  const { language, dict } = useLanguage();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const contacts: EmergencyContact[] = [
    {
      id: "sos-112",
      name: {
        ru: "Единая служба спасения (МЧС КР)",
        kg: "Бирдиктүү куткаруу кызматы (ӨКМ)",
        en: "Emergency Dispatch (MES KR)",
      },
      number: "112",
      badge: {
        ru: "24/7 • Бесплатно",
        kg: "24/7 • Акысыз",
        en: "24/7 • Free Call",
      },
      description: {
        ru: "Работает со всех операторов даже без SIM-карты",
        kg: "SIM-картасыз да бардык операторлордон иштейт",
        en: "Accessible across all carriers even without a SIM",
      },
      isMain: true,
    },
    {
      id: "sos-103",
      name: {
        ru: "Скорая медицинская помощь",
        kg: "Тез медициналык жардам",
        en: "Ambulance & Medical Aid",
      },
      number: "103",
      badge: {
        ru: "Круглосуточно",
        kg: "Күнү-түнү",
        en: "24/7 Service",
      },
      description: {
        ru: "Неотложная доврачебная и врачебная помощь",
        kg: "Шашылыш дарыгерлик жардам көрсөтүү",
        en: "Emergency and acute wilderness trauma support",
      },
    },
    {
      id: "sos-police",
      name: {
        ru: "Туристическая милиция",
        kg: "Туристтик милиция",
        en: "Tourist Police Hotline",
      },
      number: "+996 312 88-12-02",
      badge: {
        ru: "Горячая линия",
        kg: "Түз байланыш",
        en: "Hotline",
      },
      description: {
        ru: "Помощь туристам, координация и безопасность",
        kg: "Туристтерге жардам жана коопсуздукту камсыздоо",
        en: "Assistance to travelers, security & coordination",
      },
    },
  ];

  const handleCopy = (number: string, id: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(number.replace(/\s+/g, ""));
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const dispatchTips = [
    {
      title: language === "kg" ? "1. GPS координаттар" : language === "en" ? "1. GPS Coordinates" : "1. GPS-координаты",
      text: language === "kg" ? "Оффлайн картадан так жайгашкан жериңизди айтыңыз" : language === "en" ? "State exact coordinates from your offline map" : "Назовите точные координаты из офлайн-карты",
    },
    {
      title: language === "kg" ? "2. Адамдардын саны" : language === "en" ? "2. Group Size & Status" : "2. Состав группы",
      text: language === "kg" ? "Топтун санын жана жабыркагандардын абалын билдириңиз" : language === "en" ? "Report headcount and injuries if any" : "Укажите количество людей и характер травм",
    },
    {
      title: language === "kg" ? "3. Жердин белгилери" : language === "en" ? "3. Terrain Landmarks" : "3. Ориентиры местности",
      text: language === "kg" ? "Капчыгай, суу, ашуу же белгилүү чокуларды атаңыз" : language === "en" ? "Mention gorge names, rivers, passes, or peaks" : "Назовите ущелье, реку, перевал или видимые вершины",
    },
    {
      title: language === "kg" ? "4. Байланышта болуңуз" : language === "en" ? "4. Stay in Place" : "4. Оставайтесь на связи",
      text: language === "kg" ? "Зарылчылык жок болсо турган ордуңуздан жылбаңыз" : language === "en" ? "Do not relocate unless instructed by rescuers" : "Не меняйте локацию без команды спасателей",
    },
  ];

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-[#E1E1E1]">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <div className="max-w-2xl mb-8">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[#07626A] text-xs font-semibold uppercase mb-3"
            style={{ backgroundColor: "rgba(7, 98, 106, 0.10)" }}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{dict.guidebook?.safetyBadge || "Безопасность"}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D0D0D] tracking-tight">
            {dict.guidebook?.sosTitle || "Экстренные службы и безопасность"}
          </h2>

          <p className="text-sm text-[#0D0D0D]/75 mt-2">
            {dict.guidebook?.sosSubtitle ||
              "Сохраните эти номера в телефон или запишите на карточку перед выходом на маршрут"}
          </p>
        </div>

        {/* 3 Actionable Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {contacts.map((c) => {
            const isCopied = copiedId === c.id;
            const name = c.name[language] || c.name.ru;
            const badge = c.badge[language] || c.badge.ru;
            const desc = c.description[language] || c.description.ru;

            return (
              <div
                key={c.id}
                className="flex flex-col justify-between p-6 rounded-2xl bg-white border border-[#E1E1E1] hover:border-[#07626A] transition-colors duration-150"
              >
                <div>
                  {/* Top info */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full text-[#07626A]"
                      style={{ backgroundColor: "rgba(7, 98, 106, 0.10)" }}
                    >
                      {badge}
                    </span>
                    <span className="text-xs text-[#0D0D0D]/50 font-mono">
                      КР
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-[#0D0D0D] mb-1.5 leading-snug">
                    {name}
                  </h3>

                  <p className="text-xs text-[#0D0D0D]/65 mb-4 leading-relaxed">
                    {desc}
                  </p>

                  {/* Big Number */}
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#07626A] tracking-tight mb-5">
                    {c.number}
                  </div>
                </div>

                {/* Actions: Direct Call & Copy */}
                <div className="flex items-center gap-2 pt-2">
                  <a
                    href={`tel:${c.number.replace(/\s+/g, "")}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#07626A] text-white text-xs font-semibold hover:bg-[#07626A]/90 transition-colors cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{dict.guidebook?.sosCall || "Позвонить"}</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleCopy(c.number, c.id)}
                    title={dict.guidebook?.copied || "Скопировать"}
                    className="p-2.5 rounded-xl text-[#07626A] transition-colors cursor-pointer"
                    style={{ backgroundColor: "rgba(7, 98, 106, 0.10)" }}
                  >
                    {isCopied ? (
                      <Check className="w-4 h-4 text-[#07626A]" />
                    ) : (
                      <Copy className="w-4 h-4 text-[#07626A]" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Informative Guidance Panel */}
        <div
          className="p-6 sm:p-7 rounded-2xl border border-[#E1E1E1]"
          style={{ backgroundColor: "rgba(7, 98, 106, 0.05)" }}
        >
          <div className="flex items-center gap-2.5 mb-4">
            <Info className="w-4 h-4 text-[#07626A]" />
            <h4 className="text-sm font-bold text-[#0D0D0D]">
              {language === "kg"
                ? "Куткаруу кызматына (112) чалганда эмнелерди айтуу керек:"
                : language === "en"
                ? "What to report when calling 112 Emergency Dispatch:"
                : "Что сообщить оператору при экстренном звонке на 112:"}
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {dispatchTips.map((tip, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-white border border-[#E1E1E1]"
              >
                <span className="block text-xs font-bold text-[#07626A] mb-1">
                  {tip.title}
                </span>
                <span className="text-xs text-[#0D0D0D]/75 leading-relaxed">
                  {tip.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
