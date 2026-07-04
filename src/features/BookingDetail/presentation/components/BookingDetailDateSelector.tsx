import { useMemo, useState } from "react";
import Button from "@/components/input/Button";
import { useLanguage } from "@/features/context/LanguageContext";
import { ArrowLeftIcon, ArrowRight } from "@/components/icons";

interface BookingDateSelectorProps {
  selectedDate: number | null;
  onSelectDate: (index: number) => void;
}

export default function BookingDetailDateSelector({
  selectedDate,
  onSelectDate,
}: BookingDateSelectorProps) {
  const { t } = useLanguage();

  const allDates = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 15 }).map((_, i) => {
      const current = new Date(today);
      current.setDate(today.getDate() + i);
      return {
        day: current.toLocaleDateString("en-US", { weekday: "short" }),
        date: current.getDate(),
        fullDate: new Date(current),
      };
    });
  }, []);

  const datesPerPage = 7;
  const [pageStart, setPageStart] = useState(0);
  const visibleDates = allDates.slice(pageStart, pageStart + datesPerPage);

  const handlePrev = () =>
    setPageStart((prev) => Math.max(prev - datesPerPage, 0));
  const handleNext = () =>
    setPageStart((prev) =>
      Math.min(prev + datesPerPage, allDates.length - datesPerPage)
    );

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900">
          {t.bookingdetailpage.selectDate}
        </h2>

        <div className="flex gap-2">
          <Button
            onClick={handlePrev}
            variant="ghost"
            disabled={pageStart === 0}
            className="rounded-lg bg-amber-50 p-2 hover:bg-gray-100 disabled:opacity-50"
          >
            <ArrowLeftIcon className="text-black"/>
          </Button>

          <Button
            onClick={handleNext}
            disabled={pageStart + datesPerPage >= allDates.length}
            className="rounded-lg bg-amber-50 p-2 hover:bg-gray-100 disabled:opacity-50"
          >
            <ArrowRight size={10} className="text-black"/>
          </Button>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto">
        {visibleDates.map((item, index) => {
          const globalIndex = pageStart + index;

          return (
            <div
              key={globalIndex}
              onClick={() => onSelectDate(globalIndex)}
              className={`flex h-[80px] min-w-[72px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 transition

              ${
                selectedDate === globalIndex
                  ? "border-blue-600 bg-blue-600 text-white shadow-lg"
                  : "border-gray-200 bg-white hover:border-blue-600"
              }
            `}
            >
              <span className="text-xs font-bold uppercase">{item.day}</span>
              <span className="text-2xl font-black">{item.date}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}