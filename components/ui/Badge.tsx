import React from "react";

export type BadgeVariant = "default" | "primary" | "secondary" | "success" | "outline" | "pill";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  children,
  icon,
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full transition-colors";

  const variantStyles: Record<BadgeVariant, string> = {
    default: "bg-teal-50 text-teal-900 border border-teal-200",
    primary: "bg-teal-700 text-white shadow-xs",
    secondary: "bg-amber-50 text-amber-900 border border-amber-200",
    success: "bg-emerald-50 text-emerald-800 border border-emerald-200",
    outline: "bg-transparent text-gray-700 border border-gray-300",
    pill: "bg-teal-100/70 text-teal-800 tracking-wide uppercase text-[11px] font-bold px-3.5 py-1",
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
