import React from "react";

const BottomNav: React.FC = () => (
  <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-white/95 p-2.5 rounded-3xl shadow-xl backdrop-blur-md border border-white/50 z-50">
    <div className="flex items-center justify-center w-12 h-12 rounded-lg cursor-pointer bg-blue-50 text-blue-600">
      {/* Home Icon */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className="w-6 h-6"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    </div>
    {/* Add other nav items similarly */}
  </nav>
);

export default BottomNav;
