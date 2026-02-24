import React from "react";
import { useNavigate } from "react-router-dom";

export default function QuickActions() {
  const navigate=useNavigate();
  return (
    <div className="mt-2 bg-white rounded-[20px] p-8 shadow-sm border border-gray-200">
      {/* Title */}
      <h3 className="flex items-center gap-2.5 text-[18px] font-bold text-gray-900 mb-6">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="w-5 h-5 text-blue-600"
        >
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
        Quick Actions
      </h3>

      {/* Buttons Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Security */}
        <ActionButton onClick={()=>navigate('/security')}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-[18px] h-[18px]"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          Security
        </ActionButton>

        {/* Billing */}
        <ActionButton>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-[18px] h-[18px]"
          >
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          Billing
        </ActionButton>

        {/* Privacy */}
        <ActionButton onClick={()=>navigate('/privacy')} >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-[18px] h-[18px]"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Privacy
        </ActionButton>

        {/* Help */}
        <ActionButton onClick={()=>navigate('/help')}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-[18px] h-[18px]"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          Help
        </ActionButton>
      </div>
    </div>
  );
}

function ActionButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 px-5 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-900 transition-all duration-200 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600"
    >
      {children}
    </button>
  );
}

