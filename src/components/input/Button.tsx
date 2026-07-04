import React from "react";
import { Button as ShadcnButton } from "@/components/ui/button";
import CommonSpinner from "../common/CommonLoadingSpinner";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "none";
type ButtonSize = "sm" | "md" | "lg";
type ButtonRadius = "sm" | "md" | "lg" | "full" | "none";

interface ButtonProps
  extends Omit<
    React.ComponentProps<typeof ShadcnButton>,
    "variant" | "size"
  > {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  radius?: ButtonRadius;
  icon?: boolean;        // legacy
  iconOnly?: boolean;    // NEW FIX
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = "ghost",
  size = "md",
  radius = "md",
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth,
  iconOnly,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "bg-transparent text-gray-100 hover:bg-gray-100",
    none: "text-inherit hover:text-inherit",
  };

  const sizes = {
    sm: "text-sm px-3 py-1.5 h-9",
    md: "text-sm px-4 py-2 h-10",
    lg: "text-base px-5 py-3 h-12",
  };

  const iconSizes = {
    sm: "h-8 w-8 p-0",
    md: "h-9 w-9 p-0",
    lg: "h-10 w-10 p-0",
  };

  const radii = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-lg",
    lg: "rounded-2xl",
    full: "rounded-full",
  };

  return (
    <ShadcnButton
      disabled={disabled || loading}
      className={cn(
        variants[variant],
        !iconOnly && sizes[size],
        iconOnly && iconSizes[size],
        radii[radius],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {loading ? (
        <CommonSpinner size={16} center />
      ) : (
        <>
          {leftIcon}
          {!iconOnly && children}
          {!iconOnly && rightIcon}
        </>
      )}
    </ShadcnButton>
  );
}