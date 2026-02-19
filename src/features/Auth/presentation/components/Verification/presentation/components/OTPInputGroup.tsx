import { useLanguage } from "@/features/context/LanguageContext";

type Props = {
  otp: string[];
  timeLeft: number;
  inputsRef: React.MutableRefObject<(HTMLInputElement | null)[]>;
  handleChange: (value: string, index: number) => void;
  handleKeyDown: (e: React.KeyboardEvent, index: number) => void;
  handlePaste: (e: React.ClipboardEvent) => void;
  resend: () => void;
};

export default function OTPSection({
  otp,
  timeLeft,
  inputsRef,
  handleChange,
  handleKeyDown,
  handlePaste,
  resend,
}: Props) {
  const { t } = useLanguage();

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  return (
    <div className="text-center mb-8">
      <p className="text-xs font-bold uppercase tracking-wide mb-4">
        {t.verification.enter_code}
      </p>

      <div className="flex justify-center gap-3 mb-6">
        {otp.map((value, i) => (
          <input
            key={i}
            ref={(el) =>{ (inputsRef.current[i] = el)}}
            value={value}
            onChange={(e) => handleChange(e.target.value, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onPaste={handlePaste}
            maxLength={1}
            inputMode="numeric"
            placeholder="•"
            className={`
              w-14 h-16 rounded-2xl border-2
              text-center text-2xl font-bold
              bg-gray-50 text-gray-900
              ${value ? "border-emerald-500 bg-white" : "border-gray-200"}
              focus:outline-none focus:border-blue-600
              focus:ring-4 focus:ring-blue-100
            `}
          />
        ))}
      </div>

      {/* TIMER */}
      <div className="inline-flex items-center gap-2 px-5 py-2 bg-gray-50 border border-gray-200 rounded-full font-semibold">
        {t.verification.expires_in}
        <strong>{minutes}:{seconds}</strong>
      </div>

      {/* RESEND */}
      <div className="mt-4 text-sm text-gray-500">
        {t.verification.resend_question}{" "}
        <button
          disabled={timeLeft > 0}
          onClick={resend}
          className="font-bold text-blue-600 disabled:text-gray-400 underline"
        >
          {t.verification.resend}
        </button>
      </div>
    </div>
  );
}
