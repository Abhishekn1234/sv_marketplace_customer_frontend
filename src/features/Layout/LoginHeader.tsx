import { useState } from 'react';
import { Link } from 'react-router-dom'; 
import { Menu, X } from 'lucide-react';

const LoginHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="flex items-center justify-between px-8 py-5 border-b border-gray-200 bg-white relative">
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-soft">
          <svg className="w-5.5 h-5.5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3L4 9v12h16V9l-8-6zm0 2.2L18 9.5V19H6V9.5l6-4.3z"/>
            <path d="M12 7L9 10h6l-3-3z"/>
          </svg>
        </div>
        <span className="text-2xl font-bold text-gray-900 tracking-tight">HomeEase</span>
      </div>

      {/* Desktop Links */}
     <div className="hidden md:flex items-center gap-4">
  <Link
    to="/register"
    className="text-sm px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-full font-semibold hover:bg-blue-600 hover:text-white transition-colors duration-200 cursor-pointer"
  >
    Sign Up
  </Link>
</div>


      {/* Mobile Hamburger */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-md flex flex-col items-center py-4 md:hidden z-10">
          <Link
            to="/register"
            className="btn-outline w-3/4 text-center mb-2 py-2"
            onClick={() => setIsOpen(false)} // close menu on click
          >
            Sign Up
          </Link>
        </div>
      )}
    </header>
  );
};

export default LoginHeader;
