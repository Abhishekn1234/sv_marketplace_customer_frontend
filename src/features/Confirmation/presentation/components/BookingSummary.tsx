import SummaryItem from "./SummaryItem";

export default function BookingSummaryCard({
  data,
  placeName,
  tierName,
  duration,
}: any) {
  return (
    <div className="bg-white border rounded-xl p-6">
      <div className="grid grid-cols-2 gap-4">

        <SummaryItem label="Service" value={data?.serviceId?.name} />
        <SummaryItem label="Tier" value={tierName} />
        <SummaryItem label="Location" value={placeName} />
        <SummaryItem label="Duration" value={duration} />

      </div>
    </div>
  );
}