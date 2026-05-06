import { useLanguage } from "@/features/context/LanguageContext";
import React from "react";
import {
  QuickActionsIcon,
  SecurityIcon,
  BillingIcon,
  PrivacyIcon,
  HelpIcon,
} from "@/components/icons";
import { useNavigate } from "react-router-dom";
import Button from "@/components/input/Button";
import CommonCard from "@/components/common/CommonCards";

export default function QuickActions() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <CommonCard className="mt-2">
      
      {/* Title */}
      <h3 className="flex items-center gap-2.5 text-[18px] font-bold text-gray-900 mb-6">
        <QuickActionsIcon className="w-5 h-5 text-blue-600" />
        {t.profilepage.quickActions}
      </h3>

      {/* Buttons Grid */}
      <div className="grid grid-cols-2 gap-3">

        <ActionButton
          onClick={() => navigate("/security")}
          leftIcon={<SecurityIcon className="w-[18px] h-[18px]" />}
        >
          {t.profilepage.security}
        </ActionButton>

        <ActionButton
          onClick={() => navigate("/help")}
          leftIcon={<BillingIcon className="w-[18px] h-[18px]" />}
        >
          {t.profilepage.billing}
        </ActionButton>

        <ActionButton
          onClick={() => navigate("/privacy")}
          leftIcon={<PrivacyIcon className="w-[18px] h-[18px]" />}
        >
          {t.profilepage.privacy}
        </ActionButton>

        <ActionButton
          onClick={() => navigate("/help")}
          leftIcon={<HelpIcon className="w-[18px] h-[18px]" />}
        >
          {t.profilepage.help}
        </ActionButton>

      </div>
    </CommonCard>
  );
}

function ActionButton({
  children,
  onClick,
  leftIcon
}: {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  leftIcon?:React.ReactNode;
}) {
  return (
    <Button
      onClick={onClick}
      className="flex items-center justify-center gap-2 px-5 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-900 transition-all duration-200 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600"
     leftIcon={leftIcon}
    >
      {children}
    </Button>
  );
}
