import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  containerClassName?: string;
  labelClassName?: string;
}

export function Input({ label, containerClassName, labelClassName, ...props }: InputProps) {
  return (
    <div className={containerClassName}>
      {label && (
        <label className={`block text-sm font-semibold mb-2 ${labelClassName}`}>
          {label}
        </label>
      )}
      <input
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition"
        {...props}
      />
    </div>
  );
}