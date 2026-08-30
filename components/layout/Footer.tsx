"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Heart, Phone, Mail, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const Footer: React.FC = () => {
  const { dict } = useLanguage();

  return (
    <footer id="contacts" className="bg-teal-950 text-teal-100/90 pt-16 pb-12 border-t border-teal-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex flex-col">
              <span
                className="text-2xl sm:text-[32px] font-bold tracking-normal leading-none text-white"
                style={{
                  fontFamily: "var(--font-nunito-sans), 'Nunito Sans', sans-serif",
                }}
              >
                Aiym Path
              </span>
              <span className="text-[10px] uppercase font-semibold text-teal-300 tracking-wider mt-1">
                female-friendly туризм
              </span>
            </div>
            <p className="text-xs text-teal-200/75 leading-relaxed">
              {dict.footer.description}
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-900/80 border border-teal-700/50 rounded-full text-xs text-teal-200">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>Safety & GESI Verified</span>
            </div>
          </div>

          {/* Nav links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {dict.footer.navTitle}
            </h3>
            <ul className="space-y-2.5 text-xs text-teal-200/80">
              <li>
                <Link href="/#about" className="hover:text-white transition-colors">
                  {dict.nav.about}
                </Link>
              </li>
              <li>
                <Link href="/guide" className="hover:text-white transition-colors">
                  {dict.nav.guide}
                </Link>
              </li>
              <li>
                <Link href="/map" className="hover:text-white transition-colors">
                  {dict.nav.map}
                </Link>
              </li>
              <li>
                <Link href="/tours" className="hover:text-white transition-colors">
                  {dict.nav.tours}
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  {dict.nav.admin}
                </Link>
              </li>
            </ul>
          </div>

          {/* Safety & Support */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {dict.footer.safetyTitle}
            </h3>
            <ul className="space-y-2.5 text-xs text-teal-200/80">
              <li>
                <Link href="/guide" className="hover:text-white transition-colors">
                  {dict.footer.safeGuidelines}
                </Link>
              </li>
              <li>
                <Link href="/guide#emergency" className="hover:text-white transition-colors">
                  {dict.footer.emergencyContacts}
                </Link>
              </li>
              <li>
                <span className="text-emerald-400 font-medium">SOS 112 (МЧС КР)</span>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {dict.nav.contacts}
            </h3>
            <ul className="space-y-2.5 text-xs text-teal-200/80">
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>г. Бишкек, Кыргызская Республика</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <a href="mailto:info@aiympath.kg" className="hover:text-white transition-colors">
                  info@aiympath.kg
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <a href="tel:+996700000001" className="hover:text-white transition-colors">
                  +996 700 000 001
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-teal-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-teal-400/80">
          <p>{dict.footer.copyright}</p>
          <div className="flex items-center gap-1.5 text-teal-300/80">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span>for female travelers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
