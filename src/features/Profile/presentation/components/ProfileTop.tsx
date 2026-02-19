import { useNavigate } from "react-router-dom";

export default function ProfileTop() {
  const navigate = useNavigate();

  return (
    <div className="mb-2">
      
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 mb-6 text-sm font-semibold 
        text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="w-5 h-5"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>

        Back to Dashboard
      </button>

      {/* Page Title */}
      <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-gray-900 tracking-[-0.02em]">
        My Profile
      </h1>
    </div>
  );
}
