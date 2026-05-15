"use client";

import React from "react";

interface AppProgressProps {
  value: number; // 0 - 100
  height?: number;
  color?: string; // tailwind color class (optional)
  showLabel?: boolean;
  label?: string;
  className?: string;
}

const AppProgress: React.FC<AppProgressProps> = ({
  value,
  height = 6,
  color = "bg-blue-600",
  showLabel = false,
  label,
  className = "",
}) => {
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      {showLabel && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-gray-600">
            {label || "Progress"}
          </span>
          <span className="text-xs text-gray-500">
            {Math.round(safeValue)}%
          </span>
        </div>
      )}

      {/* Track */}
      <div
        className="w-full bg-gray-200 rounded-full overflow-hidden"
        style={{ height }}
      >
        {/* Fill */}
        <div
          className={`${color} h-full transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
};

export default AppProgress;