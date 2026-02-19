type Props = {
  label: string;
  status: "completed" | "active";
};

export default function StepperStep({ label, status }: Props) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
        ${status === "completed"
          ? "bg-emerald-500 text-white"
          : "bg-blue-600 text-white"}`}
      >
        {status === "completed" ? "✓" : "2"}
      </div>
      <span className="text-xs font-bold uppercase tracking-wide">
        {label}
      </span>
    </div>
  );
}
