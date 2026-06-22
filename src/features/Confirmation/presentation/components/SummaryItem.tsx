export default function SummaryItem({
  label,
  value,
  isRTLOrder = false,
}: any) {
  return (
    <div
      className={`flex flex-col gap-1 ${
        isRTLOrder ? "text-right" : "text-left"
      }`}
    >
      <span className="text-sm text-gray-500 font-medium">
        {label}
      </span>

      <span className="text-base font-bold text-gray-900 break-words">
        {value}
      </span>
    </div>
  );
}