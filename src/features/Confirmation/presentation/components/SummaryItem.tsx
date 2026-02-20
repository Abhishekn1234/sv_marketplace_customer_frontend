export default function SummaryItem({ label, value }: any) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-gray-500 font-medium">
        {label}
      </span>
      <span className="text-base font-bold text-gray-900">
        {value}
      </span>
    </div>
  );
}