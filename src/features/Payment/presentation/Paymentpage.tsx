"use client";

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Button from "@/components/input/Button";
import CommonSpinner from "@/components/common/CommonLoadingSpinner";

import { useBookingPayment } from "./hooks/useBookingPayment";
import { useGetPaymentGateway } from "./hooks/useGetPaymentGateway";

import { normalizeGateways } from "./utils/normalizedGateways";
import { getDisplayName } from "./utils/getDisplayNamepaymentgateways";

import { useLanguage } from "@/features/context/LanguageContext";

/* ── icon map ────────────────────────────────────────────────── */
const METHOD_META: Record<
  string,
  { label: string; icon: string; bg: string; color: string }
> = {
  CARD:        { label: "Credit card",    icon: "💳", bg: "#EFF6FF", color: "#1D4ED8" },
  APPLE_PAY:   { label: "Apple Pay",      icon: "🍎", bg: "#F3F4F6", color: "#111827" },
  CASH:        { label: "Cash",           icon: "💵", bg: "#ECFDF5", color: "#059669" },
  STC:         { label: "STC Pay",        icon: "📱", bg: "#FEF3C7", color: "#92400E" },
  MADA:        { label: "Mada",           icon: "🏧", bg: "#FDF2F8", color: "#9D174D" },
  BANK:        { label: "Bank transfer",  icon: "🏦", bg: "#F5F3FF", color: "#6D28D9" },
};

const SHOWS_CARD_FIELDS = ["CARD", "MADA"];

