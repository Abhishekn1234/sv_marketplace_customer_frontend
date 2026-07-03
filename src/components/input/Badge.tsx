import * as React from "react";
import { Badge as ShadcnBadge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type BadgeVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "outline";

type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps
  extends Omit<
    React.ComponentProps<typeof ShadcnBadge>,
    "variant"
  > {
  variant?: BadgeVariant;
  size?: BadgeSize;
  rounded?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Badge({
  variant = "default",
  size = "md",
  rounded = true,
  leftIcon,
  rightIcon,
  className,
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-gray-100 text-gray-700",
    primary: "bg-blue-100 text-blue-700",
    secondary: "bg-slate-100 text-slate-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    danger: "bg-red-100 text-red-700",
    outline: "border border-gray-300 bg-transparent text-gray-700",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  return (
    <ShadcnBadge
      className={cn(
        variants[variant],
        sizes[size],
        rounded ? "rounded-full" : "rounded-md",
        "inline-flex items-center gap-1 font-medium whitespace-nowrap",
        className
      )}
      {...props}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </ShadcnBadge>
  );
}

export const CommonBadge = Badge;
export const AppBadge = Badge;