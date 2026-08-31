"use client";

import React, { useState } from "react";
import { Phone, ShieldAlert, Check, Copy, MessageCircle, AlertTriangle, ShieldCheck } from "lucide-react";
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
  isWhatsApp?: boolean;
  isMain?: boolean;
}

export const EmergencySafetyBanner: React.FC = () => {
  const { language } = useLanguage();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const contacts: EmergencyContact[] = [
    {
      id: "sos-112",
      name: {
        ru: "Единая служба экстренной помощи (МЧС)",
        kg: "Бирдиктүү шашылыш жардам кызматы (ӨКМ)",
        en: "Unified Emergency Dispatch (All Services)",
      },
      number: "112",
      badge: {
        ru: "24/7 • Бесплатно",
        kg: "24/7 • Акысыз",
        en: "24/7 • Free Call",
      },
      description: {
        ru: "Единый номер для всех экстренных служб, работает без SIM-карты",
        kg: "Бардык шашылыш кызматтар үчүн бирдиктүү номер, SIM-картасыз да иштейт",
        en: "All emergency services, accessible even without a SIM card",
      },
      isMain: true,
    },
    {
      id: "sos-102",
      name: {
        ru: "Полиция (Милиция)",
        kg: "Милиция",
        en: "Police Department",
      },
      number: "102",
      badge: {
        ru: "Круглосуточно",
        kg: "Күнү-түнү",
        en: "24/7 Service",
      },
      description: {
        ru: "Защита правопорядка, реагирование на правонарушения и угрозы",
        kg: "Коомдук коопсуздукту коргоо жана мыйзам бузууларга чара көрүү",
        en: "Law enforcement, urgent safety threats, and rapid response",
      },
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
        ru: "Неотложная медицинская помощь при травмах и заболеваниях",
        kg: "Жаракат алганда жана ооруп калганда тез медициналык жардам",
        en: "Emergency trauma and medical assistance across regions",
      },
    },
    {
      id: "sos-101",
      name: {
        ru: "Пожарно-спасательная служба",
        kg: "Өрт өчүрүү жана куткаруу кызматы",
        en: "Fire & Rescue Service",
      },
      number: "101",
      badge: {
        ru: "Круглосуточно",
        kg: "Күнү-түнү",
        en: "24/7 Service",
      },
      description: {
        ru: "Ликвидация пожаров, эвакуация и спасательные операции",
        kg: "Өрттү өчүрүү, эвакуация жана куткаруу иштери",
        en: "Firefighting, evacuation, and emergency rescue operations",
      },
    },
    {
      id: "sos-117",
      name: {
        ru: "Горячая линия по вопросам гендерного насилия",
        kg: "Гендердик зомбулук маселелери боюнча түз байланыш",
        en: "Domestic & Gender-Based Violence Hotline",
      },
      number: "117",
      badge: {
        ru: "Анонимно • Бесплатно",
        kg: "Анонимдүү • Акысыз",
        en: "Anonymous • Free",
      },
      description: {
        ru: "Психологическая и правовая поддержка женщин в кризисных ситуациях",
        kg: "Кризистик кырдаалда калган аялдарга психологиялык жана укуктук колдоо",
        en: "Psychological and legal crisis counseling for women",
      },
    },
    {
      id: "sos-sezim",
      name: {
        ru: "Кризисный центр «Сезим» (Бишкек)",
        kg: "«Сезим» кризистик борбору (Бишкек)",
        en: "Sezim Crisis Center (Bishkek)",
      },
      number: "+996 312 66-15-92",
      badge: {
        ru: "Центр помощи",
        kg: "Жардам борбору",
        en: "Crisis Center",
      },
      description: {
        ru: "Ассоциация кризисных центров Кыргызстана, шелтер и юристы",
        kg: "Кыргызстандын кризистик борборлор ассоциациясы, башпаанек жана юристтер",
        en: "Shelter, direct assistance, and legal aid for women in Kyrgyzstan",
      },
    },
    {
      id: "sos-tourist-police",
      name: {
        ru: "Туристическая милиция (Иссык-Куль)",
        kg: "Туристтик милиция (Ысык-Көл)",
        en: "Tourist Police (Issyk-Kul)",
      },
      number: "+996 705 00 91 02",
      badge: {
        ru: "RU/EN • WhatsApp",
        kg: "RU/EN • WhatsApp",
        en: "RU/EN • WhatsApp",
      },
      description: {
        ru: "Поддержка туристов на английском и русском языках (сезонно)",
        kg: "Англис жана орус тилдеринде туристтерге жардам (сезондук)",
        en: "Bilingual tourist security and assistance via Phone and WhatsApp",
      },
      isWhatsApp: true,
    },
  ];

  const handleCopy = (number: string, id: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(number.replace(/\s+/g, ""));
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const emergencyChecklist = [
    {
      title: language === "kg" ? "1. Коопсуздук жана кабарлоо" : language === "en" ? "1. Immediate Action" : "1. Безопасное реагирование",
      text: language === "kg" ? "Эгерде кимдир бирөө өзүн туура эмес алып жүрсө — коопсуз жерге чыгып, милицияга билдириңиз (102)." : language === "en" ? "If anyone behaves inappropriately, relocate to a safe area immediately and report to police (102)." : "Если кто-то ведёт себя неподобающим образом — безопасно покиньте место и сообщите в милицию (102).",
    },
    {
      title: language === "kg" ? "2. Документтерди сактоо" : language === "en" ? "2. Offline Documents" : "2. Документы в офлайн-доступе",
      text: language === "kg" ? "Паспорт, виза жана камсыздандыруу маалыматтарын оффлайн сактап, элчилигиңиздин байланыштарын билиңиз." : language === "en" ? "Keep offline digital copies of your passport, visa, and travel insurance, and know your embassy contact." : "Сохраните копии паспорта, визы и страховки в офлайн-доступе и запишите контакты своего посольства.",
    },
    {
      title: language === "kg" ? "3. Тилдик колдоо" : language === "en" ? "3. Language Assistance" : "3. Языковая помощь",
      text: language === "kg" ? "Кыргызча же орусча билбейсизби? Жакынкы жергиликтүү аялдан же үйдүн ээсинен чалууга көмөктөшүүнү сураныңыз." : language === "en" ? "Do not speak Kyrgyz or Russian? Ask a local host or a woman nearby to assist in making the emergency call." : "Не владеете русским или кыргызским языком? Попросите местного хозяина дома или женщину поблизости помочь совершить звонок.",
    },
  ];

  return (
    <section id="emergency" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-[#E1E1E1]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="max-w-2xl mb-10">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[#07626A] text-xs font-semibold uppercase mb-3"
            style={{ backgroundColor: "rgba(7, 98, 106, 0.10)" }}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>
              {language === "kg"
                ? "Шашылыш байланыштар"
                : language === "en"
                ? "Emergency Hotlines"
                : "Экстренные контакты"}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D0D0D] tracking-tight">
            {language === "kg"
              ? "Шашылыш кызматтар жана жардам линиялары"
              : language === "en"
              ? "Emergency Hotlines & Safety Assistance"
              : "Экстренные службы и горячие линии помощи"}
          </h2>

          <p className="text-sm text-[#0D0D0D]/70 mt-2">
            {language === "kg"
              ? "Кыргызстанда 3 орундуу стандарттык номерлер жана 112 бирдиктүү номери иштейт. Телефонго сактап алыңыз."
              : language === "en"
              ? "Kyrgyzstan uses standard 3-digit emergency numbers plus unified 112. Save them to your phone."
              : "В Кыргызстане действуют стандартные 3-значные номера экстренных служб и единый номер 112. Сохраните их в телефон."}
          </p>
        </div>

        {/* 7 Emergency Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {contacts.map((c) => {
            const isCopied = copiedId === c.id;
            const name = c.name[language] || c.name.ru;
            const badge = c.badge[language] || c.badge.ru;
            const desc = c.description[language] || c.description.ru;

            return (
              <div
                key={c.id}
                className={`p-5 rounded-3xl border transition-all flex flex-col justify-between gap-4 ${
                  c.isMain
                    ? "bg-[rgba(7,98,106,0.04)] border-[#07626A]/40 shadow-xs"
                    : "bg-[#FAFBFB] border-[#E1E1E1] hover:border-[rgba(7,98,106,0.30)]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#07626A] bg-white px-2.5 py-0.5 rounded-full border border-[#E1E1E1]">
                      {badge}
                    </span>

                    {c.isMain && (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                        SOS
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-[#0D0D0D] leading-snug">
                    {name}
                  </h3>

                  <p className="text-xs text-[#0D0D0D]/70 leading-relaxed mt-1.5 font-normal">
                    {desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E1E1E1] flex items-center justify-between gap-2">
                  <span className="text-base sm:text-lg font-black tracking-wider text-[#07626A] font-mono">
                    {c.number}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleCopy(c.number, c.id)}
                      className="p-2 rounded-xl bg-white border border-[#E1E1E1] hover:border-[#07626A] text-[#0D0D0D]/60 hover:text-[#07626A] transition-colors cursor-pointer"
                      title="Скопировать номер"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    <a
                      href={`tel:${c.number.replace(/[^0-9+]/g, "")}`}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#07626A] text-white text-xs font-bold hover:bg-[#07626A]/90 transition-colors cursor-pointer shadow-2xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Позвонить</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Emergency Action Checklist (Памятка в экстренных ситуациях) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#FAFBFB] border border-[#E1E1E1] flex flex-col gap-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#E1E1E1]">
            <ShieldCheck className="w-5 h-5 text-[#07626A]" />
            <h3 className="text-base font-bold text-[#0D0D0D]">
              {language === "kg"
                ? "Шашылыш кырдаалдагы аракеттердин тартиби"
                : language === "en"
                ? "Emergency Response Protocol"
                : "Памятка действий в нештатных ситуациях"}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {emergencyChecklist.map((tip, idx) => (
              <div key={idx} className="flex flex-col gap-1.5">
                <h4 className="text-xs font-bold text-[#07626A] uppercase tracking-wider">
                  {tip.title}
                </h4>
                <p className="text-xs text-[#0D0D0D]/80 leading-relaxed font-normal">
                  {tip.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
