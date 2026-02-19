export default function ProgressBar({ value = 65 }: { value?: number }) {
  return (
    <div className="w-full">
      <div className="h-1.5 w-full bg-gray-200">
        <div
          className="h-full bg-teal-600 transition-all duration-300"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

