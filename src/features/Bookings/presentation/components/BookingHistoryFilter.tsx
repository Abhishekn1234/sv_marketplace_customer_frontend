import type { Dispatch, SetStateAction } from "react";

const tabs = [
  "All",
  "In Progress",
  "Completed",
  "Requested",
  "Cancelled",
  "Invoice Generated",
  "Worker Accepted"
];

interface Props {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
}

export default function BookingHistoryFilter({
  activeTab,
  setActiveTab,
}: Props) {
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
            key={tab}
            onClick={() => setActiveTab(tab)}
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
                activeTab === tab
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-white border-gray-200 text-gray-500 hover:border-blue-600 hover:text-blue-600"
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}

