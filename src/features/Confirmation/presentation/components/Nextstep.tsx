export default function NextStep({
  number,
  title,
  description,
  isRTLOrder,
}: any) {
  return (
    <div
      className={`flex items-start gap-3 ${
        isRTLOrder ? "flex-row-reverse text-right" : "text-left"
      }`}
    >
      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-xs font-bold text-emerald-600">
          {number}
        </span>
      </div>

      <div>
        <h4 className="text-sm font-bold text-gray-900">
          {title}
        </h4>

        <p className="text-sm text-gray-500">
          {description}
        </p>
      </div>
    </div>
  );
}