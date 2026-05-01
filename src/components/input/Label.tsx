import * as React from "react";
import { Label as UiLabel } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface LabelProps extends React.ComponentProps<typeof UiLabel> {
  required?: boolean;
  optionalText?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
}

export function Label({
  required,
  optionalText,
  hint,
  error,
  className,
  children,
  ...props
}: LabelProps) {
  return (
    <div className="space-y-1">
      <UiLabel
        className={cn("text-sm font-semibold text-gray-900", className)}
        {...props}
      >
        <span>
          {children}
          {required && <span className="ml-1 text-red-600">*</span>}
        </span>
        {optionalText && (
          <span className="text-xs font-normal text-gray-500">
            {optionalText}
          </span>
        )}
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
