import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  containerClassName?: string;
  labelClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, containerClassName, labelClassName, className = "", ...props },
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

        <input
          ref={ref} // ✅ THIS FIXES YOUR ERROR
          className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl 
          focus:border-blue-600 focus:ring-4 focus:ring-blue-100 
          outline-none transition ${className}`}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";