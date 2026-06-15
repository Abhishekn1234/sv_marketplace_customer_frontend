import Button from "@/components/input/Button";
import { useLanguage } from "@/features/context/LanguageContext";
import type { Dispatch, SetStateAction } from "react";


interface Props {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
}

export default function BookingHistoryFilter({
  activeTab,
  setActiveTab,
}: Props) {
  const {t}=useLanguage();
 const tabs = [
  { key: "All", label: t.Bookingspage.status.All },
  { key: "Cancelled", label: t.Bookingspage.status.Cancelled },
  { key: "Completed", label: t.Bookingspage.status.Completed },
  { key: "Requested", label: t.Bookingspage.status.Requested },
  { key: "inProgress", label: t.Bookingspage.status.inProgress },
  { key: "WorkerAccepted", label: t.Bookingspage.status.WorkerAccepted },
  { key: "InvoiceGenerated", label: t.Bookingspage.status.InvoiceGenerated },
  { key: "Paid", label: t.Bookingspage.status.Paid },
  {key:"Refunded",label:t.Bookingspage.status.Refunded}
];
  return (
    <div className="w-full mb-6">
      <div
        className="
        flex gap-3
        overflow-x-auto
        scrollbar-hide
        pb-2
      "
      >
       {tabs.map((tab) => (
 <Button
  key={tab.key}
  onClick={() => setActiveTab(tab.key)}
  radius="full"
  className={`
    px-4 sm:px-5
    py-2 sm:py-2.5
    text-xs sm:text-sm
    font-medium
    whitespace-nowrap
    transition-all duration-200

    border

    flex items-center justify-center gap-2

    focus:outline-none focus:ring-2 focus:ring-blue-200

    ${
      activeTab === tab.key
        ? "bg-blue-600 border-blue-600 text-white shadow-sm"
        : "bg-white border-gray-200 text-gray-500 hover:border-blue-600 hover:text-blue-600"
    }
  `}
>
  {tab.label}
</Button>
))}
      </div>
    </div>
  );
}

