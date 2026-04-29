import React from 'react';

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  containerClassName?: string;
  labelClassName?: string;
}

export function Radio({ label, containerClassName, labelClassName, ...props }: RadioProps) {
  return (
    <label className={`flex items-center ${containerClassName}`}>
      <input
        type="radio"
        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
        {...props}
      />
      {label && (
        <span className={`ml-2 text-sm text-gray-900 ${labelClassName}`}>
          {label}
        </span>
      )}
    </label>
  );
}