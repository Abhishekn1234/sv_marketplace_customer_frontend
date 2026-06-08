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
  const isSelectAllMode = allSelected;

  return (
    <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md px-4 sm:px-5 py-3.5 border-b border-gray-100/80">
      <div className="flex justify-between items-center gap-3">

        {/* SELECT ALL */}
        <Button
          onClick={toggleSelectAll}
          variant="ghost"
          disabled={total === 0}
          className={`
            flex items-center gap-2 text-[13px] font-semibold p-0 h-auto transition-colors
            ${total === 0 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:text-blue-600"}
          `}
        >
          {allSelected ? (
            <CheckSquare className="w-[18px] h-[18px] text-blue-600" />
          ) : (
            <Square className="w-[18px] h-[18px] text-gray-300" />
          )}
          <span>
            {allSelected
              ? t.notificationpage.unselect
              : t.notificationpage.selectAll}
          </span>
          {total > 0 && (
            <span className="text-[11px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
              {total}
            </span>
          )}
        </Button>

        {/* ACTIONS */}
        <div className="flex gap-2">
          {isSelectAllMode && (
            <Button
              onClick={markAllAsRead}
              className="
                flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold
                bg-emerald-500 hover:bg-emerald-600 text-white
                transition-all active:scale-95 shadow-sm shadow-emerald-200
              "
              leftIcon={<BellRing className="w-3.5 h-3.5" />}
            >
              {t.notificationpage.markAllRead}
            </Button>
          )}

          {hasSelection && !isSelectAllMode && (
            <Button
              onClick={markSelectedAsRead}
              className="
                flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold
                bg-blue-600 hover:bg-blue-700 text-white
                transition-all active:scale-95 shadow-sm shadow-blue-200
              "
              leftIcon={<BellRing className="w-3.5 h-3.5" />}
            >
              {t.notificationpage.read}
              <span className="bg-blue-500 text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full">
                {selected.length}
              </span>
            </Button>
          )}
        </div>

      </div>
    </div>
  );
}