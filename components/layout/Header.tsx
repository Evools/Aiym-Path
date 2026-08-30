"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

export const Header: React.FC = () => {
  const { dict } = useLanguage();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/#about", label: dict.nav.about },
    { href: "/guide", label: dict.nav.guide },
    { href: "/map", label: dict.nav.map },
    { href: "/tours", label: dict.nav.tours },
    { href: "/contacts", label: dict.nav.contacts },
  ];

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 py-3.5 transition-all duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex flex-col group py-1">
          <span
            className="text-2xl sm:text-[24px] font-bold tracking-normal leading-none"
            style={{
              color: "#07626A",
              fontFamily: "var(--font-nunito-sans), 'Nunito Sans', sans-serif",
            }}
          >
            Aiym Path
          </span>
          <span className="text-[10px] text-gray-500 font-medium mt-0.5">
            female-friendly туризм
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-medium transition-colors hover:text-teal-700 ${
                  isActive ? "text-teal-700" : "text-gray-700"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher isScrolled={isScrolled} />
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-3">
          <LanguageSwitcher isScrolled={isScrolled} />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-gray-700 hover:bg-gray-100"
            aria-label="Меню"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-sm font-medium text-gray-800 hover:text-teal-700"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};
