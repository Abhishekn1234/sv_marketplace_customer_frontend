// components/JobTrackingHeader.tsx
type Props = {
  title: string;
  status: string;
};

export default function JobTrackingHeaders({ title, status }: Props) {
  return (
    <div className="flex justify-between mb-6">
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="px-3 py-1 bg-emerald-100 text-emerald-600 text-xs rounded-full">
        {status}
      </div>
    </div>
  );
}