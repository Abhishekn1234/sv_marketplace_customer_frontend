import { useLanguage } from "@/features/context/LanguageContext";
import StepperStep from "./Stepperstep";
import { useVerificationStore } from "@/features/core/store/usestep";

export default function VerificationStepper() {
  const { t } = useLanguage();
  const { step } = useVerificationStore(); // 1 = account, 2 = verification

  return (
    <div className="bg-white border-b border-gray-200 py-6">
      <div className="max-w-xl mx-auto flex items-center justify-center gap-4">
        {/* Account Step */}
        <StepperStep
          label={t.verification.step_account}
          stepNumber={1}
          status={step === 1 ? "active" : step > 1 ? "completed" : "pending"}
        />

        {/* Connector Line */}
        <div className="w-16 h-[2px] bg-gray-200" />

        {/* Verification Step */}
        <StepperStep
          label={t.verification.step_verification}
          stepNumber={2}
          status={step === 2 ? "active" : step > 2 ? "completed" : "pending"}
        />
      </div>
    </div>
  );
}