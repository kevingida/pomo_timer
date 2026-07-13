import clsx from "clsx";
import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  active?: boolean;
  tooltip?: string;
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  type = "button",
  active = false,
  tooltip = "",
  ...props
}: ButtonProps) => {
  const baseClasses =
    "rounded-full font-semibold cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group relative";

  const variants = {
    primary:
      "border border-border-primary bg-surface-primary backdrop-blur-lg text-text-primary hover:bg-surface-primary/50 focus:ring-surface-primary shadow-lg",
    secondary:
      "bg-surface-secondary text-text-secondary hover:bg-surface-secondary-dark focus:ring-surface-secondary",
    danger: "bg-danger text-white hover:bg-danger-dark focus:ring-danger",
    outline:
      "border border-border-primary text-text-primary hover:bg-surface-primary/50 focus:ring-surface-primary ",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-2.5 py-2.5 text-base",
    lg: "px-5 py-3 text-lg",
  };

  const actives = active
    ? "!bg-surface-active !text-text-active"
    : "bg-transparent";

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={clsx(
        baseClasses,
        variants[variant],
        sizes[size],
        actives,
        className,
      )}
      {...props}
    >
      {loading ? "Loading..." : children}
      {tooltip && (
        <span
          className=" absolute left-1/2 top-full mt-2 -translate-x-1/2
      rounded-md bg-black px-2 py-1
      text-xs text-white
      opacity-0 scale-95
      transition-all duration-200
      group-hover:opacity-100
      group-hover:scale-100
      pointer-events-none"
        >
          {tooltip}
        </span>
      )}
    </button>
  );
};

export default Button;
