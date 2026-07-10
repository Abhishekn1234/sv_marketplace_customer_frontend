import React, { forwardRef } from "react";
import { Button as ShadcnButton } from "@/components/ui/button";
import CommonSpinner from "../common/CommonLoadingSpinner";
import { cn } from "@/lib/utils";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "ghost"
  | "none"
  | "outline"; // ✅ NEW

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
  icon?: boolean; // legacy
  iconOnly?: boolean; // NEW FIX
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}



const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
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
    },
    ref
  ) => {
    const variants: Record<ButtonVariant, string> = {
      primary: "bg-blue-600 text-white hover:bg-blue-700",
      secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
      danger: "bg-red-600 text-white hover:bg-red-700",
      ghost:
        "bg-transparent text-black hover:bg-gray-100 hover:text-blue-200",
      none: "text-inherit hover:text-inherit",
      outline:
        "bg-transparent border border-gray-300 text-gray-900 hover:border-blue-500 hover:text-blue-600",
    };

    const sizes: Record<ButtonSize, string> = {
      sm: "text-sm px-3 py-1.5 h-9",
      md: "text-sm px-4 py-2 h-10",
      lg: "text-base px-5 py-3 h-12",
    };

    const iconSizes: Record<ButtonSize, string> = {
      sm: "h-8 w-8 p-0",
      md: "h-9 w-9 p-0",
      lg: "h-10 w-10 p-0",
    };

    const radii: Record<ButtonRadius, string> = {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-lg",
      lg: "rounded-2xl",
      full: "rounded-full",
    };

    return (
      <ShadcnButton
        ref={ref}
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
);

Button.displayName = "Button";

export default Button;