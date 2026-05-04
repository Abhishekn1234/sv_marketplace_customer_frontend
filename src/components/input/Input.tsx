import React, { forwardRef } from "react";

type Size = "sm" | "md" | "lg" | "xl";
type Radius = "sm" | "md" | "lg" | "xl" | "full";

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  containerClassName?: string;
  labelClassName?: string;
  rightElement?: React.ReactNode;

  size?: Size;
  radius?: Radius;
}
/* SIZE STYLES */
const sizeStyles: Record<Size, string> = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-3 text-sm",
  lg: "px-5 py-4 text-base",
  xl: "px-6 py-5 text-lg",
};

/* RADIUS STYLES */
const radiusStyles: Record<Radius, string> = {
  sm: "rounded-md",
  md: "rounded-lg",
  lg: "rounded-xl",
  xl: "rounded-2xl",
  full: "rounded-full",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      containerClassName,
      labelClassName,
      className = "",
      rightElement,

      size = "md",
      radius = "lg",

      ...props
    },
    ref
  ) => {
    return (
      <div className={containerClassName}>
        {label && (
          <label
            className={`block text-sm font-semibold mb-2 ${labelClassName}`}
          >
            {label}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            className={`
              w-full
              bg-white border border-gray-300
              focus:border-blue-600 focus:ring-4 focus:ring-blue-100
              outline-none transition
              text-gray-900

              ${sizeStyles[size]}
              ${radiusStyles[radius]}
              ${rightElement ? "pr-12" : ""}

              ${className}
            `}
            {...props}
          />

          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightElement}
            </div>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";