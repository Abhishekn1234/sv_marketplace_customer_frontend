import { Link } from 'react-router-dom'; 

const RegisterHeader = () => {
  return (
    <header className="flex items-center justify-between px-8 py-5 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-soft">
          <svg className="w-5.5 h-5.5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3L4 9v12h16V9l-8-6zm0 2.2L18 9.5V19H6V9.5l6-4.3z" />
            <path d="M12 7L9 10h6l-3-3z" />
          </svg>
        </div>
        <span className="text-2xl font-bold text-gray-900 tracking-tight">HomeEase</span>
      </div>

      {/* Sign In button navigates to /login */}
      <Link
        to="/login"
        className="btn-primary text-sm px-6 py-2.5"
      >
        Sign In
      </Link>
    </header>
  );
};

export default RegisterHeader;
