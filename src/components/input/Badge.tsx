import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "outline";

  size?: "sm" | "md" | "lg";

  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  rounded?: boolean;
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
    outline: "border border-gray-300 text-gray-700 bg-transparent",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium whitespace-nowrap",
        rounded ? "rounded-full" : "rounded-md",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </span>
  );
}

export const CommonBadge = Badge;
export const AppBadge = Badge;