"use client";

import React from "react";
import { Check } from "lucide-react";

interface CustomCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: string;
  className?: string;
  disabled?: boolean;
}

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  checked,
  onChange,
  label,
  description,
  className = "",
  disabled = false,
}) => {
  return (
    <div
      role="checkbox"
      aria-checked={checked}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (!disabled && (e.key === " " || e.key === "Enter")) {
          e.preventDefault();
          onChange(!checked);
        }
      }}
      onClick={() => !disabled && onChange(!checked)}
      className={`flex items-start gap-3 cursor-pointer select-none transition-colors ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      <div
        className={`w-5 h-5 rounded-lg border transition-all duration-200 flex items-center justify-center shrink-0 mt-0.5 ${
          checked
            ? "bg-[#07626A] border-[#07626A] text-white shadow-xs"
            : "bg-white border-[#E1E1E1] hover:border-[#07626A]/50"
        }`}
      >
        {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
      </div>
      {(label || description) && (
        <div className="flex flex-col">
          {label && <span className="text-xs font-bold text-[#0D0D0D]">{label}</span>}
          {description && (
            <span className="text-[11px] text-[#0D0D0D]/60 mt-0.5">{description}</span>
          )}
        </div>
      )}
    </div>
  );
};
