import { Trash2, CheckSquare, Square, BellRing } from "lucide-react";

interface Props {
  toggleSelectAll: () => void;
  selected: number[];
  total: number;
  markAllAsRead: () => void;
  deleteSelected: () => void;
  unreadCount: number;
}

export default function NotificationHeader({
  toggleSelectAll,
  selected,
  total,
  markAllAsRead,
  deleteSelected,
  unreadCount,
}: Props) {
  const allSelected = selected.length === total && total > 0;

  return (
    <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-5 gap-4">
        
        {/* Left Section - Select All */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button
            onClick={toggleSelectAll}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors group"
          >
            <div className="relative">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
                className="sr-only"
              />
              {allSelected ? (
                <CheckSquare className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
              ) : (
                <Square className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:scale-110 transition-all" />
              )}
            </div>
            <span className="hidden sm:inline">
              {allSelected ? "Deselect All" : "Select All"}
            </span>
            <span className="sm:hidden">
              {selected.length > 0 ? `${selected.length} selected` : "Select"}
            </span>
          </button>

          {selected.length > 0 && (
            <span className="text-sm bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium animate-fade-in">
              {selected.length} selected
            </span>
          )}
        </div>

        {/* Right Section - Actions */}
        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 transform active:scale-95 ${
              unreadCount === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-200 hover:shadow-lg hover:from-blue-600 hover:to-blue-700 hover:-translate-y-0.5"
            }`}
          >
            <BellRing className="w-4 h-4" />
            <span className="hidden xs:inline">Mark All Read</span>
            <span className="xs:hidden">Read</span>
          </button>

          <button
            onClick={deleteSelected}
            disabled={selected.length === 0}
            className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 transform active:scale-95 ${
              selected.length === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md shadow-red-200 hover:shadow-lg hover:from-red-600 hover:to-red-700 hover:-translate-y-0.5"
            }`}
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden xs:inline">Delete Selected</span>
            <span className="xs:hidden">Delete</span>
          </button>
        </div>
      </div>

      {/* Selection mode indicator */}
      {selected.length > 0 && (
        <div className="bg-blue-50/80 backdrop-blur-sm px-4 py-2 border-t border-blue-100">
          <p className="text-xs text-blue-700 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
            {selected.length} notification{selected.length !== 1 ? 's' : ''} selected. 
            <span className="text-blue-500">Choose an action above.</span>
          </p>
        </div>
      )}
    </div>
  );
}
