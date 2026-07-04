import Button from "@/components/input/Button";
import { Input } from "@/components/input";
import { useLanguage } from "@/features/context/LanguageContext";
import { MinusIcon, PlusIcon } from "@/components/icons";

interface BookingTimeAndDurationProps {
  selectedTime: string;
  onSelectTime: (value: string) => void;
  duration: number;
  onIncreaseDuration: () => void;
  onDecreaseDuration: () => void;
}

export default function BookingDetailTimeAndDuration({
  selectedTime,
  onSelectTime,
  duration,
  onIncreaseDuration,
  onDecreaseDuration,
}: BookingTimeAndDurationProps) {
  const { t } = useLanguage();

  return (
    <>
      {/* Select Time */}
      <div className="mt-6">
        <h2 className="mb-4 text-sm font-bold text-gray-900">
          {t.bookingdetailpage.selectTime}
        </h2>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Input
            type="time"
            value={selectedTime}
            onChange={(value) => onSelectTime(value)}
            className="border rounded-lg p-3 w-full"
          />
        </div>
      </div>

      {/* Duration */}
      <div className="mt-6">
        <h2 className="mb-4 text-sm font-bold text-gray-900">
          {t.bookingdetailpage.estimatedDuration}
        </h2>

        <div className="flex items-center gap-4 rounded-xl border-2 border-gray-200 bg-gray-50 p-4">
          <Button
            onClick={onDecreaseDuration}
            className="h-10 w-10 rounded-lg bg-white"
          >
            <MinusIcon/>
          </Button>

          <div className="flex-1 text-center">
            <span className="text-3xl font-black">{duration}</span>
            <span className="ml-2 text-sm font-semibold text-gray-500">
              {duration === 1 ? "Hour" : "Hours"}
            </span>
          </div>

          <Button
            onClick={onIncreaseDuration}
            className="h-10 w-10 rounded-lg bg-white"
          >
            <PlusIcon/>
          </Button>
        </div>
      </div>
    </>
  );
}