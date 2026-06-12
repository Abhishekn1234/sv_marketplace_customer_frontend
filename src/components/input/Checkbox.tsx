import React from "react";

interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
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
  ...props
}: CheckboxProps) {
  return (
    <div className={`flex items-center ${wrapperClassName || ""}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${className || ""}`}
        {...props}
      />

      {label && (
        <label className={`ml-2 text-sm text-gray-900 ${labelClassName || ""}`}>
          {label}
        </label>
      )}
    </div>
  );
}