import clsx from "clsx";
import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  active?: boolean;
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
  ...props
}: ButtonProps) => {
  const baseClasses =
    "rounded-[10px] font-semibold cursor-pointer transition-all duration-200  disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "border  border-primary text-text hover:bg-primary focus:ring-primary ",
    secondary:
      "bg-secondary text-white hover:bg-secondary-dark focus:ring-secondary",
    danger: "bg-danger text-white hover:bg-danger-dark focus:ring-danger",
    outline:
      "border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-2.5 py-2.5 text-base",
    lg: "px-5 py-3 text-lg",
  };

  const actives = active ? "bg-primary" : "bg-transparent";

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
    </button>
  );
};

export default Button;
