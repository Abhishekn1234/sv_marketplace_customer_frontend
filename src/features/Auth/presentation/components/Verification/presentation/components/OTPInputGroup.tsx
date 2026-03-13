import { useLanguage } from "@/features/context/LanguageContext";

type Props = {
  otp: string[];
  timeLeft: number;
  inputsRef: React.MutableRefObject<(HTMLInputElement | null)[]>;
  handleChange: (value: string, index: number) => void;
  handleKeyDown: (e: React.KeyboardEvent, index: number) => void;
  handlePaste: (e: React.ClipboardEvent) => void;
  resend: () => void;
  disabled: boolean;
};

export default function OTPSection({
  otp,
  timeLeft,
  inputsRef,
  handleChange,
  handleKeyDown,
  handlePaste,
  resend,
  disabled,
}: Props) {
  const { t } = useLanguage();

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  const isExpired = timeLeft === 0;

  return (
    <div className="text-center mb-8">

      {/* Title */}
      <p className="text-xs font-bold uppercase tracking-wide mb-4">
        {t.verification.enter_code}
      </p>

      {/* TIMER */}
      <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 mb-6 bg-gray-50 border border-gray-200 rounded-full font-semibold text-sm sm:text-base">
        {t.verification.expires_in}{" "}
        <strong>
          {minutes}:{seconds}
        </strong>
      </div>

      {/* OTP INPUTS */}
      <div className="flex justify-center gap-2 sm:gap-3 flex-wrap mb-6">
        {otp.map((value, i) => (
          <input
            key={i}
            ref={(el) => {(inputsRef.current[i] = el)}}
            value={value}
            onChange={(e) => handleChange(e.target.value, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onPaste={handlePaste}
            maxLength={1}
            inputMode="numeric"
            disabled={disabled || isExpired}
            placeholder="•"
            className={`
              w-11 sm:w-14 h-12 sm:h-16
              rounded-xl sm:rounded-2xl
              border-2
              text-center
              text-lg sm:text-2xl
              font-bold
              bg-gray-50 text-gray-900
              ${value ? "border-emerald-500 bg-white" : "border-gray-200"}
              ${disabled || isExpired ? "opacity-50 cursor-not-allowed" : ""}
              focus:outline-none focus:border-blue-600
              focus:ring-4 focus:ring-blue-100
              transition
            `}
          />
        ))}
      </div>

      {/* RESEND */}
      <div className="mt-2 text-sm text-gray-500">
        {t.verification.resend_question}{" "}
        <button
          disabled={!isExpired}
          onClick={resend}
          className="font-bold text-blue-600 disabled:text-gray-400 underline"
        >
          {t.verification.resend}
        </button>
      </div>
    </div>
  );
}