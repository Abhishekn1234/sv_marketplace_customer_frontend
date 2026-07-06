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
type Variant =
  | "default"
  | "primary"
  | "secondary"
  | "ghost"
  | "white"
  | "outline";

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
  contentClassName
  // disabled,
}: SelectProps) {
  const { t } = useLanguage();

  const resolvedPlaceholder =
    placeholder || t.common["Select an option"];

  const triggerClass = cn(
    "w-full",

    size === "sm" && "h-9 text-sm",
    size === "md" && "h-10 text-sm",
    size === "lg" && "h-12 text-base",

    radius === "none" && "rounded-none",
    radius === "sm" && "rounded-md",
    radius === "md" && "rounded-lg",
    radius === "lg" && "rounded-xl",
    radius === "full" && "rounded-full",

    variant === "default" &&
      "bg-white border-gray-300",

    variant === "white" &&
      "bg-white border-gray-200 shadow-sm",

    variant === "outline" &&
      "bg-transparent border-gray-300",

    variant === "ghost" &&
      "bg-transparent border-transparent hover:bg-gray-100",

    variant === "primary" &&
      "bg-blue-600 border-blue-600 text-white hover:bg-blue-700",

    variant === "secondary" &&
      "bg-violet-100 border-violet-200 text-violet-700 hover:bg-violet-200",

    className
  );

  return (
          <ShadcnSelect
        value={value}
        defaultValue={defaultValue}
        onValueChange={(val) => {
          if (val !== null) {
            onChange?.(val);
          }
        }}
      >
      <SelectTrigger
        className={triggerClass}
        size={size === "sm" ? "sm" : "default"}
      >
        <SelectValue placeholder={resolvedPlaceholder} />
      </SelectTrigger>

     <SelectContent className={contentClassName}>
       {options.map((option) => (
    <SelectItem key={option.value} value={option.value}>
        <div className="flex items-center gap-3">
            {option.icon}
            <span>{option.label}</span>
        </div>
    </SelectItem>
))}
      </SelectContent>
    </ShadcnSelect>
  );
}