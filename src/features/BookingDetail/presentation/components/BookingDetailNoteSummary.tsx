import { useState } from "react";
import Button from "@/components/input/Button";
import { Input, Textarea } from "@/components/input";
import { ArrowRight } from "@/components/icons";
import CommonSpinner from "@/components/common/CommonLoadingSpinner";
import LoginRequired from "@/components/common/LoginRequired";
import { useLanguage } from "@/features/context/LanguageContext";

interface BookingNotesAndSummaryProps {
  notes: string;
  onNotesChange: (value: string) => void;
 appliedCouponCode: string;
  duration: number;
  basePrice: number;
  vatRate: number;
  totalCostToSend: number;

  loading: boolean;
  onConfirmBooking: () => void;
  showLoginModal: boolean;

  couponCode: string;
  onCouponCodeChange: (value: string) => void;
  onApplyCoupon: () => void;
  couponLoading: boolean;
  couponPricing: {
    amountBeforeDiscount: number;
    discountAmount: number;
    taxableAmount: number;
    taxAmount: number;
    totalCost: number;
  } | null;
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

  couponCode,
  onCouponCodeChange,
  onApplyCoupon,
  couponLoading,
  appliedCouponCode,
  couponPricing,
}: BookingNotesAndSummaryProps) {
  const { t } = useLanguage();
  const [showCouponInput, setShowCouponInput] = useState(false);

  // Check if coupon is already applied
  const hasAppliedCoupon = Boolean(couponPricing);

const isApplied =
  hasAppliedCoupon &&
  couponCode.trim().toLowerCase() ===
    appliedCouponCode.trim().toLowerCase();

  const handleCancelCoupon = () => {
    onCouponCodeChange("");
    setShowCouponInput(false);
  };

  return (
    <>
      {/* Special Requirements / Notes */}
      <div className="mt-6">
        <label className="mb-2 block text-sm font-bold text-gray-900">
          {t.bookingdetailpage.specialRequirement}
        </label>

        <Textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder={
            t.bookingdetailpage[
              "e.g. Focus on kitchen cabinets, be careful with the glass table..."
            ]
          }
          className="h-32 w-full resize-none rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Coupon Code Section */}
      <div className="mt-4">
        {!showCouponInput ? (
          <button
            type="button"
            onClick={() => setShowCouponInput(true)}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            {isApplied ? "Coupon applied" : "Apply coupon code?"}
          </button>
        ) : (
          <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-bold text-gray-900">
                Coupon Code
              </label>
              <button
                type="button"
                onClick={handleCancelCoupon}
                className="text-xs font-medium text-gray-500 hover:text-gray-700 hover:underline"
              >
                Cancel
              </button>
            </div>

            <div className="relative flex items-center">
              <Input
                    value={couponCode}
                    onChange={(value) => onCouponCodeChange(value)}
                    placeholder="Enter coupon code"
                    className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-4 pr-24 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />

              <Button
                type="button"
                onClick={onApplyCoupon}
                disabled={couponLoading || !couponCode.trim() || isApplied}
                className={`absolute right-1.5 h-9 rounded-lg px-4 text-xs font-semibold transition-all ${
                  isApplied
                    ? "bg-emerald-600 text-white disabled:opacity-100 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
                }`}
              >
                {couponLoading ? "Applying..." : isApplied ? "Applied ✓" : "Apply"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Pricing Breakdown */}
      <div className="mb-6 mt-6 border-t border-dashed border-gray-200 pt-6">
        <div className="mb-2.5 flex items-baseline justify-between gap-2 text-sm">
          <span className="text-gray-600">
            {t.bookingdetailpage.basePrice}{" "}
            <span className="whitespace-nowrap text-gray-400">
              ({duration} {duration === 1 ? "Hour" : "Hours"})
            </span>
          </span>

          <span className="whitespace-nowrap font-semibold text-gray-900">
            SAR {(couponPricing?.amountBeforeDiscount ?? basePrice).toFixed(2)}
          </span>
        </div>

        {/* Display Discount line if coupon is applied */}
        {couponPricing && couponPricing.discountAmount > 0 && (
          <div className="mb-2.5 flex items-baseline justify-between gap-2 text-sm text-emerald-600">
            <span>Discount Applied</span>
            <span className="whitespace-nowrap font-semibold">
              - SAR {couponPricing.discountAmount.toFixed(2)}
            </span>
          </div>
        )}

        <div className="mb-2.5 flex items-baseline justify-between gap-2 text-sm">
          <span className="text-gray-600">{t.bookingdetailpage.vatRate}</span>

          <span className="whitespace-nowrap font-semibold text-gray-900">
            SAR {(couponPricing?.taxAmount ?? vatRate).toFixed(2)}
          </span>
        </div>

        <div className="mt-4 flex items-baseline justify-between gap-2 border-t border-gray-200 pt-4">
          <span className="text-base font-bold text-gray-900 sm:text-lg">
            {t.bookingdetailpage.total}
          </span>

          <span className="whitespace-nowrap text-xl font-black text-gray-900 sm:text-2xl">
            SAR {(couponPricing?.totalCost ?? totalCostToSend).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Confirmation Button */}
      <Button
        onClick={onConfirmBooking}
        disabled={loading}
        rightIcon={<ArrowRight />}
        className="h-14 w-full rounded-full bg-blue-600 font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? (
          <CommonSpinner size={15} color="white" center />
        ) : (
          t.bookingdetailpage.confirmBooking
        )}
      </Button>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginRequired
          title={t.loginRequired.loginbookingservicetitle}
          description={t.loginRequired.loginbookingservicedescription}
        />
      )}
    </>
  );
}