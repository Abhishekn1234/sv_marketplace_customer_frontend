"use client";

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Button from "@/components/input/Button";

import { useBookingPayment } from "./hooks/useBookingPayment";
import { useGetProcessingPaymentSession } from "./hooks/useGetProcessingPaymentSession";
import { useGetPaymentGateway } from "./hooks/useGetPaymentGateway";
import { normalizeGateways } from "./utils/normalizedGateways";
import { useLanguage } from "@/features/context/LanguageContext";
import { getMethodMeta } from "./utils/getpaymentmethoddata";
import PaymentMethodsPanel from "./components/PaymentMethodsPanel";
import OrderSummaryPanel from "./components/OrderSummaryPanel";
import { styles } from "./components/styles/paymentcardstyle";
import type { ProcessingPaymentSession } from "../domain/entities/processingpaymentsession";
import type { PaymentInitial } from "../domain/entities/intiatepayment";

const getSessionRedirectUrl = (session: ProcessingPaymentSession | null) =>
  session?.paymentUrl ??
  session?.checkoutUrl ??
  session?.redirectUrl ??
  session?.url;

const getSessionId = (session: ProcessingPaymentSession | null) =>
  session?.sessionId ?? session?.session_id;

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
  const bookingCode=state?.bookingCode??"Booking Code"
  const  bookingId   = state?.bookingId   ?? "";
  const serviceName = state?.serviceName ?? "Service";
  const price       = Number(state?.price ?? 0);
  const currency    = state?.currency    ?? "SAR";
  const taxableAmount=state?.taxableAmount;
  const vatAmount=state?.vatAmount;

  const {
    data: processingSession,
    isFetching: isProcessingSessionLoading,
    refetch: refetchProcessingPaymentSession,
  } = useGetProcessingPaymentSession(bookingId);

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

  const resumeProcessingSession = (
    session: ProcessingPaymentSession | null
  ) => {
    const paymentUrl = getSessionRedirectUrl(session);

    if (paymentUrl) {
      window.location.replace(paymentUrl);
      return true;
    }

    if (session?.paymentId) {
      navigate("/payment/callback", {
        replace: true,
        state: {
          paymentId: session.paymentId,
          transactionId: session.transactionId ?? getSessionId(session),
          bookingId: session.bookingId ?? bookingId,
          status:
            session.status === "PAID" || session.status === "COMPLETED"
              ? "SUCCESS"
              : "PENDING",
        },
      });
      return true;
    }

    return false;
  };

  const handlePayment = async () => {
  if (!method) {
    toast.error(t.paymentpage.pleaseSelectMethod);
    return;
  }

  // ✅ Skip processing session for cash
  if (method !== "CASH") {
    const currentSession =
      processingSession ??
      (await refetchProcessingPaymentSession()).data ??
      null;

    if (resumeProcessingSession(currentSession)) {
      return;
    }
  }

  mutate(
    {
      bookingId,
      paymentMethod: method as PaymentInitial["paymentMethod"],
    },
    {
    onSuccess: (data) => {
  if (method === "CASH") {
    navigate("/payment/callback", {
      replace: true,
      state: {
        bookingId,
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
    bookingCode={bookingCode}
      t={t.paymentpage}
      taxableAmount={taxableAmount}
      vatAmount={vatAmount}
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
      isPending={isPending || isProcessingSessionLoading}
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
