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
 <div
  className="
    sticky
    top-0
    z-20
    bg-white/95
    backdrop-blur-md
    border-b
    border-slate-100
    px-4
    sm:px-6
    py-3
    sm:py-4
  "
>
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
    
    {/* SELECT ALL */}
   <Button
  onClick={toggleSelectAll}
  variant="ghost"
  disabled={total === 0}
  className={`
    inline-flex items-center gap-2
    whitespace-nowrap
    w-fit
    p-0
    h-auto
    text-sm font-semibold
    transition-colors

    ${
      total === 0
        ? "text-slate-300 cursor-not-allowed"
        : "text-slate-600 hover:text-blue-600"
    }
  `}
>
  {/* ICON + TEXT WRAPPER (keeps everything on one line) */}
  <span className="flex items-center gap-2 whitespace-nowrap">
    {allSelected ? (
      <CheckSquare className="w-5 h-5 text-blue-600 shrink-0" />
    ) : (
      <Square className="w-5 h-5 text-slate-300 shrink-0" />
    )}

    <span className="whitespace-nowrap">
      {allSelected
        ? t.notificationpage.unselect
        : t.notificationpage.selectAll}
    </span>

    {total > 0 && (
      <span
        className="
          min-w-[22px]
          h-[22px]
          px-1.5
          rounded-full
          flex items-center justify-center
          bg-slate-100
          text-slate-600
          text-xs
          font-bold
          whitespace-nowrap
        "
      >
        {total}
      </span>
    )}
  </span>
</Button>

    {/* ACTIONS */}
   <div className="flex gap-2 sm:justify-end items-center whitespace-nowrap flex-nowrap">
  {isSelectAllMode && (
    <Button
      onClick={markAllAsRead}
      className="
        h-10
        px-4
        rounded-xl
        bg-emerald-500
        hover:bg-emerald-600
        text-white
        text-sm
        font-semibold
        shadow-sm
        whitespace-nowrap
        flex items-center gap-2
        shrink-0
      "
    >
      <BellRing className="w-4 h-4 shrink-0" />
      <span>{t.notificationpage.markAllRead}</span>
    </Button>
  )}

  {hasSelection && !isSelectAllMode && (
    <Button
      onClick={markSelectedAsRead}
      className="
        h-10
        px-4
        rounded-xl
        bg-blue-600
        hover:bg-blue-700
        text-white
        text-sm
        font-semibold
        shadow-sm
        whitespace-nowrap
        flex items-center gap-2
        shrink-0
      "
    >
      <BellRing className="w-4 h-4 shrink-0" />

      <span className="whitespace-nowrap">
        {t.notificationpage.read}
      </span>

      <span
        className="
          min-w-[20px]
          h-[20px]
          rounded-full
          bg-white/20
          text-white
          text-[11px]
          font-bold
          flex items-center justify-center
          whitespace-nowrap
        "
      >
        {selected.length}
      </span>
    </Button>
  )}
</div>
  </div>
</div>
  );
}