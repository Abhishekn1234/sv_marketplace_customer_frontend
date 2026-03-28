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
  <button
    key={tab.key}
    onClick={() => setActiveTab(tab.key)}
    className={`
      flex-shrink-0
      px-4 sm:px-5
      py-2 sm:py-2.5
      text-xs sm:text-sm
      font-medium
      rounded-full
      border
      whitespace-nowrap
      transition-all duration-200
      ${
        activeTab === tab.key
          ? "bg-blue-600 border-blue-600 text-white"
          : "bg-white border-gray-200 text-gray-500 hover:border-blue-600 hover:text-blue-600"
      }
    `}
  >
    {tab.label}
  </button>
))}
      </div>
    </div>
  );
}

