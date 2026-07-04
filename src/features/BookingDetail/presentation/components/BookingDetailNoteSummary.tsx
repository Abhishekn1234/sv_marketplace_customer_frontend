import Button from "@/components/input/Button";
import { Textarea } from "@/components/input";
import { ArrowRight } from "@/components/icons";
import CommonSpinner from "@/components/common/CommonLoadingSpinner";
import LoginRequired from "@/components/common/LoginRequired";
import { useLanguage } from "@/features/context/LanguageContext";

interface BookingNotesAndSummaryProps {
  notes: string;
  onNotesChange: (value: string) => void;
  duration: number;
  basePrice: number;
  vatRate: number;
  totalCostToSend: number;
  loading: boolean;
  onConfirmBooking: () => void;
  showLoginModal: boolean;
}

export default function BookingDetailNotesAndSummary({
  notes,
  onNotesChange,
  duration,
  basePrice,
  vatRate,
  totalCostToSend,
  loading,
  onConfirmBooking,
  showLoginModal,
}: BookingNotesAndSummaryProps) {
  const { t } = useLanguage();

  return (
    <>
      {/* Notes */}
      <div className="mt-6">
        <h2 className="mb-2 text-sm font-bold text-gray-900">
          {t.bookingdetailpage.specialRequirement}
        </h2>

        <Textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder={
            t.bookingdetailpage[
              "e.g. Focus on kitchen cabinets, be careful with the glass table..."
            ]
          }
          className="
            h-32
            w-full
            resize-none
            rounded-lg
            border-2
            border-gray-200
            bg-white
            p-4
            text-sm
            text-gray-900
            outline-none
            transition-all
            focus:border-blue-600
            focus:ring-4
            focus:ring-blue-100
          "
        />
      </div>

      {/* Pricing */}
      <div className="mb-6 mt-6 border-t-2 border-dashed border-gray-200 pt-6">
        <div className="mb-2 flex justify-between text-sm">
          <span>
            {t.bookingdetailpage.basePrice}
            ({duration} {duration === 1 ? "Hour" : "Hours"})
          </span>

          <span>SAR {basePrice.toFixed(2)}</span>
        </div>

        <div className="mb-2 flex justify-between text-sm">
          <span>{t.bookingdetailpage.vatRate}</span>

          <span>SAR {vatRate.toFixed(2)}</span>
        </div>

        <div className="mt-3 flex justify-between border-t-2 border-gray-200 pt-3">
          <span className="text-lg font-bold">
            {t.bookingdetailpage.total}
          </span>

          <span className="text-2xl font-black">
            SAR {totalCostToSend.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Booking Button */}
      <Button
        onClick={onConfirmBooking}
        disabled={loading}
        rightIcon={<ArrowRight />}
        className="
          h-14
          w-full
          rounded-full
          bg-blue-600
          font-bold
          text-white
          hover:bg-blue-700
          disabled:opacity-60
        "
      >
        {loading ? (
          <CommonSpinner size={15} color="white" />
        ) : (
          t.bookingdetailpage.confirmBooking
        )}
      </Button>

      {showLoginModal && (
        <LoginRequired
          title={t.loginRequired.loginbookingservicetitle}
          description={t.loginRequired.loginbookingservicedescription}
        />
      )}
    </>
  );
}