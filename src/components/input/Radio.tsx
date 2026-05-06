import React from "react";

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  containerClassName?: string;
  labelClassName?: string;

  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Radio({
  label,
  containerClassName = "",
  labelClassName = "",
  leftIcon,
  rightIcon,
  ...props
}: RadioProps) {
  return (
    <label
      className={`flex items-center gap-2 cursor-pointer ${containerClassName}`}
    >
      {/* LEFT ICON */}
      {leftIcon && (
        <span className="flex items-center shrink-0">
          {leftIcon}
        </span>
      )}

      {/* RADIO INPUT */}
      <input
        type="radio"
        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
        {...props}
      />

      {/* LABEL */}
      {label && (
        <span className={`text-sm text-gray-900 ${labelClassName}`}>
          {label}
        </span>
      )}

      {/* RIGHT ICON */}
      {rightIcon && (
        <span className="flex items-center shrink-0 ml-auto">
          {rightIcon}
        </span>
      )}
    </label>
  );
}