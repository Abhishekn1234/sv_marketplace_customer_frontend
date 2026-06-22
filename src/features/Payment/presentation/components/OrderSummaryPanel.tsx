import { LockIcon, ShieldIcon } from "@/components/icons";
import { LineItem } from "./LineItem";
import { styles } from "./styles/paymentcardstyle";

interface Props {
  t: any;
  serviceName: string;
  bookingId: string;
  currency: string;
  price: number;
}

export default function OrderSummaryPanel({
  t,
  serviceName,
  bookingId,
  currency,
  price,
}: Props) {
  return (
    <div style={styles.panelLeft}>
      <div style={styles.secureBadge}>
        <LockIcon />
        {t.secureCheckout}
      </div>

      <div>
        <p style={styles.leftLabel}>{t.bookingSummary}</p>
        <p style={styles.serviceName}>{serviceName}</p>
        <p style={styles.bookingId}>
          {t.bookingId}: {bookingId}
        </p>
      </div>

      <div style={styles.divider} />

      <div>
        <p style={styles.leftLabel}>{t.totalDue}</p>
        <p style={styles.priceAmount}>
          <span style={styles.priceCurrency}>{currency}</span>
          {price.toFixed(2)}
        </p>
      </div>

      <div style={styles.divider} />

      <div style={styles.lineItems}>
        <LineItem
          label={t.serviceFee}
          value={`${currency} ${(price / 1.15).toFixed(2)}`}
        />
        <LineItem
          label={t.vat}
          value={`${currency} ${(price - price / 1.15).toFixed(2)}`}
        />
        <LineItem
          label={t.total}
          value={`${currency} ${price.toFixed(2)}`}
          isTotal
        />
      </div>

      <div style={styles.securityNote}>
        <ShieldIcon />
        <p style={styles.securityText}>{t.secureNote}</p>
      </div>
    </div>
  );
}