
type Props = {
  label: string;
  status: "completed" | "active" | "pending"; 
  stepNumber: number;
};

export default function StepperStep({ label, status, stepNumber }: Props) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
          ${status === "completed"
            ? "bg-emerald-500 text-white"
            : status === "active"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-500"}`} // style for pending
      >
        {status === "completed" ? "✓" : stepNumber}
      </div>
      <span className={`text-xs font-bold uppercase tracking-wide
        ${status === "pending" ? "text-gray-400" : ""}`}>
        {label}
      </span>
    </div>
  );
}