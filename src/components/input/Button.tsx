import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button as UiButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "link";

type ButtonSize = "sm" | "md" | "lg" | "icon";

const buttonVariantClassNames: Record<ButtonVariant, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
  outline:
    "border-2 border-blue-600 bg-white text-blue-600 hover:bg-blue-50",
  ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
  danger: "bg-red-600 text-white hover:bg-red-700",
  link: "bg-transparent p-0 text-blue-600 underline-offset-4 hover:underline",
};

const buttonSizeClassNames: Record<ButtonSize, string> = {
  sm: "h-8 rounded-lg px-3 text-xs",
  md: "h-10 rounded-xl px-4 text-sm",
  lg: "h-12 rounded-xl px-5 text-base",
  icon: "h-10 w-10 rounded-xl p-0",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      leftIcon,
      rightIcon,
      loading = false,
      disabled,
      className,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    return (
      <UiButton
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={cn(
          "gap-2 font-semibold transition",
          buttonVariantClassNames[variant],
          buttonSizeClassNames[size],
          className
        )}
        {...props}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : leftIcon}
        {children}
        {!loading && rightIcon}
      </UiButton>
    );
  }
);

Button.displayName = "Button";

export const CommonButton = Button;
export const AppButton = Button;
