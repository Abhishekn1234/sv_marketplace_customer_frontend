import type { Dispatch, SetStateAction } from "react";

const tabs = ["All", "In Progress", "Completed", "Requested", "Cancelled"];

interface Props {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
}

export default function BookingHistoryFilter({
  activeTab,
  setActiveTab,
}: Props) {
  return (
    <div className="flex gap-3 mb-7 flex-wrap">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`
            px-5 py-2.5
            text-sm font-medium
            rounded-full
            border cursor-pointer
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
  );
}

