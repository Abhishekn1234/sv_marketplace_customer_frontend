"use client";

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Button from "@/components/input/Button";

import { useBookingPayment } from "./hooks/useBookingPayment";
import { useGetPaymentGateway } from "./hooks/useGetPaymentGateway";
import { normalizeGateways } from "./utils/normalizedGateways";
import { useLanguage } from "@/features/context/LanguageContext";
import { getMethodMeta } from "./utils/getpaymentmethoddata";
import PaymentMethodsPanel from "./components/PaymentMethodsPanel";
import OrderSummaryPanel from "./components/OrderSummaryPanel";
import { styles } from "./components/styles/paymentcardstyle";

export default function PaymentPage() {
  const [method, setMethod] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const { t, isRTLOrder } = useLanguage();
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
      toast.error(t.paymentpage.pleaseSelectMethod);
      return;
    }

    mutate(
      { bookingId, paymentMethod: method as any },
      {
        onSuccess: (data) => {
          if (method === "CASH") {
            navigate("/payment/callback", {
              replace:true,
              state: {
                paymentId: data.paymentId,
                transactionId: data.paymentId,
                bookingId,
                status: "SUCCESS",
              },
            });
            return;
          }
          if (data.paymentUrl) {
            window.location.replace(data.paymentUrl);
          }
        },
      }
    );
  };

  const summaryPanel = (
    <OrderSummaryPanel
      t={t.paymentpage}
      serviceName={serviceName}
      bookingId={bookingId}
      currency={currency}
      price={price}
    />
  );

  const methodsPanel = (
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
  );

  return (
  <>
    <style>{`
      .payment-shell {
        display: flex;
        gap: 24px;
        width: 100%;
        max-width: 960px;
        margin: 0 auto;
        padding: 24px 16px;
        box-sizing: border-box;
        align-items: flex-start;
      }

      .payment-shell.ltr {
        flex-direction: row;
      }

      .payment-shell.rtl {
        flex-direction: row-reverse;
      }

      @media (max-width: 767px) {
        .payment-shell,
        .payment-shell.ltr,
        .payment-shell.rtl {
          flex-direction: column !important;
          gap: 16px;
          padding: 16px 12px;
        }
      }
    `}</style>

    <div style={styles.page}>
      <div
        className={`payment-shell ${isRTLOrder ? "rtl" : "ltr"}`}
      >
        {summaryPanel}
        {methodsPanel}
      </div>
    </div>
  </>
);
}