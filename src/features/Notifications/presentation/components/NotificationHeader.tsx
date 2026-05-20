import Button from "@/components/input/Button";
import { useLanguage } from "@/features/context/LanguageContext";
import { CheckSquare, Square, BellRing } from "lucide-react";

export default function NotificationHeader({
  toggleSelectAll,
  selected,
  total,
  markAllAsRead,
  markSelectedAsRead,
}: any) {
  const { t } = useLanguage();

  const hasSelection = selected.length > 0;

  const allSelected = total > 0 && selected.length === total;

  // ✅ Detect select-all mode
  const isSelectAllMode = allSelected;

  return (
    <div className="sticky top-0 bg-white/80 backdrop-blur-md px-4 py-3 z-10 border-b border-gray-100">
      <div className="flex justify-between items-center">

        {/* SELECT ALL */}
        <Button
          onClick={toggleSelectAll}
          variant="ghost"
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
          disabled={total === 0}
        >
          {allSelected ? (
            <CheckSquare className="w-5 h-5 text-blue-600" />
          ) : (
            <Square className="w-5 h-5 text-gray-400" />
          )}

          {allSelected
            ? t.notificationpage.unselect
            : t.notificationpage.selectAll}
        </Button>

        {/* ACTIONS */}
        <div className="flex gap-2">

          {/* CASE 1: SELECT ALL MODE → SHOW MARK ALL READ */}
          {isSelectAllMode && (
            <Button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium flex items-center gap-2 transition-all shadow-sm"
              leftIcon={<BellRing className="w-4 h-4" />}
            >
              {t.notificationpage.markAllRead}
            </Button>
          )}

          {/* CASE 2: NORMAL SELECTION → SHOW READ SELECTED */}
          {hasSelection && !isSelectAllMode && (
            <Button
              onClick={markSelectedAsRead}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium flex items-center gap-2 transition-all shadow-sm"
              leftIcon={<BellRing className="w-4 h-4" />}
            >
              {t.notificationpage.read}
            </Button>
          )}

        </div>
      </div>
    </div>
  );
}