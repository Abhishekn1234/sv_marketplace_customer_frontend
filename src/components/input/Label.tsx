import * as React from "react";
import { Label as UiLabel } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface LabelProps extends React.ComponentProps<typeof UiLabel> {
  required?: boolean;
  optionalText?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;

  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "default" | "card";
}

export function Label({
  required,
  optionalText,
  hint,
  error,
  leftIcon,
  rightIcon,
  variant = "default",
  className,
  children,
  ...props
}: LabelProps) {
  const base = "text-sm font-semibold text-gray-900";

  const cardStyle =
    "flex items-center justify-between px-5 py-4 rounded-2xl cursor-pointer transition-all duration-300 border";

  return (
    <div className="space-y-1">
      <UiLabel
        className={cn(
          base,
          variant === "card" && cardStyle,
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-2">
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}

          <span>
            {children}
            {required && <span className="ml-1 text-red-600">*</span>}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {optionalText && (
            <span className="text-xs font-normal text-gray-500">
              {optionalText}
            </span>
          )}

          {rightIcon && (
            <span className="shrink-0">{rightIcon}</span>
          )}
        </div>
      </UiLabel>

      {error ? (
        <p className="text-xs font-medium text-red-600">{error}</p>
      ) : hint ? (
        <p className="text-xs text-gray-500">{hint}</p>
      ) : null}
    </div>
  );
}

export const CommonLabel = Label;
export const AppLabel = Label;