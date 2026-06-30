import { useLanguage } from "@/features/context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { DangerZoneIcon, DeleteAccountIcon, SecurityIcon } from "@/components/icons";
import Button from "@/components/input/Button";
import CommonCard from "@/components/common/CommonCards";
// DeleteAccountIcon
export default function DangerZone() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <CommonCard className="mt-6 bg-red-50 border-red-200 p-4 sm:p-6">

      {/* Title */}
      <h3 className="text-base sm:text-[18px] font-bold text-red-600 mb-4 sm:mb-6 flex items-center gap-2">
        <DangerZoneIcon className="w-5 h-5 text-red-600" />
        {t.profilepage.dangerZone}
      </h3>

      {/* Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

        {/* Change Password */}
        <Button
          onClick={() => navigate("/changepassword")}
          leftIcon={<SecurityIcon className="w-[18px] h-[18px]" />}
          className="
            w-full
            flex items-center justify-center gap-2
            px-4 sm:px-5 py-3 sm:py-[14px]
            bg-white border-2 border-red-200
            rounded-xl text-sm sm:text-[14px] font-semibold text-red-600
            transition-all duration-200
            hover:bg-red-600 hover:text-white hover:border-red-600
          "
        >
          {t.profilepage.changePassword}
        </Button>

        {/* Delete Account */}
        <Button
          leftIcon={<DeleteAccountIcon className="w-[18px] h-[18px]" />}
          className="
            w-full
            flex items-center justify-center gap-2
            px-4 sm:px-5 py-3 sm:py-[14px]
            bg-white border-2 border-red-200
            rounded-xl text-sm sm:text-[14px] font-semibold text-red-600
            transition-all duration-200
            hover:bg-red-600 hover:text-white hover:border-red-600
          "
        >
          {t.profilepage.deleteAccount}
        </Button>

      </div>

    </CommonCard>
  );
}