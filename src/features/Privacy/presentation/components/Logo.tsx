import React from "react";
import { Link } from "react-router-dom";

const Logo: React.FC = () => (
  <Link to="/" className="flex items-center gap-2">
    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
        <path d="M12 3L4 9v12h16V9l-8-6zm0 2.2L18 9.5V19H6V9.5l6-4.3z" />
        <path d="M12 7L9 10h6l-3-3z" />
      </svg>
    </div>
    <span className="text-gray-900 font-bold text-xl">
      HomeEase
    </span>
  </Link>
);

export default Logo;
