import React from "react";

const RecentServices: React.FC = () => {
  return (
    <aside className="flex flex-col gap-5  top-6">
    
      <div className="bg-white rounded-[20px] p-6 border border-gray-200 transition-all duration-300 hover:shadow-lg">
        
        <div className="flex items-center justify-between mb-5">
          <span className="text-[18px] font-bold text-gray-900">Recent</span>

          <div className="w-9 h-9 bg-gray-100 rounded-[10px] flex items-center justify-center transition-all duration-200 hover:bg-blue-100 hover:rotate-[15deg]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-[18px] h-[18px] text-gray-500"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
        </div>

        {/* Recent List */}
        <div className="flex flex-col gap-4">
          <RecentItem
            title="AC Service"
            date="Jun 12"
            price="$79"
            icon={
              <>
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </>
            }
          />

          <RecentItem
            title="Plumbing"
            date="May 28"
            price="$69"
            icon={
              <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
            }
          />

          <RecentItem
            title="Home Clean"
            date="May 15"
            price="$49"
            icon={
              <>
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 3v18" />
                <path d="M15 3v18" />
              </>
            }
          />
        </div>
      </div>
    </aside>
  );
};

export default RecentServices;

/* ---------- Sub Component ---------- */

interface RecentItemProps {
  title: string;
  date: string;
  price: string;
  icon: React.ReactNode;
}

const RecentItem: React.FC<RecentItemProps> = ({
  title,
  date,
  price,
  icon,
}) => {
  return (
    <div
      role="button"
      tabIndex={0}
      className="
        flex items-center gap-3.5
        p-2 -m-2 rounded-xl
        cursor-pointer
        transition-all duration-200
        hover:bg-gray-50 hover:translate-x-1
        group
      "
    >
      {/* Icon */}
      <div
        className="
          w-11 h-11
          bg-gray-100 rounded-xl
          flex items-center justify-center
          flex-shrink-0
          transition-all duration-200
          group-hover:bg-blue-100
        "
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="
            w-[22px] h-[22px]
            text-gray-600
            transition-colors duration-200
            group-hover:text-blue-600
          "
        >
          {icon}
        </svg>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="text-[15px] font-semibold text-gray-900 truncate">
          {title}
        </div>
        <div className="text-[13px] text-gray-400">{date}</div>
      </div>

      {/* Price */}
      <div className="text-right flex-shrink-0">
        <div className="text-[15px] font-semibold text-gray-900">
          {price}
        </div>
        <div
          className="
            text-[13px] font-semibold
            text-amber-600
            inline-flex items-center gap-1
            transition-all duration-200
            group-hover:gap-2 group-hover:text-amber-700
          "
        >
          Rebook →
        </div>
      </div>
    </div>
  );
};
