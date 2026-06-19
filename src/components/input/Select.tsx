"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

type Size = "sm" | "md" | "lg" | "xl";
type Radius = "sm" | "md" | "lg" | "xl" | "full";
type Variant = "default" | "primary" | "secondary" | "ghost";

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;

  size?: Size;
  radius?: Radius;
  variant?: Variant;
}

const sizeStyles: Record<Size, string> = {
  sm: "px-3 py-2 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-4 py-3 text-base",
  xl: "px-5 py-3.5 text-lg",
};

const radiusStyles: Record<Radius, string> = {
  sm: "rounded-md",
  md: "rounded-lg",
  lg: "rounded-xl",
  xl: "rounded-2xl",
  full: "rounded-full",
};

const variantStyles: Record<Variant, string> = {
  default: `
    bg-gray-100
    dark:bg-gray-800
    border-gray-200
    dark:border-gray-700
    text-gray-800
    dark:text-gray-100
    hover:bg-gray-50
    dark:hover:bg-gray-700
    hover:border-gray-300
    dark:hover:border-gray-600
  `,

  primary: `
    bg-blue-600
    border-blue-600
    text-white
    hover:bg-blue-700
  `,

  secondary: `
    bg-violet-100
    dark:bg-violet-900/30
    border-violet-200
    dark:border-violet-800
    text-violet-700
    dark:text-violet-300
    hover:bg-violet-200
    dark:hover:bg-violet-900/50
  `,

  ghost: `
    bg-transparent
    border-gray-200
    dark:border-gray-700
    text-gray-700
    dark:text-gray-300
    hover:bg-gray-100
    dark:hover:bg-gray-800
  `,
};

export default function Select({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className = "",
  size = "md",
  radius = "lg",
  variant = "default",
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string | undefined>(value);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedValue = value ?? internalValue;

  const selectedOption = options.find(
    (option) => option.value === selectedValue
  );

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleSelect = (selected: string) => {
    if (value === undefined) {
      setInternalValue(selected);
    }

    onChange?.(selected);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className={`relative min-w-[180px] ${className}`}
    >
      {/* Trigger */}
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((prev) => !prev)}
        className={`
          w-full
          flex
          items-center
          justify-between
          gap-3
          border
          shadow-sm
          transition-all
          duration-200
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500/20
          focus:border-blue-500

          ${sizeStyles[size]}
          ${radiusStyles[radius]}
          ${variantStyles[variant]}
        `}
      >
        <span className="flex items-center gap-2 truncate">
          {selectedOption?.icon}

          {selectedOption ? (
            <span className="truncate font-medium">
              {selectedOption.label}
            </span>
          ) : (
            <span className="text-gray-500 dark:text-gray-400 truncate">
              {placeholder}
            </span>
          )}
        </span>

        <ChevronDown
          className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="listbox"
          className={`
            absolute
            z-50
            mt-2
            w-full
            overflow-hidden
            border
            border-gray-200
            dark:border-gray-700
            bg-white
            dark:bg-gray-900
            shadow-xl
            max-h-64
            overflow-y-auto

            ${radiusStyles[radius]}
          `}
        >
          {options.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
              No options available
            </div>
          ) : (
            options.map((option) => {
              const isSelected = selectedValue === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`
                    w-full
                    flex
                    items-center
                    justify-between
                    px-4
                    py-3
                    text-left
                    transition-colors
                    duration-150
                    hover:bg-gray-100
                    dark:hover:bg-gray-800

                    ${
                      isSelected
                        ? "bg-blue-50 dark:bg-blue-900/20"
                        : ""
                    }
                  `}
                >
                  <span className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                    {option.icon}
                    {option.label}
                  </span>

                  {isSelected && (
                    <Check className="w-4 h-4 text-blue-500 shrink-0" />
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}