"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ComingSoonSectionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  ctaText?: string;
  ctaHref?: string;
}

export const ComingSoonSection: React.FC<ComingSoonSectionProps> = ({
  icon,
  title,
  description,
  ctaText,
  ctaHref,
}) => {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-3xl mx-auto text-center">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 text-[#07626A] flex items-center justify-center mx-auto mb-5 border border-teal-100/80 shadow-xs">
          {icon}
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
          {title}
        </h2>

        <p className="text-sm text-gray-500 leading-relaxed max-w-lg mx-auto mb-8">
          {description}
        </p>

        {ctaText && ctaHref && (
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-semibold shadow-xs hover:shadow-md transition-all active:scale-[0.98]"
            style={{ backgroundColor: "#07626A" }}
          >
            <span>{ctaText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </section>
  );
};
