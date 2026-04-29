import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  wrapperClassName?: string; // For the div wrapping input and label
  labelClassName?: string;
}

export function Checkbox({ label, wrapperClassName, labelClassName, className, ...props }: CheckboxProps) {
  return (
    <div className={`flex items-center ${wrapperClassName}`}>
      <input
        type="checkbox"
        className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${className}`}
        {...props}
      />
      {label && (
        <label className={`ml-2 text-sm text-gray-900 ${labelClassName}`}>
          {label}
        </label>
      )}
    </div>
  );
}