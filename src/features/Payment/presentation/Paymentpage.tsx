"use client";

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Button from "@/components/input/Button";
import CommonSpinner from "@/components/common/CommonLoadingSpinner";

import { useBookingPayment } from "./hooks/useBookingPayment";
import { useGetPaymentGateway } from "./hooks/useGetPaymentGateway";

import { normalizeGateways } from "./utils/normalizedGateways";


import { useLanguage } from "@/features/context/LanguageContext";
import { fmtCardNumber, fmtExpiry } from "./utils/cardinputformatters";

import { CheckIcon, LockIcon, ShieldIcon, ShieldSmallIcon } from "@/components/icons";
import { LineItem } from "./components/LineItem";
import { styles } from "./components/styles/paymentcardstyle";
import { Input, Label } from "@/components/input";
import { getMethodMeta, SHOWS_CARD_FIELDS } from "./utils/getpaymentmethoddata";
// import { usePreventBackNavigation } from "@/components/common/usePreventBackNavigation";

export default function PaymentPage() {
  // usePreventBackNavigation();
  const [method, setMethod] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const { t } = useLanguage();
  const navigate = useNavigate();
  const { state } = useLocation();
    const { t: translations } = useLanguage();

  const METHOD_META = getMethodMeta(
    translations.paymentpage.paymentMethods
  );

  const { mutate, isPending } = useBookingPayment();
  const { data: gateways, isLoading } = useGetPaymentGateway();
  // console.log(gateways);

  const bookingId    = state?.bookingId   ?? "";
  const serviceName  = state?.serviceName ?? "Service";
  const price        = Number(state?.price ?? 0);
  const currency     = state?.currency    ?? "SAR";

  const normalized = normalizeGateways(gateways ?? []);

  /* ── no booking id guard ─────────────────────────────────── */
  if (!bookingId) {
    return (
      <div style={styles.centeredPage}>
        <Button style={styles.ghostBtn} onClick={() => navigate("/bookings")}>
          {t.paymentpage.goToBookings}
        </Button>
      </div>
    );
  }

  /* ── payment handler ─────────────────────────────────────── */
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
            error?.response?.data?.message || error?.message || `${t.paymentpage.paymentFailed}`
          );
        },
      }
    );
  };

 const showCardFields = SHOWS_CARD_FIELDS.includes(method);

  /* ── render ──────────────────────────────────────────────── */
  return (
    <div style={styles.page}>
      <div style={styles.shell}>

        {/* ── LEFT — order summary ── */}
        <div style={styles.panelLeft}>
          <div style={styles.secureBadge}>
            <LockIcon  />
           {t.paymentpage.secureCheckout}
          </div>

          <div>
            <p style={styles.leftLabel}>{t.paymentpage.bookingSummary}</p>
            <p style={styles.serviceName}>{serviceName}</p>
            <p style={styles.bookingId}>{t.paymentpage.bookingId}: {bookingId}</p>
          </div>

          <div style={styles.divider} />

          <div>
            <p style={styles.leftLabel}>{t.paymentpage.totalDue}</p>
            <p style={styles.priceAmount}>
              <span style={styles.priceCurrency}>{currency}</span>
              {price.toFixed(2)}
            </p>
          </div>

          <div style={styles.divider} />

          <div style={styles.lineItems}>
            <LineItem label={t.paymentpage.serviceFee} value={`${currency} ${(price / 1.15 / 1).toFixed(2)}`} />
            <LineItem label={t.paymentpage.vat}    value={`${currency} ${(price - price / 1.15).toFixed(2)}`} />
            <LineItem label={t.paymentpage.total} value={`${currency} ${price.toFixed(2)}`} isTotal />
          </div>

          <div style={styles.securityNote}>
            <ShieldIcon />
            <p style={styles.securityText}>
              {t.paymentpage.secureNote}
            </p>
          </div>
        </div>

        {/* ── RIGHT — payment methods ── */}
        <div style={styles.panelRight}>
          <p style={styles.sectionTitle}>{t.paymentpage.choosePaymentMethod}</p>

          {isLoading ? (
            <div style={styles.spinnerWrap}>
              <CommonSpinner size={36} />
            </div>
          ) : (
            <div style={styles.methodsGrid}>
              {normalized.map((gateway) => {
              const meta =
                METHOD_META[
                  gateway.type as keyof typeof METHOD_META
                ] ?? {
                  label: gateway.title,
                  icon: "💳",
                  bg: "#F3F4F6",
                  color: "#374151",
                };

              const selected = method === gateway.type;

              return (
                <Button
                  key={gateway.id}
                  onClick={() => setMethod(gateway.type)}
                  style={{
                    ...styles.methodBtn,
                    ...(selected ? styles.methodBtnSelected : {}),
                  }}
                >
                  {selected && (
                    <div style={styles.selectedCheck}>
                      <CheckIcon />
                    </div>
                  )}

                  <div
                    style={{
                      ...styles.methodIcon,
                      background: meta.bg,
                    }}
                  >
                    <span style={{ fontSize: 20 }}>
                      {meta.icon}
                    </span>
                  </div>

                  <span
                    style={{
                      ...styles.methodLabel,
                      color: selected ? "#1D4ED8" : undefined,
                    }}
                  >
                    {meta.label}
                  </span>
                </Button>
              );
            })}
            </div>
          )}

          {/* Card fields */}
          {showCardFields && (
            <div style={styles.cardFields}>
              <div style={styles.fieldGroup}>
                <Label style={styles.fieldLabel}>{t.paymentpage.cardNumber}</Label>
                <div style={styles.cardInputWrap}>
                  <span style={{ fontSize: 16 }}>💳</span>
                  <Input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(value) => setCardNumber(fmtCardNumber(value))}
                    maxLength={19}
                    style={styles.cardInput}
                  />
                </div>
              </div>

              <div style={styles.twoCol}>
                <div style={styles.fieldGroup}>
                  <Label style={styles.fieldLabel}>{t.paymentpage.expiry}</Label>
                  <Input
                    type="text"
                    placeholder="MM / YY"
                    value={expiry}
                    onChange={(value) => setExpiry(fmtExpiry(value))}
                    maxLength={7}
                    style={styles.plainInput}
                  />
                </div>
                <div style={styles.fieldGroup}>
                  <Label style={styles.fieldLabel}>{t.paymentpage.cvv}</Label>
                  <Input
                    type="password"
                    placeholder="•••"
                    value={cvv}
                    onChange={(value) => setCvv(value.slice(0, 4))}
                    maxLength={4}
                    style={styles.plainInput}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Pay button */}
                  <Button
            disabled={!method || isPending}
            onClick={handlePayment}
            style={{
              ...styles.payBtn,
              ...(!method || isPending ? styles.payBtnDisabled : {}),
            }}
          >
            {isPending ? (
              t.paymentpage.processing
            ) : (
              <>
                          <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <LockIcon size={28} color="#FFFFFF" />
              <span>
                {t.paymentpage.pay} {currency} {price.toFixed(2)}
              </span>
            </div>
              </>
            )}
          </Button>

          <p style={styles.footerNote}>
            <ShieldSmallIcon />
           {t.paymentpage.footerNote}
          </p>
        </div>
      </div>
    </div>
  );
}
