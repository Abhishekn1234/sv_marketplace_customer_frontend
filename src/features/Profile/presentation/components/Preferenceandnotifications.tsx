import { useState } from "react";

export default function PrefeneceandNotifications() {
  const [email, setEmail] = useState(true);
  const [sms, setSms] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  const Toggle = ({
    enabled,
    setEnabled,
  }: {
    enabled: boolean;
    setEnabled: (v: boolean) => void;
  }) => (
    <button
      onClick={() => setEnabled(!enabled)}
      className={`relative w-11 h-6 rounded-full transition-all duration-200 ${
        enabled ? "bg-blue-600" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${
          enabled ? "translate-x-5" : ""
        }`}
      />
    </button>
  );

  return (
    <div className="bg-white rounded-[20px] p-5 sm:p-8 shadow-sm border border-gray-200 mt-6">
      
      {/* Title */}
      <h3 className="text-base sm:text-[18px] font-bold text-gray-900 mb-6 flex items-center gap-2">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="w-5 h-5 text-blue-600"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v6m0 6v6m5.2-13.2l-4.2 4.2m0 6l4.2 4.2M23 12h-6m-6 0H1m16.8-5.2l-4.2 4.2m0 6l4.2 4.2" />
        </svg>
        Preferences & Notifications
      </h3>

      {/* Preference List */}
      <div className="flex flex-col gap-4">
        
        {[{
          label: "Email Notifications",
          desc: "Receive booking updates via email",
          state: email,
          setState: setEmail,
          icon: (
            <>
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </>
          )
        },
        {
          label: "SMS Notifications",
          desc: "Get text messages for urgent updates",
          state: sms,
          setState: setSms,
          icon: (
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
          )
        },
        {
          label: "Two-Factor Authentication",
          desc: "Extra security for your account",
          state: twoFactor,
          setState: setTwoFactor,
          icon: (
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          )
        }].map((item, index) => (
          
          <div
            key={index}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-5 bg-gray-50 border-2 border-gray-200 rounded-2xl transition-all duration-200 hover:border-blue-600 hover:bg-white"
          >
            
            {/* Left Content */}
            <div className="flex items-start sm:items-center gap-4">
              
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white border-2 border-gray-200 rounded-xl shrink-0">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-blue-600"
                >
                  {item.icon}
                </svg>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-gray-900">
                  {item.label}
                </span>
                <span className="text-xs sm:text-[13px] text-gray-500">
                  {item.desc}
                </span>
              </div>
            </div>

            {/* Toggle */}
            <div className="self-end sm:self-auto">
              <Toggle enabled={item.state} setEnabled={item.setState} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

