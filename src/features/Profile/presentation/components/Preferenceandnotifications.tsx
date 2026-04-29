import { useLanguage } from "@/features/context/LanguageContext";
import { useState } from "react";
import { Toggle } from "@/components/input";
import {
  PreferencesIcon,
  EmailNotificationIcon,
  SmsNotificationIcon,
  TwoFactorAuthIcon,
} from "@/components/icons";

export default function PrefeneceandNotifications() {
  const [email, setEmail] = useState(true);
  const [sms, setSms] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const {t}=useLanguage();

  return (
    <div className="bg-white rounded-[20px] p-5 sm:p-8 shadow-sm border border-gray-200 mt-6">
      
      {/* Title */}
     <h3 className="text-base sm:text-[18px] font-bold text-gray-900 mb-6 flex items-center gap-2">
            <PreferencesIcon className="w-5 h-5 text-blue-600" />
            {t.profilepage.preferences}
          </h3>

      {/* Preference List */}
      <div className="flex flex-col gap-4">
        
        {[{
          label: t.profilepage.emailNotifications,
          desc: t.profilepage.emailDesc,
          state: email,
          setState: setEmail,
          icon: EmailNotificationIcon,
        },
        {
          label: t.profilepage.smsNotifications,
          desc: t.profilepage.smsDesc,
          state: sms,
          setState: setSms,
          icon: SmsNotificationIcon,
        },
        {
          label: t.profilepage.twoFactor,
          desc: t.profilepage.twoFactorDesc,
          state: twoFactor,
          setState: setTwoFactor,
          icon: TwoFactorAuthIcon,
        }].map((item, index) => (
          
          <div
            key={index}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-5 bg-gray-50 border-2 border-gray-200 rounded-2xl transition-all duration-200 hover:border-blue-600 hover:bg-white"
          >
            
            {/* Left Content */}
            <div className="flex items-start sm:items-center gap-4">
              
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white border-2 border-gray-200 rounded-xl shrink-0">
                <item.icon className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-blue-600" />
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
