import { useNavigate } from "react-router-dom";

export default function DangerZone() {
  const navigate=useNavigate();
  return (
    <div className="mt-6 bg-red-50 border border-red-200 rounded-[20px] p-8">
      
      {/* Title */}
      <h3 className="text-[18px] font-bold text-red-600 mb-6 flex items-center gap-2">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="w-5 h-5 text-red-600"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        Danger Zone
      </h3>

      {/* Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        
        {/* Change Password */}
        <button onClick={()=>navigate('/changepassword')} className="flex items-center justify-center gap-2 px-5 py-[14px] bg-white border-2 border-red-200 rounded-xl text-[14px] font-semibold text-red-600 transition-all duration-200 hover:bg-red-600 hover:text-white hover:border-red-600">
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
          Change Password
        </button>

        {/* Delete Account */}
        <button className="flex items-center justify-center gap-2 px-5 py-[14px] bg-white border-2 border-red-200 rounded-xl text-[14px] font-semibold text-red-600 transition-all duration-200 hover:bg-red-600 hover:text-white hover:border-red-600">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-[18px] h-[18px]"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
          </svg>
          Delete Account
        </button>

      </div>
    </div>
  );
}
