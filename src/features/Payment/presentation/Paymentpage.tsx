"use client";

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Button from "@/components/input/Button";
// import CommonSpinner from "@/components/common/CommonLoadingSpinner";

import { useBookingPayment } from "./hooks/useBookingPayment";
import { useGetPaymentGateway } from "./hooks/useGetPaymentGateway";
import { normalizeGateways } from "./utils/normalizedGateways";
import { useLanguage } from "@/features/context/LanguageContext";
// import { fmtCardNumber, fmtExpiry } from "./utils/cardinputformatters";
// import { CheckIcon, LockIcon, ShieldIcon, ShieldSmallIcon } from "@/components/icons";
// import { LineItem } from "./components/LineItem";
import { styles } from "./components/styles/paymentcardstyle";
// import { Input, Label } from "@/components/input";
import { getMethodMeta} from "./utils/getpaymentmethoddata";
import PaymentMethodsPanel from "./components/PaymentMethodsPanel";
import OrderSummaryPanel from "./components/OrderSummaryPanel";
// SHOWS_CARD_FIELDS
export default function PaymentPage() {
  const [method, setMethod] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const { t, isRTLOrder } = useLanguage();  // ← pull isRTL from your language context
  const navigate = useNavigate();
  const { state } = useLocation();
  const { t: translations } = useLanguage();

  const METHOD_META = getMethodMeta(translations.paymentpage.paymentMethods);

  const { mutate, isPending } = useBookingPayment();
  const { data: gateways, isLoading } = useGetPaymentGateway();

  const bookingId   = state?.bookingId   ?? "";
  const serviceName = state?.serviceName ?? "Service";
  const price       = Number(state?.price ?? 0);
  const currency    = state?.currency    ?? "SAR";

  const normalized = normalizeGateways(gateways ?? []);

  if (!bookingId) {
    return (
      <div style={styles.centeredPage}>
        <Button style={styles.ghostBtn} onClick={() => navigate("/bookings")}>
          {t.paymentpage.goToBookings}
        </Button>
      </div>
    );
  }

  const handlePayment = () => {
    if (!method) {
      toast.error(`${t.paymentpage.pleaseSelectMethod}`);
      return;
    }
    mutate(
      { bookingId, paymentMethod: method as any },
      {
        onSuccess: (data) => {
          if (method === "CASH") {
            navigate("/payment/callback", {
              state: {
                paymentId:     data.paymentId,
                transactionId: data.paymentId,
                bookingId,
                status:        "SUCCESS",
              },
            });
            return;
          }
          if (data.paymentUrl) {
            toast.success(`${t.paymentpage.redirecting}`);
            window.location.href = data.paymentUrl;
            return;
          }
          toast.error(`${t.paymentpage.paymentUrlNotFound}`);
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message ||
            error?.message ||
            `${t.paymentpage.paymentFailed}`
          );
        },
      }
    );
  };

  // const showCardFields = SHOWS_CARD_FIELDS.includes(method);





  return (
   <div style={{ ...styles.page}}>
  <div style={styles.shell}>
    {isRTLOrder ? (
      <>
        <PaymentMethodsPanel
          t={t.paymentpage}
          method={method}
          setMethod={setMethod}
          normalized={normalized}
          METHOD_META={METHOD_META}
          isLoading={isLoading}
          cardNumber={cardNumber}
          setCardNumber={setCardNumber}
          expiry={expiry}
          setExpiry={setExpiry}
          cvv={cvv}
          setCvv={setCvv}
          currency={currency}
          price={price}
          isPending={isPending}
          onPay={handlePayment}
        />

        <OrderSummaryPanel
          t={t.paymentpage}
          serviceName={serviceName}
          bookingId={bookingId}
          currency={currency}
          price={price}
        />
      </>
    ) : (
      <>
        <OrderSummaryPanel
          t={t.paymentpage}
          serviceName={serviceName}
          bookingId={bookingId}
          currency={currency}
          price={price}
        />

        <PaymentMethodsPanel
          t={t.paymentpage}
          method={method}
          setMethod={setMethod}
          normalized={normalized}
          METHOD_META={METHOD_META}
          isLoading={isLoading}
          cardNumber={cardNumber}
          setCardNumber={setCardNumber}
          expiry={expiry}
          setExpiry={setExpiry}
          cvv={cvv}
          setCvv={setCvv}
          currency={currency}
          price={price}
          isPending={isPending}
          onPay={handlePayment}
        />
      </>
    )}
  </div>
</div>
  );
}