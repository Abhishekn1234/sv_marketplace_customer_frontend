import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  containerClassName?: string;
  labelClassName?: string;
  rightElement?: React.ReactNode; // 👈 ADD THIS
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      containerClassName,
      labelClassName,
      className = "",
      rightElement,
      ...props
    },
    ref
  ) => {
    return (
      <div className={containerClassName}>
        {label && (
          <label className={`block text-sm font-semibold mb-2 ${labelClassName}`}>
            {label}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            className={`w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl 
            focus:border-blue-600 focus:ring-4 focus:ring-blue-100 
            outline-none transition ${className}`}
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