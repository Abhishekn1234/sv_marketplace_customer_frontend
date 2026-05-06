import React from "react";

import CommonSpinner from "../common/CommonLoadingSpinner";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "none";
type ButtonSize = "sm" | "md" | "lg";
type ButtonRadius = "sm" | "md" | "lg" | "full" | "none";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  radius?: ButtonRadius;
 icon?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = "none",
  size = "md",
  loading = false,
  radius = "md",
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  icon,
  className = "",
  ...props
}: ButtonProps) {
  // const base =
  //   "inline-flex items-center justify-center gap-2 font-medium transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-800",
    none: "",
  };

  const sizes = {
    sm: "text-sm px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-5 py-3",
  };

  const radii = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-lg",
    lg: "rounded-2xl",
    full: "rounded-full",
  };

return (
  <button
    className={`
      inline-flex items-center justify-center
      gap-2 font-medium transition duration-200
      disabled:opacity-60 disabled:cursor-not-allowed
       ${icon ? "w-8 h-8 p-0" : sizes[size]}
      ${radii[radius]}
      ${variants[variant]}
      ${sizes[size]}
      ${fullWidth ? "w-full" : ""}
      ${className}
    `}
    disabled={disabled || loading}
    {...props}
  >
    {/* LEFT ICON */}
        {loading ? (
        <CommonSpinner size={16} />
      ) : (
        leftIcon && (
          <span className="shrink-0 flex items-center">
            {leftIcon}
          </span>
        )
      )}
    {/* TEXT + RIGHT ICON WRAPPED TOGETHER */}
    <span className="flex items-center gap-1 min-w-0">
      <span className="truncate">{children}</span>

      {!loading && rightIcon && (
        <span className="shrink-0 flex items-center">
          {rightIcon}
        </span>
      )}
    </span>
  </button>
);
}