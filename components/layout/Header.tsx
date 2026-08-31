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
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hide public header when inside admin
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const navLinks = [
    { href: "/#about", label: dict.nav.about },
    { href: "/guide", label: dict.nav.guide },
    { href: "/map", label: dict.nav.map },
    { href: "/tours", label: dict.nav.tours },
    { href: "/contacts", label: dict.nav.contacts },
  ];

  return (
    <header
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-[#E1E1E1] py-3"
          : "bg-white border-b border-[#E1E1E1] py-3.5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex flex-col group py-0.5">
          <span
            className="text-2xl sm:text-[24px] font-extrabold tracking-tight leading-none text-[#07626A]"
            style={{
              fontFamily: "var(--font-nunito-sans), 'Nunito Sans', sans-serif",
            }}
          >
            Aiym Path
          </span>
          <span className="text-[10px] text-[#0D0D0D]/60 font-semibold tracking-wider uppercase mt-0.5">
            female-friendly туризм
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : link.href.startsWith("/#")
                ? false
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors duration-150 ${
                  isActive
                    ? "bg-[rgba(7,98,106,0.10)] text-[#07626A]"
                    : "text-[#0D0D0D]/75 hover:text-[#07626A] hover:bg-[#F0F2F2]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions & Language Switcher */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher isScrolled={isScrolled} />
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-2.5">
          <LanguageSwitcher isScrolled={isScrolled} />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-[#0D0D0D] hover:bg-[#F0F2F2] border border-[#E1E1E1] transition-colors cursor-pointer"
            aria-label="Меню"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E1E1E1] px-4 sm:px-6 py-4 space-y-1.5 animate-in fade-in duration-150">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : link.href.startsWith("/#")
                ? false
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2.5 px-3.5 rounded-xl text-xs font-bold transition-colors ${
                  isActive
                    ? "bg-[rgba(7,98,106,0.10)] text-[#07626A]"
                    : "text-[#0D0D0D]/80 hover:text-[#07626A] hover:bg-[#F0F2F2]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
