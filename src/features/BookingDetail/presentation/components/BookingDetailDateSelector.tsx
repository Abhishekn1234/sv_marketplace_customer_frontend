import { useEffect, useMemo, useState } from "react";
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

  // Default to today (index 0) if nothing has been selected yet.
  useEffect(() => {
    if (selectedDate === null) {
      onSelectDate(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const dateCardClass = (globalIndex: number) =>
    `flex h-[72px] sm:h-[80px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 transition
    ${
      selectedDate === globalIndex
        ? "border-blue-600 bg-blue-600 text-white shadow-lg"
        : "border-gray-200 bg-white hover:border-blue-600"
    }`;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900">
          {t.bookingdetailpage.selectDate}
        </h2>

        <div className="hidden gap-2 sm:flex">
          <Button
            onClick={handlePrev}
            variant="none"
            disabled={pageStart === 0}
            className="h-9 w-9 rounded-lg border bg-white disabled:opacity-40"
          >
            <ArrowLeftIcon className="text-black" />
          </Button>
          <Button
            onClick={handleNext}
            variant="none"
            disabled={pageStart + datesPerPage >= allDates.length}
            className="h-9 w-9 rounded-lg border bg-white disabled:opacity-40"
          >
            <ArrowRight size={10} className="text-black" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:hidden">
        {allDates.map((item, globalIndex) => (
          <div
            key={globalIndex}
            onClick={() => onSelectDate(globalIndex)}
            className={dateCardClass(globalIndex)}
          >
            <span className="text-xs font-bold uppercase">{item.day}</span>
            <span className="text-2xl font-black">{item.date}</span>
          </div>
        ))}
      </div>

      <div className="hidden gap-3 overflow-x-auto sm:flex">
        {visibleDates.map((item, index) => {
          const globalIndex = pageStart + index;
          return (
            <div
              key={globalIndex}
              onClick={() => onSelectDate(globalIndex)}
              className={`min-w-[72px] ${dateCardClass(globalIndex)}`}
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