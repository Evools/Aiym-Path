import React from "react";
import Link from "next/link";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "accent";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  children: React.ReactNode;
  className?: string;
}

type ButtonAsButton = ButtonBaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLink = ButtonBaseProps & {
  href: string;
  target?: string;
  rel?: string;
};

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  children,
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/30";

  const sizeStyles: Record<ButtonSize, string> = {
    sm: "text-xs px-3.5 py-1.5 gap-1.5",
    md: "text-sm px-5 py-2.5 gap-2",
    lg: "text-base px-6 py-3.5 gap-2.5 font-semibold",
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      "bg-teal-700 hover:bg-teal-800 text-white shadow-sm hover:shadow-md active:scale-[0.98]",
    secondary:
      "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md active:scale-[0.98]",
    outline:
      "bg-white/80 backdrop-blur-xs hover:bg-white text-teal-900 border border-teal-200 hover:border-teal-400 active:scale-[0.98]",
    ghost: "bg-transparent hover:bg-teal-50 text-teal-900",
    accent:
      "bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm hover:shadow-md active:scale-[0.98]",
  };

  const fullClassName = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  if ("href" in props && props.href) {
    const { href, target, rel } = props;
    return (
      <Link href={href} className={fullClassName} target={target} rel={rel}>
        {icon && iconPosition === "left" && <span className="shrink-0">{icon}</span>}
        <span>{children}</span>
        {icon && iconPosition === "right" && <span className="shrink-0">{icon}</span>}
      </Link>
    );
  }

  const { type = "button", ...buttonProps } = props as React.ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button type={type} className={fullClassName} {...buttonProps}>
      {icon && iconPosition === "left" && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === "right" && <span className="shrink-0">{icon}</span>}
    </button>
  );
};
