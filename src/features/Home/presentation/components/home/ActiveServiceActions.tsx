"use client";

import { useNavigate } from "react-router-dom";
import Button from "@/components/input/Button";
import CommonProgress from "@/components/common/CommonProgress";
import { useLanguage } from "@/features/context/LanguageContext";
import { useMediaQuery } from "react-responsive";
interface ActiveServiceActionsProps {
  bookingId: string;
  showTracking: boolean;
  isPaid: boolean;
  isStarted: boolean;
  progress: number;
}

export default function ActiveServiceActions({
  bookingId,
  showTracking,
  isPaid,
  isStarted,
  progress,
}: ActiveServiceActionsProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();
const isMobile = useMediaQuery({ maxWidth: 767 });
  const primaryButtonClass =
    "w-full sm:flex-1 h-11 sm:h-12 rounded-xl bg-blue-600 text-white hover:text-white";

  const secondaryButtonClass =
    "w-full sm:flex-1 h-11 sm:h-12 rounded-xl border-accent-foreground text-blue-600";

  if (showTracking) {
    return (
      <>
       {isStarted && !isMobile && (
          <CommonProgress
            value={progress}
            showValue={false}
            className="mb-5"
            trackClassName="h-2 rounded-full bg-gray-200"
            indicatorClassName="bg-blue-600 rounded-full"
          />
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            variant="none"
            className={primaryButtonClass}
            onClick={() => navigate(`/jobtracking/${bookingId}`)}
          >
            {t.home.Track}
          </Button>

          <Button
            variant="ghost"
            className={secondaryButtonClass}
            onClick={() => navigate(`/message/${bookingId}`)}
          >
            {t.home.Chat}
          </Button>
        </div>
      </>
    );
  }

  if (isPaid) {
    return (
      <Button
        className="w-full h-11 sm:h-12 rounded-xl bg-blue-600 text-white"
        onClick={() => navigate(`/servicerating/${bookingId}`)}
      >
        {t.home["Rate Service"]}
      </Button>
    );
  }

  return (
    <Button
      className="w-full h-11 sm:h-12 rounded-xl bg-blue-600 text-white"
      onClick={() => navigate("/bookings")}
    >
      {t.home["View Booking"] ?? "View Booking"}
    </Button>
  );
}