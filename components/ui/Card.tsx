import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "flat" | "elevated" | "accent";
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = "default",
  padding = "md",
  className = "",
  ...props
}) => {
  const baseStyles = "rounded-2xl transition-all duration-200";

  const variantStyles: Record<string, string> = {
    default: "bg-white border border-gray-100 shadow-xs hover:shadow-md",
    flat: "bg-gray-50/80 border border-gray-100",
    elevated: "bg-white shadow-lg border border-gray-100/80 hover:shadow-xl",
    accent: "bg-gradient-to-br from-teal-50/60 to-emerald-50/40 border border-teal-100",
  };

  const paddingStyles: Record<string, string> = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