/* ── card-input formatters ───────────────────────────────────── */
function fmtCardNumber(v: string) {
  return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function fmtExpiry(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length >= 2 ? d.slice(0, 2) + " / " + d.slice(2) : d;
}

/* ════════════════════════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════════════════════════ */
export default function PaymentPage() {
  const [method, setMethod] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const { t } = useLanguage();
  const navigate = useNavigate();
  const { state } = useLocation();

  const { mutate, isPending } = useBookingPayment();
  const { data: gateways, isLoading } = useGetPaymentGateway();

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
      toast.error("Please select a payment method");
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
            toast.success("Redirecting to secure payment…");
            window.location.href = data.paymentUrl;
            return;
          }

          toast.error("Payment URL not found");
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message || error?.message || "Payment failed"
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
            <LockIcon size={13} color="#6366F1" />
            Secure checkout
          </div>

          <div>
            <p style={styles.leftLabel}>Booking summary</p>
            <p style={styles.serviceName}>{serviceName}</p>
            <p style={styles.bookingId}>ID: {bookingId}</p>
          </div>

          <div style={styles.divider} />

          <div>
            <p style={styles.leftLabel}>Total due</p>
            <p style={styles.priceAmount}>
              <span style={styles.priceCurrency}>{currency}</span>
              {price.toFixed(2)}
            </p>
          </div>

          <div style={styles.divider} />

          <div style={styles.lineItems}>
            <LineItem label="Service fee"  value={`${currency} ${(price / 1.15 / 1).toFixed(2)}`} />
            <LineItem label="VAT (15%)"    value={`${currency} ${(price - price / 1.15).toFixed(2)}`} />
            <LineItem label="Total" value={`${currency} ${price.toFixed(2)}`} isTotal />
          </div>

          <div style={styles.securityNote}>
            <ShieldIcon />
            <p style={styles.securityText}>
              Your payment is encrypted and processed securely. We never store card details.
            </p>
          </div>
        </div>

        {/* ── RIGHT — payment methods ── */}
        <div style={styles.panelRight}>
          <p style={styles.sectionTitle}>Choose payment method</p>

          {isLoading ? (
            <div style={styles.spinnerWrap}>
              <CommonSpinner size={36} />
            </div>
          ) : (
            <div style={styles.methodsGrid}>
              {normalized.map((gateway) => {
                const meta = METHOD_META[gateway.type] ?? {
                  label: getDisplayName(gateway.type),
                  icon:  "💰",
                  bg:    "#F3F4F6",
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
                      <span style={{ fontSize: 20 }}>{meta.icon}</span>
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
                <label style={styles.fieldLabel}>Card number</label>
                <div style={styles.cardInputWrap}>
                  <span style={{ fontSize: 16 }}>💳</span>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(fmtCardNumber(e.target.value))}
                    maxLength={19}
                    style={styles.cardInput}
                  />
                </div>
              </div>

              <div style={styles.twoCol}>
                <div style={styles.fieldGroup}>
                  <label style={styles.fieldLabel}>Expiry</label>
                  <input
                    type="text"
                    placeholder="MM / YY"
                    value={expiry}
                    onChange={(e) => setExpiry(fmtExpiry(e.target.value))}
                    maxLength={7}
                    style={styles.plainInput}
                  />
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.fieldLabel}>CVV</label>
                  <input
                    type="password"
                    placeholder="•••"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.slice(0, 4))}
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
              "Processing…"
            ) : (
              <>
                <LockIcon size={16} color="#fff" />
                {`Pay ${currency} ${price.toFixed(2)}`}
              </>
            )}
          </Button>

          <p style={styles.footerNote}>
            <ShieldSmallIcon />
            256-bit SSL encrypted · PCI DSS compliant
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── sub-components ──────────────────────────────────────────── */
function LineItem({
  label,
  value,
  isTotal = false,
}: {
  label: string;
  value: string;
  isTotal?: boolean;
}) {
  return (
    <div
      style={{
        display:        "flex",
        justifyContent: "space-between",
        fontSize:       13,
        color:          isTotal ? "#312E81" : "#6366F1",
        fontWeight:     isTotal ? 600 : 400,
        paddingTop:     isTotal ? 10 : 0,
        borderTop:      isTotal ? "0.5px solid rgba(99,102,241,0.15)" : "none",
      }}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function LockIcon({ size = 14, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

function ShieldSmallIcon() {
  return (
    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

/* ── styles ──────────────────────────────────────────────────── */
const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight:      "100vh",
    background:     "#F8FAFF",
    display:        "flex",
    alignItems:     "flex-start",
    justifyContent: "center",
    padding:        "2rem 1rem",
    fontFamily:     "Inter, system-ui, sans-serif",
  },
  centeredPage: {
    minHeight:      "100vh",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
  },
  ghostBtn: {
    padding:      "12px 24px",
    border:       "1px solid #E2E8F0",
    borderRadius: 12,
    background:   "#fff",
    cursor:       "pointer",
    fontSize:     14,
    color:        "#374151",
  },
  shell: {
    width:         "100%",
    maxWidth:      860,
    background:    "#fff",
    borderRadius:  20,
    border:        "0.5px solid #E2E8F0",
    overflow:      "hidden",
    display:       "grid",
    gridTemplateColumns: "clamp(260px, 38%, 340px) 1fr",
  },
  /* left panel */
  panelLeft: {
    background:    "linear-gradient(160deg, #EEF2FF 0%, #E0E7FF 50%, #EDE9FE 100%)",
    color:         "#1E1B4B",
    padding:       "2rem",
    display:       "flex",
    flexDirection: "column",
    gap:           "1.5rem",
    borderRight:   "0.5px solid #C7D2FE",
  },
  secureBadge: {
    display:       "inline-flex",
    alignItems:    "center",
    gap:           6,
    fontSize:      11,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color:         "#6366F1",
    background:    "rgba(99,102,241,0.08)",
    padding:       "5px 10px",
    borderRadius:  20,
    width:         "fit-content",
  },
  leftLabel: {
    fontSize:      11,
    letterSpacing: "0.07em",
    textTransform: "uppercase" as const,
    color:         "#6366F1",
    marginBottom:  6,
    fontWeight:    600,
  },
  serviceName: {
    fontSize:   17,
    fontWeight: 600,
    color:      "#1E1B4B",
    lineHeight: 1.4,
  },
  bookingId: {
    fontSize:   12,
    color:      "#818CF8",
    marginTop:  4,
    fontFamily: "monospace",
  },
  divider: {
    height:     "0.5px",
    background: "rgba(99,102,241,0.15)",
  },
  priceAmount: {
    fontSize:      42,
    fontWeight:    600,
    color:         "#312E81",
    letterSpacing: "-0.02em",
    lineHeight:    1,
    marginTop:     8,
  },
  priceCurrency: {
    fontSize:      18,
    fontWeight:    400,
    color:         "#6366F1",
    marginRight:   4,
    verticalAlign: "super",
  },
  lineItems: {
    display:       "flex",
    flexDirection: "column",
    gap:           10,
  },
  securityNote: {
    marginTop:    "auto",
    display:      "flex",
    alignItems:   "flex-start",
    gap:          10,
    padding:      12,
    background:   "rgba(255,255,255,0.5)",
    borderRadius: 10,
    border:       "0.5px solid rgba(99,102,241,0.2)",
  },
  securityText: {
    fontSize:   12,
    color:      "#4338CA",
    lineHeight: 1.5,
  },
  /* right panel */
  panelRight: {
    padding:       "2rem",
    display:       "flex",
    flexDirection: "column",
    gap:           "1.25rem",
  },
  sectionTitle: {
    fontSize:      12,
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    color:         "#6B7280",
    fontWeight:    500,
  },
  spinnerWrap: {
    display:        "flex",
    justifyContent: "center",
    padding:        "2rem 0",
  },
  methodsGrid: {
    display:             "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap:                 10,
  },
  methodBtn: {
    border:        "0.5px solid #E2E8F0",
    borderRadius:  14,
    padding:       "16px 10px",
    background:    "#fff",
    cursor:        "pointer",
    display:       "flex",
    flexDirection: "column",
    alignItems:    "center",
    gap:           8,
    position:      "relative",
    transition:    "border-color 0.15s, background 0.15s",
  },
  methodBtnSelected: {
    border:     "1.5px solid #3B82F6",
    background: "#EFF6FF",
  },
  selectedCheck: {
    position:       "absolute",
    top:            8,
    right:          8,
    width:          18,
    height:         18,
    background:     "#3B82F6",
    borderRadius:   "50%",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
  },
  methodIcon: {
    width:          40,
    height:         40,
    borderRadius:   10,
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
  },
  methodLabel: {
    fontSize:   12,
    fontWeight: 500,
    color:      "#374151",
    textAlign:  "center",
  },
  /* card fields */
  cardFields: {
    display:       "flex",
    flexDirection: "column",
    gap:           10,
  },
  fieldGroup: {
    display:       "flex",
    flexDirection: "column",
    gap:           4,
  },
  fieldLabel: {
    fontSize: 12,
    color:    "#6B7280",
  },
  cardInputWrap: {
    display:     "flex",
    alignItems:  "center",
    border:      "0.5px solid #D1D5DB",
    borderRadius: 10,
    padding:     "0 12px",
    height:      44,
    gap:         8,
    background:  "#fff",
  },
  cardInput: {
    border:      "none",
    outline:     "none",
    background:  "transparent",
    fontSize:    14,
    color:       "#111827",
    flex:        1,
    fontFamily:  "monospace",
  },
  twoCol: {
    display:             "grid",
    gridTemplateColumns: "1fr 1fr",
    gap:                 10,
  },
  plainInput: {
    height:       44,
    border:       "0.5px solid #D1D5DB",
    borderRadius: 10,
    padding:      "0 12px",
    fontSize:     14,
    color:        "#111827",
    background:   "#fff",
    outline:      "none",
    fontFamily:   "monospace",
    width:        "100%",
  },
  /* pay button */
  payBtn: {
    width:          "100%",
    padding:        "14px",
    background:     "#10B981",
    color:          "#fff",
    border:         "none",
    borderRadius:   14,
    fontSize:       15,
    fontWeight:     500,
    cursor:         "pointer",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    gap:            8,
    letterSpacing:  "0.01em",
  },
  payBtnDisabled: {
    background: "#E5E7EB",
    color:      "#9CA3AF",
    cursor:     "not-allowed",
  },
  footerNote: {
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    gap:            6,
    fontSize:       12,
    color:          "#9CA3AF",
  },
};