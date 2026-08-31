"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Phone, Mail, MapPin, ArrowUpRight, ArrowUp } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { AdminStorageService, AdminProjectContacts, DEFAULT_CONTACTS } from "@/lib/services/admin-storage.service";

export const Footer: React.FC = () => {
  const { language, dict } = useLanguage();
  const [contactsData, setContactsData] = useState<AdminProjectContacts>(DEFAULT_CONTACTS);
  const pathname = usePathname();

  useEffect(() => {
    setContactsData(AdminStorageService.getContacts());
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navItems = [
    { href: "/#about", label: dict.nav.about },
    { href: "/guide", label: dict.nav.guide },
    { href: "/map", label: dict.nav.map },
    { href: "/tours", label: dict.nav.tours },
    { href: "/contacts", label: dict.nav.contacts },
  ];

  return (
    <footer id="contacts" className="bg-white text-gray-600 pt-16 sm:pt-20 pb-12 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 mb-14">
          
          {/* Col 1: Brand & Mission (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-flex flex-col group py-1">
              <span
                className="text-2xl sm:text-[26px] font-bold tracking-normal leading-none"
                style={{
                  color: "#07626A",
                  fontFamily: "var(--font-nunito-sans), 'Nunito Sans', sans-serif",
                }}
              >
                Aiym Path
              </span>
              <span className="text-[10.5px] uppercase font-semibold text-gray-400 tracking-wider mt-1">
                female-friendly туризм
              </span>
            </Link>

            <p className="text-xs sm:text-[13px] text-gray-500 leading-relaxed max-w-sm">
              {dict.footer.description}
            </p>

            <div className="pt-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-50/80 border border-teal-100 rounded-full text-xs text-[#07626A]">
                <ShieldCheck className="w-4 h-4 text-[#07626A] shrink-0" />
                <span className="font-medium">Safety & GESI Verified</span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation (2.5 cols) */}
          <div className="lg:col-span-2 sm:col-span-1">
            <h3 className="text-xs sm:text-[13px] font-bold text-gray-900 uppercase tracking-wider mb-4 pb-1 border-b border-gray-100">
              {dict.footer.navTitle}
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-[13px]">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-gray-500 hover:text-[#07626A] hover:translate-x-0.5 transition-all inline-block py-0.5"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Safety & Help (2.5 cols) */}
          <div className="lg:col-span-3 sm:col-span-1">
            <h3 className="text-xs sm:text-[13px] font-bold text-gray-900 uppercase tracking-wider mb-4 pb-1 border-b border-gray-100">
              {dict.footer.safetyTitle}
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-[13px]">
              <li>
                <Link
                  href="/guide"
                  className="text-gray-500 hover:text-[#07626A] hover:translate-x-0.5 transition-all inline-block py-0.5"
                >
                  {dict.footer.safeGuidelines}
                </Link>
              </li>
              <li>
                <Link
                  href="/guide#emergency"
                  className="text-gray-500 hover:text-[#07626A] hover:translate-x-0.5 transition-all inline-block py-0.5"
                >
                  {dict.footer.emergencyContacts}
                </Link>
              </li>
              <li className="pt-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-100 text-[#07626A] text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#07626A] animate-pulse" />
                  <span>SOS 112 (МЧС КР)</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Col 4: Contacts & Location (3 cols) */}
          <div className="lg:col-span-3">
            <h3 className="text-xs sm:text-[13px] font-bold text-gray-900 uppercase tracking-wider mb-4 pb-1 border-b border-gray-100">
              {dict.nav.contacts}
            </h3>
            <ul className="space-y-3 text-xs sm:text-[13px]">
              <li className="flex items-start gap-2.5 text-gray-500">
                <MapPin className="w-4 h-4 text-[#07626A] shrink-0 mt-0.5" />
                <span className="leading-snug">
                  {contactsData.address[language] || contactsData.address.ru}
                </span>
              </li>
              <li>
                <a
                  href={`mailto:${contactsData.email}`}
                  className="flex items-center gap-2.5 text-gray-500 hover:text-[#07626A] transition-colors group"
                >
                  <Mail className="w-4 h-4 text-[#07626A] shrink-0" />
                  <span>{contactsData.email}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href={`tel:${contactsData.phone.replace(/[^0-9+]/g, "")}`}
                  className="flex items-center gap-2.5 text-gray-500 hover:text-[#07626A] transition-colors group"
                >
                  <Phone className="w-4 h-4 text-[#07626A] shrink-0" />
                  <span>{contactsData.phone}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Official GESI / AKF Project Disclaimer */}
        <div className="pt-6 pb-2 border-t border-gray-100">
          <p className="text-[11px] text-gray-400 leading-relaxed text-center sm:text-left">
            {language === "kg"
              ? "Бул сайт Кыргызстандагы Ага Хан фондунун колдоосу менен түзүлгөн. Мазмуну Aiym Path программасынын гана жоопкерчилигинде жана фонддун көз карашын чагылдырбайт."
              : language === "en"
              ? "This website was created with the support of the Aga Khan Foundation in Kyrgyzstan. The content is the sole responsibility of the Aiym Path program and does not necessarily reflect the views of the Foundation."
              : "Этот сайт создан при поддержке фонда Ага Хан в Кыргызстане. Содержание является исключительной ответственностью программы Aiym Path и не отражает взгляды фонда."}
          </p>
        </div>

        {/* Bottom Copyright & Back-to-Top Bar */}
        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p className="text-center sm:text-left">{dict.footer.copyright}</p>
          
          <div className="flex items-center gap-6">
            <a
              href="https://t.me/web_commander"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-[#07626A] transition-colors font-medium"
            >
              @web_commander
            </a>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-gray-50 hover:bg-teal-50 text-gray-400 hover:text-[#07626A] border border-gray-200/70 transition-all cursor-pointer"
              title="Наверх"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};


