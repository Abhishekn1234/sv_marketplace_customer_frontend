import React from "react";
import { Checkbox as ShadcnCheckbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface CheckboxProps
  extends Omit<
    React.ComponentProps<typeof ShadcnCheckbox>,
    "onCheckedChange"
  > {
  label?: React.ReactNode;
  wrapperClassName?: string;
  labelClassName?: string;
  onChange?: (checked: boolean) => void;
}

export function Checkbox({
  label,
  wrapperClassName,
  labelClassName,
  className,
  onChange,
  checked,
  disabled,
  ...props
}: CheckboxProps) {
  return (
    <div
      className={cn(
        "flex items-center",
        wrapperClassName
      )}
    >
      <ShadcnCheckbox
        checked={checked}
        disabled={disabled}
        onCheckedChange={(value) => onChange?.(value === true)}
        className={cn(
          "h-4 w-4 rounded border-gray-300 text-blue-100 focus:ring-blue-500",
          className
        )}
        {...props}
      />

      {label && (
        <label
          className={cn(
            "ml-2 text-sm text-gray-900",
            disabled && "opacity-50",
            labelClassName
          )}
        >
          {label}
        </label>
      )}
    </div>
  );
}