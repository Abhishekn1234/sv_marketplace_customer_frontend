import { useLanguage } from "@/features/context/LanguageContext";

export const useTranslationMessages = () => {
  const { t } = useLanguage();

  return {
    "Work Completed OTP": t.jobtrackingpage.messages.workCompleteOtp,
    "Work Start OTP": t.jobtrackingpage.messages.workStartOtp,
    "Failed Start OTP": t.jobtrackingpage.messages.failedStartOtp,
    "Payment Verification Failed": t.jobtrackingpage.messages.paymentVerificationFailed,
    "Failed Complete OTP": t.jobtrackingpage.messages.failedCompleteOtp,
  };
};