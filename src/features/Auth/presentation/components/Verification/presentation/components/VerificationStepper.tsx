import { useLanguage } from "@/features/context/LanguageContext";
import StepperStep from "./Stepperstep";

export default function VerificationStepper() {
  const { t } = useLanguage();

  return (
    <div className="bg-white border-b border-gray-200 py-6">
      <div className="max-w-xl mx-auto flex items-center justify-center gap-4">
        <StepperStep
          label={t.verification.step_account}
          status="completed"
        />
        <div className="w-16 h-[2px] bg-gray-200" />
        <StepperStep
          label={t.verification.step_verification}
          status="active"
        />
      </div>
    </div>
  );
}
