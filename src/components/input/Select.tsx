"use client";

import * as React from "react";
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/features/context/LanguageContext";

export interface SelectOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

type Size = "sm" | "md" | "lg";
type Radius = "sm" | "md" | "lg" | "full" | "none";
type Variant = "default" | "primary" | "secondary" | "ghost" | "white" | "outline";

interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  contentClassName?: string;
  size?: Size;
  radius?: Radius;
  variant?: Variant;
  disabled?: boolean;
}

export default function Select({
  options,
  value,
  defaultValue,
  onChange,
  placeholder,
  className,
  size = "md",
  radius = "lg",
  variant = "white",
  contentClassName,
}: SelectProps) {
  const { t } = useLanguage();

  const resolvedPlaceholder = placeholder || t.common["Select an option"];

  // 🔧 the fix: resolve the label ourselves instead of relying on
  // Radix's auto-matching, which breaks when SelectItem children aren't plain text
  const selectedOption = options.find((opt) => opt.value === value);

  const triggerClass = cn(
    "w-full transition-all duration-200",

    size === "sm" && "h-9 text-sm",
    size === "md" && "h-10 text-sm",
    size === "lg" && "h-12 text-base",

    radius === "none" && "rounded-none",
    radius === "sm" && "rounded-md",
    radius === "md" && "rounded-lg",
    radius === "lg" && "rounded-xl",
    radius === "full" && "rounded-full",

    variant === "default" && "bg-white border-gray-300 hover:border-gray-400",
    variant === "white" &&
      "bg-white border-gray-200 shadow-sm hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
    variant === "outline" && "bg-transparent border-gray-300 hover:border-gray-400",
    variant === "ghost" && "bg-transparent border-transparent hover:bg-gray-100",
    variant === "primary" && "bg-blue-600 border-blue-600 text-white hover:bg-blue-700",
    variant === "secondary" &&
      "bg-violet-100 border-violet-200 text-violet-700 hover:bg-violet-200",

    className
  );

  return (
    <ShadcnSelect
      value={value}
      defaultValue={defaultValue}
      onValueChange={(val) => {
        if (val !== null) onChange?.(val);
      }}
    >
      <SelectTrigger className={triggerClass} size={size === "sm" ? "sm" : "default"}>
        <SelectValue placeholder={resolvedPlaceholder}>
          {selectedOption && (
            <div className="flex items-center gap-2 truncate">
              {selectedOption.icon}
              <span className="truncate">{selectedOption.label}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>

      <SelectContent className={cn("rounded-xl border-gray-200 shadow-lg", contentClassName)}>
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="rounded-lg text-sm data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-700"
          >
            <div className="flex items-center gap-2.5">
              {option.icon}
              <span>{option.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </ShadcnSelect>
  );
}