type Props = {
  title: string;
  status: string;
};

export default function JobTrackingHeaders({ title, status }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-6">
      
      {/* Title */}
      <h2 className="text-base sm:text-lg font-bold leading-snug">
        {title}
      </h2>

      {/* Status badge */}
      <div className="self-start sm:self-auto px-3 py-1 bg-emerald-100 text-emerald-600 text-xs sm:text-sm rounded-full w-fit">
        {status}
      </div>

    </div>
  );
}