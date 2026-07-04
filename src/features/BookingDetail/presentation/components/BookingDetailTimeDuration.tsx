import { useEffect, useMemo, useState } from "react";
import Button from "@/components/input/Button";
import { useLanguage } from "@/features/context/LanguageContext";
import { ArrowLeftIcon, ArrowRight, MinusIcon, PlusIcon } from "@/components/icons";
import { timeSlots } from "../utils/timeslots";
import { isDisabled } from "../utils/disabledtimefunction";
import { getAvailableTimeSlots } from "../utils/availabletimeslots";
import { formatDateTime } from "../utils/formatDateTime";

interface BookingTimeAndDurationProps {
  selectedDate: number | null;
  selectedTime: string;
  onSelectTime: (value: string) => void;
  duration: number;
  onIncreaseDuration: () => void;
  onDecreaseDuration: () => void;
}

const SLOTS_PER_PAGE = 8;

export default function BookingDetailTimeAndDuration({
  selectedTime,
  onSelectTime,
  duration,
  selectedDate,
  onIncreaseDuration,
  onDecreaseDuration,
}: BookingTimeAndDurationProps) {
  const { t } = useLanguage();

  const [page, setPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);


  const availableSlots = useMemo(
    () => getAvailableTimeSlots(timeSlots, selectedDate),
    [selectedDate]
  );

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

 
  useEffect(() => {
    setPage(0);
  }, [selectedDate]);

  useEffect(() => {
    if (!selectedTime && availableSlots.length) {
      onSelectTime(availableSlots[0]);
    } else if (selectedTime && !availableSlots.includes(selectedTime)) {
      onSelectTime(availableSlots.length ? availableSlots[0] : "");
    }
  }, [selectedDate, availableSlots]);

  const start = page * SLOTS_PER_PAGE;
  const end = start + SLOTS_PER_PAGE;

  const visibleSlots = isMobile ? availableSlots : availableSlots.slice(start, end);

  const hasPrev = page > 0;
  const hasNext = end < availableSlots.length;

  return (
    <>
      {/* HEADER */}
      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900">
          {t.bookingdetailpage.selectTime}
        </h2>

        {!isMobile && (
          <div className="flex gap-2">
            <Button
              type="button"
              variant="none"
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              disabled={!hasPrev}
              className="h-9 w-9 rounded-lg border bg-white disabled:opacity-40"
            >
              <ArrowLeftIcon />
            </Button>

            <Button
              type="button"
              variant="none"
              onClick={() => setPage((p) => (hasNext ? p + 1 : p))}
              disabled={!hasNext}
              className="h-9 w-9 rounded-lg border bg-white disabled:opacity-40"
            >
              <ArrowRight />
            </Button>
          </div>
        )}
      </div>

      {/* GRID */}
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {visibleSlots.length ? (
          visibleSlots.map((time) => {
            const isSelected = selectedTime === time;
            const disabled = !isSelected && isDisabled(time, selectedTime, duration);

            return (
              <Button
                key={time}
                type="button"
                variant="none"
                onClick={() => !disabled && onSelectTime(time)}
                disabled={disabled}
                className={`rounded-lg border px-3 py-2 text-sm font-semibold transition
                  ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-600"
                      : disabled
                      ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                      : "bg-white border-gray-200 hover:border-blue-500"
                  }`}
              >
                {time}
              </Button>
            );
          })
        ) : (
          <p className="col-span-full text-sm text-gray-400">
            {t.common["not selected"] ?? "No slots available for this date"}
          </p>
        )}
      </div>

      {/* SELECTED TIME */}
      <div className="mt-3 text-sm font-semibold text-gray-700">
        {t.common.selected}{" "}
        <span className="text-blue-600">
          {selectedDate !== null && selectedTime
            ? formatDateTime(selectedDate, selectedTime)
            : t.common["not selected"]}
        </span>
      </div>

      {/* DURATION */}
      <div className="mt-6">
        <h2 className="mb-4 text-sm font-bold text-gray-900">
          {t.bookingdetailpage.estimatedDuration}
        </h2>

        <div className="flex items-center gap-4 rounded-xl border-2 border-gray-200 bg-gray-50 p-4">
          <Button
            type="button"
            variant="none"
            onClick={onDecreaseDuration}
            className="h-10 w-10 rounded-lg bg-white"
          >
            <MinusIcon />
          </Button>

          <div className="flex-1 text-center">
            <span className="text-3xl font-black">{duration}</span>
            <span className="ml-2 text-sm font-semibold text-gray-500">
              {duration === 1 ? "Hour" : "Hours"}
            </span>
          </div>

          <Button
            type="button"
            variant="none"
            onClick={onIncreaseDuration}
            className="h-10 w-10 rounded-lg bg-white"
          >
            <PlusIcon />
          </Button>
        </div>
      </div>
    </>
  );
}