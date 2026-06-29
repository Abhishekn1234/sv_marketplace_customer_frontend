import { BellRing, CheckSquare, Square } from "@/components/icons";
import Button from "@/components/input/Button";
import { useLanguage } from "@/features/context/LanguageContext";

interface NotificationHeaderProps {
  toggleSelectAll: () => void;
  selected: string[];
  total: number;           // unread count
  markAllAsRead: () => void;
  markSelectedAsRead: () => void;
}

export default function NotificationHeader({
  toggleSelectAll,
  selected,
  total,
  markAllAsRead,
  markSelectedAsRead,
}: NotificationHeaderProps) {
  const { t } = useLanguage();

  const hasSelection = selected.length > 0;
  // allSelected = every unread notification is checked
  const allSelected = total > 0 && selected.length >= total;
  // partial = some (but not all) unread notifications are checked
  const partialSelection = hasSelection && !allSelected;

  return (
    <div className="w-full px-3 sm:px-6 py-3 border-b border-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">

        {/* SELECT ALL */}
        <Button
          onClick={toggleSelectAll}
          variant="ghost"
          disabled={total === 0}
          className={`
            inline-flex items-center gap-2
            w-full sm:w-auto justify-start
            text-sm font-semibold transition-colors
            p-0 h-auto
            ${total === 0
              ? "text-slate-300 cursor-not-allowed"
              : "text-slate-600 hover:text-blue-600"}
          `}
        >
          {allSelected
            ? <CheckSquare className="w-5 h-5 text-blue-600 shrink-0" />
            : <Square className="w-5 h-5 text-slate-300 shrink-0" />}

          <span className="sm:whitespace-nowrap">
            {allSelected
              ? t.notificationpage.unselect
              : t.notificationpage.selectAll}
          </span>

          {total > 0 && (
            <span className="min-w-[22px] h-[22px] px-1.5 rounded-full flex items-center justify-center bg-slate-100 text-slate-600 text-xs font-bold">
              {total}
            </span>
          )}
        </Button>

        {/* ACTION BUTTONS — mutually exclusive */}
        <div className="flex gap-2 w-full sm:w-auto sm:justify-end">

          {/* Mark ALL as read — only when every unread item is selected */}
          {allSelected && (
            <Button
              onClick={markAllAsRead}
              className="
                h-11 sm:h-10 min-w-[140px] px-4 rounded-xl
                bg-emerald-500 hover:bg-emerald-600
                text-white text-sm font-semibold shadow-sm
                inline-flex items-center justify-center gap-2 whitespace-nowrap
              "
            >
              <BellRing className="w-4 h-4 shrink-0" />
              <span>{t.notificationpage.markAllRead}</span>
            </Button>
          )}

          {/* Mark SELECTED as read — only when a partial selection exists */}
          {partialSelection && (
            <Button
              onClick={markSelectedAsRead}
              className="
                relative h-11 sm:h-10 min-w-[120px] px-4 rounded-xl
                bg-blue-600 hover:bg-blue-700
                text-white text-sm font-semibold shadow-sm
                inline-flex items-center justify-center gap-2
              "
            >
              <BellRing className="w-4 h-4 shrink-0" />
              <span>{t.notificationpage.read}</span>
              <span className="
                absolute -top-2 -right-2 w-5 h-5 rounded-full
                bg-white text-blue-600 text-[11px] font-bold
                flex items-center justify-center shadow
              ">
                {selected.length}
              </span>
            </Button>
          )}

        </div>
      </div>
    </div>
  );
}