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
  const hasSelection = selected.length > 0;
  const allSelected = selected.length === total && total > 0;
  const {t}=useLanguage();
  return (
    <div className="sticky top-0 bg-white px-4 py-3 z-10 border-b">
      <div className="flex justify-between items-center">

        {/* SELECT ALL */}
        <Button
          onClick={toggleSelectAll}
          disabled={total === 0}
          className="flex items-center gap-2 text-sm"
        >
          {allSelected ? (
            <CheckSquare className="text-blue-600" />
          ) : (
            <Square className="text-gray-400" />
          )}

          {allSelected ? t.notificationpage.unselect : t.notificationpage.selectAll}
        </Button>

        {/* ACTIONS */}
        <div className="flex gap-2">

          {/* SHOW ONLY WHEN SELECTED */}
          {hasSelection && (
            <>
              {/* READ SELECTED */}
              <Button
                onClick={markSelectedAsRead}
                className="px-3 py-2 bg-blue-600 text-white rounded text-sm flex items-center gap-1"
                leftIcon={<BellRing className="w-4 h-4" />}
              >
              {t.notificationpage.read}
              </Button>

              {/* READ ALL */}
              <Button
                onClick={markAllAsRead}
                className="px-3 py-2 bg-green-600 text-white rounded text-sm flex items-center gap-1"
                leftIcon={<BellRing className="w-4 h-4" />}
              >
              {t.notificationpage.markAllRead}
              </Button>
            </>
          )}

        </div>
      </div>
    </div>
  );
}