export function BookingHistoryDetailField({
  icon,
  label,
  value,
  valueClassName = "text-sm font-medium text-gray-900",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="space-y-1">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
        {icon}
        {label}
      </p>
      <p className={valueClassName}>{value}</p>
    </div>
  );
}