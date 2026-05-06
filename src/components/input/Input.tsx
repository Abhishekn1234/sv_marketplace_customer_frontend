import React, { forwardRef } from "react";

type Size = "sm" | "md" | "lg" | "xl";
type Radius = "sm" | "md" | "lg" | "xl" | "full";
type Variant = "default" | "unstyled";
interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  containerClassName?: string;
  labelClassName?: string;
  rightElement?: React.ReactNode;
  leftElement?:React.ReactNode;
  variant?: Variant;
  size?: Size;
  radius?: Radius;
}
/* SIZE STYLES */
const sizeStyles: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-4 py-2.5 text-base", // 👈 best for chat
  xl: "px-5 py-3 text-lg",
};
/* RADIUS STYLES */
const radiusStyles: Record<Radius, string> = {
  sm: "rounded-md",
  md: "rounded-lg",
  lg: "rounded-xl",
  xl: "rounded-2xl",
  full: "rounded-full",
};
const variantStyles: Record<Variant, string> = {
  default: `
    border border-gray-300
    bg-white
    focus:border-blue-500 focus:ring-2 focus:ring-blue-100
  `,
  unstyled: `
    bg-gray-100
    border border-transparent
    focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100
  `,
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      containerClassName,
      labelClassName,
      className = "",
      rightElement,
      leftElement,
        variant = "default",
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
                w-full outline-none transition text-gray-900
               ${variantStyles[variant]}

              ${sizeStyles[size]}
              ${radiusStyles[radius]}
              ${rightElement ? "pr-12" : ""}
             ${leftElement ? "pl-10" : ""}
              ${className}
            `}
            {...props}
          />
            {leftElement && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  {leftElement}
                </div>
              )}


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