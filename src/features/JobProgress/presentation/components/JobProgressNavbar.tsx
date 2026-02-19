export default function JobProgressNavbar() {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 relative">
      
      {/* Top Row (Logo + Actions on Mobile) */}
      <div className="flex items-center justify-between w-full sm:w-auto">
        
        {/* Logo */}
        <div className="flex items-center gap-2.5 transition-transform duration-200 hover:scale-[1.02]">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
              <path d="M12 2.1L2 9.6v11.3h8.2v-6.5h3.6v6.5H22V9.6L12 2.1z" />
            </svg>
          </div>
          <span className="text-[20px] sm:text-[22px] font-bold text-gray-900 tracking-[-0.5px]">
            HomeEase
          </span>
        </div>

        {/* Header Actions (Mobile right side) */}
        <div className="flex items-center gap-3 sm:hidden">
          <NotificationButton />
          <UserAvatar />
        </div>
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 text-gray-500 text-sm sm:text-[15px] font-medium px-4 py-2 bg-white rounded-full border border-gray-200 transition-all duration-200 cursor-pointer hover:border-blue-600 hover:text-blue-600 hover:shadow-sm group w-fit">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] text-blue-600 transition-transform duration-200 group-hover:-translate-y-0.5"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <span>Los Angeles, CA</span>
      </div>

      {/* Desktop Actions */}
      <div className="hidden sm:flex items-center gap-4">
        <NotificationButton />
        <UserAvatar />
      </div>
    </header>
  );
}

/* 🔹 Notification Button */
function NotificationButton() {
  return (
    <button className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl border border-gray-200 bg-white flex items-center justify-center relative transition-all duration-200 hover:border-blue-600 hover:bg-blue-50 hover:-translate-y-0.5 hover:shadow-md group">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="w-5 h-5 text-gray-500 transition-colors duration-200 group-hover:text-blue-600"
      >
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </svg>

      <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-ping"></span>
      <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
    </button>
  );
}

/* 🔹 User Avatar */
function UserAvatar() {
  return (
    <img
      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
      alt="User"
      className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover cursor-pointer transition-all duration-200 border-2 border-transparent hover:border-blue-600 hover:scale-105 hover:shadow-md"
    />
  );
}

