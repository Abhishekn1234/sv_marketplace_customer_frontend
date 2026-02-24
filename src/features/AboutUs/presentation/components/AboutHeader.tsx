import CommonNotificationFloater from "@/components/common/CommonNotificationFloater";
import { useAuthStore } from "@/features/core/store/auth";
import { useNavigate } from "react-router-dom";

export default function AboutHeader() {
    const {customerData}=useAuthStore();
    const name=customerData.user?.fullName;
    const profileurl=customerData.user?.profilePictureUrl;
    const navigate=useNavigate();
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 max-w-7xl mx-auto">

        {/* LEFT SECTION */}
        <div className="flex items-center gap-6 sm:gap-8">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md cursor-pointer" onClick={()=>navigate('/')}>
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                <path d="M12 3L4 9v12h16V9l-8-6zm0 2.2L18 9.5V19H6V9.5l6-4.3z" />
                <path d="M12 7L9 10h6l-3-3z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              HomeEase
            </span>
          </div>

          {/* Back Button */}
          <button onClick={()=>navigate(-1)} className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-900 hover:border-blue-600 hover:bg-blue-50 transition-all duration-200">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-4 h-4"
            >
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-4 sm:gap-6">

          {/* Notification */}
         <CommonNotificationFloater/>

          {/* Divider */}
          <div className="hidden sm:block w-px h-8 bg-gray-200"></div>

          {/* User Profile */}
          <div className="flex items-center gap-3 cursor-pointer">
            <div onClick={()=>navigate('/profile')}>
              {
                profileurl?(
                 <div className="w-10 h-10 rounded-full  flex items-center justify-center">
                     <img src={profileurl}/>
                 </div>
                ):(
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-md">
                       <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                className="w-5 h-5"
              >
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
                  </div>
                )
              }
           
           
            </div>

            <div className="hidden md:block text-left">
              <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
                Premium
              </p>
              <p className="text-sm font-bold text-gray-900">
             {name}
              </p>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}

