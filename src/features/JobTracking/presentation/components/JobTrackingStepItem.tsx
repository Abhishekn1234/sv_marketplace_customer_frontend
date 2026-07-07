// components/JobTrackingStepItem.tsx

import Button from "@/components/input/Button";
import { TickIcon } from "@/components/icons";
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
  const buttonClass =
    "mt-3 flex w-full sm:w-fit items-center justify-center rounded-md px-4 py-2 text-center text-sm font-medium text-white transition-colors duration-200 whitespace-normal break-words";

  return (
    <div className="relative pb-7">
      {/* Timeline Icon */}
      <div className="absolute -left-8 flex h-6 w-6 items-center justify-center">
        {step.status === "completed" ? (
          <div className="flex h-6 w-6 items-center justify-center rounded-full ">
            <TickIcon  />
          </div>
        ) : (
          <div
            className={`h-4 w-4 rounded-full ${
              step.status === "active"
                ? "bg-blue-500 animate-pulse"
                : "bg-gray-300"
            }`}
          />
        )}
      </div>

      {/* Card */}
      <div className="rounded-lg bg-gray-50 p-4 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900">
          {step.title}
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          {step.time}
        </p>

        {/* Action Buttons */}
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {step.showStartOtpButton && (
            <Button
              onClick={onStartOtp}
              className={`${buttonClass} bg-blue-600 hover:bg-blue-700`}
            >
              {t.jobtrackingpage.buttons.startWorkOtp}
            </Button>
          )}

          {step.showCompleteOtpButton && (
            <Button
              onClick={onCompleteOtp}
              className={`${buttonClass} bg-green-600 hover:bg-green-700`}
            >
              {t.jobtrackingpage.buttons.completeWorkOtp}
            </Button>
          )}

          {step.showPaymentButton && (
            <Button
              onClick={onPayNow}
              className={`${buttonClass} bg-red-500 hover:bg-red-600`}
            >
              {t.jobtrackingpage.buttons.payNow}
            </Button>
          )}

          {step.showVerifyButton && (
            <Button
              onClick={onVerifyPayment}
              disabled={isVerifyPending}
              className={`${buttonClass} bg-emerald-600 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {isVerifyPending
                ? t.common?.loading || "Verifying..."
                : t.jobtrackingpage.buttons.verifyPayment}
            </Button>
          )}

          {step.showServiceRatingButton && (
            <Button
              onClick={onRateService}
              className={`${buttonClass} bg-yellow-500 hover:bg-yellow-600`}
            >
              {t.jobtrackingpage.buttons.rateService}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}