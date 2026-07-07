import { formatSmartDate } from "@/components/utils/formatsmartdate";


interface InvoiceTotalsSignaturesProps {
  t: any;
  invoice: any;
  booking: any;
  isPaid: boolean;
  finalAmount?: number;
  format: (n: number) => string;
}

export default function InvoiceTotalsSignatures({
  t,
  invoice,
  booking,
  isPaid,
  finalAmount,
  format,
}: InvoiceTotalsSignaturesProps) {
  return (
    <div className="inv-bottom">
      {/* Reference row */}
      <div className="inv-ref-row">
        <div className="inv-ref-item">
          <span className="inv-ref-key">{t.invoice.bookingRef}</span>
          <span className="inv-ref-val">{booking.bookingCode}</span>
        </div>
        <div className="inv-ref-item">
          <span className="inv-ref-key">{t.invoice.servicePeriod}</span>
          <span className="inv-ref-val">
            {formatSmartDate(booking.startedAt)} —{" "}
            {formatSmartDate(booking.completedAt)}
          </span>
        </div>
      </div>

      {/* Totals */}
      <div className="inv-totals-wrap">
        <div className="inv-totals">
          <div className="inv-totals-row">
            <span className="inv-totals-label">{t.invoice.subtotal}</span>
            <span className="inv-totals-val">
              {format(booking?.actualValues.taxableAmount)}
            </span>
          </div>
          <div className="inv-totals-row">
            <span className="inv-totals-label">
              {t.invoice.vat}({invoice.vatRate}%)
            </span>
            <span className="inv-totals-val">{format(invoice.vatAmount)}</span>
          </div>
          <div className="inv-totals-divider" />
          <div className="inv-totals-final-row">
            <span className="inv-totals-final-label">
              {t.invoice.totalDue}
            </span>
            <span className="inv-totals-final-val">
              {format(finalAmount || invoice.finalAmount)}
            </span>
          </div>
          {!isPaid && (
            <div className="inv-due-note">{t.invoice.paymentDue}</div>
          )}
        </div>
      </div>

      {/* Signatures */}
      <div className="inv-signatures">
        <div className="inv-sig-block">
          <div className="inv-sig-line" />
          <div className="inv-sig-label"> {t.invoice.authorizedSignature}</div>
          <div className="inv-sig-name">HomeEase Operations</div>
        </div>
        <div className="inv-sig-block">
          <div className="inv-sig-line" />
          <div className="inv-sig-label"> {t.invoice.customerSignature}</div>
          <div className="inv-sig-name">{booking.customer?.fullName}</div>
        </div>
      </div>
    </div>
  );
}