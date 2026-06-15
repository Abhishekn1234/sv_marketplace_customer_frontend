"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function Select({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className = "",
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string | undefined>(value);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedValue = value ?? internalValue;
  const selectedOption = options.find((opt) => opt.value === selectedValue);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleSelect = (val: string) => {
    if (!value) setInternalValue(val);
    onChange?.(val);
    setOpen(false);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <span className="flex items-center gap-2">
          {selectedOption?.icon}
          {selectedOption?.label || (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white dark:bg-gray-900 border rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <span className="flex items-center gap-2">
                {opt.icon}
                {opt.label}
              </span>

              {selectedValue === opt.value && (
                <Check className="w-4 h-4 text-blue-500" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}