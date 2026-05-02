import {  CheckSquare, Square, BellRing } from "lucide-react";

export default function NotificationHeader({
  toggleSelectAll,
  selected,
  total,
  markAllAsRead,
  markSelectedAsRead,
  
}: any) {
  const hasSelection = selected.length > 0;
  const allSelected = selected.length === total && total > 0;

  return (
    <div className="sticky top-0 bg-white px-4 py-3 z-10">
      <div className="flex justify-between items-center">
    {hasSelection && (
       <button
          onClick={toggleSelectAll}
          disabled={total === 0}
          className="flex items-center gap-2 text-sm"
        >
          {allSelected ? (
            <CheckSquare className="text-blue-600" />
          ) : (
            <Square className="text-gray-400" />
          )}
          {hasSelection
            ? `${selected.length} selected`
            : "Select All"}
        </button>

    )}
      
       <div className="flex gap-2">
  {hasSelection && (
    allSelected ? (
      // ✅ ALL SELECTED
      <button
        onClick={markAllAsRead}
        className="px-3 py-2 bg-blue-600 text-white rounded text-sm flex items-center gap-1"
      >
        <BellRing className="w-4 h-4" />
        Read All
      </button>
    ) : (
      // ✅ PARTIAL SELECTION
      <>
        <button
          onClick={markSelectedAsRead}
          className="px-3 py-2 bg-blue-600 text-white rounded text-sm flex items-center gap-1"
        >
          <BellRing className="w-4 h-4" />
          Read Selected
        </button>

       
      </>
    )
  )}
</div>
      </div>
    </div>
  );
}