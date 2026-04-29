import { Trash2, CheckSquare, Square, BellRing } from "lucide-react";
// import { useLanguage } from "@/features/context/LanguageContext";

export default function NotificationHeader({
  toggleSelectAll,
  selected,
  total,
  markAllAsRead,
  deleteSelected,
  unreadCount,
}: any) {
  // const { t } = useLanguage();
  const allSelected = selected.length === total && total > 0;

  return (
    <div className="sticky top-0 bg-white border-b px-4 py-3 z-10">
      <div className="flex flex-wrap justify-between items-center gap-3">

        {/* Select All */}
        <button
          onClick={toggleSelectAll}
          className="flex items-center gap-2 text-sm"
        >
          {allSelected ? (
            <CheckSquare className="text-blue-600" />
          ) : (
            <Square className="text-gray-400" />
          )}
          {selected.length > 0
            ? `${selected.length} selected`
            : "Select"}
        </button>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:bg-gray-300"
          >
            <BellRing className="w-4 h-4 inline mr-1" />
            Read
          </button>

          <button
            onClick={deleteSelected}
            disabled={selected.length === 0}
            className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm disabled:bg-gray-300"
          >
            <Trash2 className="w-4 h-4 inline mr-1" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}