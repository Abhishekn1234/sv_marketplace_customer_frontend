import Button from "@/components/input/Button";
import CommonSpinner from "@/components/common/CommonLoadingSpinner";
import { Input, Label } from "@/components/input";
import {
  CheckIcon,
  LockIcon,
  ShieldSmallIcon,
} from "@/components/icons";

import { styles } from "./styles/paymentcardstyle";
import { SHOWS_CARD_FIELDS } from "../utils/getpaymentmethoddata";
import { fmtCardNumber, fmtExpiry } from "../utils/cardinputformatters";

interface Props {
  t: any;
  method: string;
  setMethod: (value: string) => void;
  normalized: any[];
  METHOD_META: any;
  isLoading: boolean;

  cardNumber: string;
  setCardNumber: (value: string) => void;

  expiry: string;
  setExpiry: (value: string) => void;

  cvv: string;
  setCvv: (value: string) => void;

  currency: string;
  price: number;

  isPending: boolean;
  onPay: () => void;
}

export default function PaymentMethodsPanel({
  t,
  method,
  setMethod,
  normalized,
  METHOD_META,
  isLoading,

  cardNumber,
  setCardNumber,

  expiry,
  setExpiry,

  cvv,
  setCvv,

  currency,
  price,

  isPending,
  onPay,
}: Props) {
  const showCardFields = SHOWS_CARD_FIELDS.includes(method);

  return (
    <div style={styles.panelRight}>
      <p style={styles.sectionTitle}>
        {t.choosePaymentMethod}
      </p>

      {isLoading ? (
        <div style={styles.spinnerWrap}>
          <CommonSpinner size={36}  center/>
        </div>
      ) : (
        <div style={styles.methodsGrid}>
          {normalized.map((gateway) => {
            const meta =
              METHOD_META[gateway.type] ?? {
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
                  ...(selected
                    ? styles.methodBtnSelected
                    : {}),
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
                    color: selected
                      ? "#1D4ED8"
                      : undefined,
                  }}
                >
                  {meta.label}
                </span>
              </Button>
            );
          })}
        </div>
      )}

      {/* {showCardFields && (
        <div style={styles.cardFields}>
          <div style={styles.fieldGroup}>
            <Label style={styles.fieldLabel}>
              {t.cardNumber}
            </Label>

            <div style={styles.cardInputWrap}>
              <span style={{ fontSize: 16 }}>💳</span>

              <Input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(value) =>
                  setCardNumber(fmtCardNumber(value))
                }
                maxLength={19}
                style={styles.cardInput}
              />
            </div>
          </div>

          <div style={styles.twoCol}>
            <div style={styles.fieldGroup}>
              <Label style={styles.fieldLabel}>
                {t.expiry}
              </Label>

              <Input
                type="text"
                placeholder="MM / YY"
                value={expiry}
                onChange={(value) =>
                  setExpiry(fmtExpiry(value))
                }
                maxLength={7}
                style={styles.plainInput}
              />
            </div>

            <div style={styles.fieldGroup}>
              <Label style={styles.fieldLabel}>
                {t.cvv}
              </Label>

              <Input
                type="password"
                placeholder="•••"
                value={cvv}
                onChange={(value) =>
                  setCvv(value.slice(0, 4))
                }
                maxLength={4}
                style={styles.plainInput}
              />
            </div>
          </div>
        </div>
      )} */}

      <Button
        disabled={!method || isPending}
        onClick={onPay}
        style={{
          ...styles.payBtn,
          ...(!method || isPending
            ? styles.payBtnDisabled
            : {}),
        }}
      >
        {isPending ? (
          t.processing
        ) : (
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
              {t.pay} {currency} {price.toFixed(2)}
            </span>
          </div>
        )}
      </Button>

      <p style={styles.footerNote}>
        <ShieldSmallIcon />
        {t.footerNote}
      </p>
    </div>
  );
}