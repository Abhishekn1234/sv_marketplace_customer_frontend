// components/JobTrackingStepItem.tsx
import Button from "@/components/input/Button";
import type { TrackingStep } from "../../domain/entities/jobtrackingsteps";

type Props = {
  step: TrackingStep;
  onStartOtp: () => void;
  onCompleteOtp: () => void;
  onPayNow: () => void;
  onVerifyPayment: () => void;
  onRateService: () => void;
  isVerifyPending: boolean;
  t: any;
};

export default function JobTrackingStepItem({
  step,
  onStartOtp,
  onCompleteOtp,
  onPayNow,
  onVerifyPayment,
  onRateService,
  isVerifyPending,
  t,
}: Props) {
  const dotClass =
    step.status === "completed"
      ? "bg-green-500"
      : step.status === "active"
      ? "bg-blue-600 animate-pulse active"
      : "bg-gray-300";

  return (
    <div className="relative pb-7">
      <div className={`absolute -left-8 w-5 h-5 rounded-full ${dotClass}`} />

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="font-semibold">{step.title}</div>
        <div className="text-sm text-gray-500">{step.time}</div>

        {step.showStartOtpButton && (
          <Button onClick={onStartOtp} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
            {t.jobtrackingpage.buttons.startWorkOtp}
          </Button>
        )}
        {step.showCompleteOtpButton && (
          <Button onClick={onCompleteOtp} className="mt-2 px-4 py-2 bg-green-600 text-white rounded">
            {t.jobtrackingpage.buttons.completeWorkOtp}
          </Button>
        )}
        {step.showPaymentButton && (
          <Button onClick={onPayNow} className="mt-2 px-4 py-2 bg-red-500 text-white rounded">
            {t.jobtrackingpage.buttons.payNow}
          </Button>
        )}
        {step.showVerifyButton && (
          <Button onClick={onVerifyPayment} disabled={isVerifyPending} className="mt-2 px-4 py-2 bg-green-500 text-white rounded">
            {t.jobtrackingpage.buttons.verifyPayment}
          </Button>
        )}
        {step.showServiceRatingButton && (
          <Button onClick={onRateService} className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded">
            {t.jobtrackingpage.buttons.rateService}
          </Button>
        )}
      </div>
    </div>
  );
}