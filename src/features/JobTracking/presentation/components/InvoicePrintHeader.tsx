import { formatDate } from "@/components/utils/formatdate";
import { formatText } from "@/components/utils/formattext";
interface InvoiceHeaderProps {
  t: any;
  invoice: any;
  isPaid: boolean;
}

export function InvoiceHeader({ t, invoice, isPaid }: InvoiceHeaderProps) {
  return (
    <div className="inv-header">
      <div className="inv-header-left">
        <div className="inv-title">{t.invoice.title}</div>
        <div className="inv-meta">
          <div className="inv-meta-item">
            {t.invoice.no}
            <strong>{invoice.invoiceNumber}</strong>
          </div>
          <div className="inv-meta-item">
            {t.invoice.issued}
            <strong>{formatDate(invoice.generatedAt)}</strong>
          </div>
        </div>
      </div>
      <div className="inv-header-right">
        <div>
          <div className="inv-brand">HomeEase</div>
          <div className="inv-brand-sub"> {t.invoice.onDemandServices}</div>
        </div>
        <div
          className={`inv-status-badge ${
            isPaid ? "inv-status-paid" : "inv-status-unpaid"
          }`}
        >
          {formatText(invoice.status)}
        </div>
      </div>
    </div>
  );
}

interface InvoicePartiesProps {
  t: any;
  booking: any;
  worker: any;
  formatCoords: (coords?: number[]) => string;
}

export function InvoiceParties({
  t,
  booking,
  worker,
  formatCoords,
}: InvoicePartiesProps) {
  return (
    <div className="inv-parties">
      <div>
        <div className="inv-party-label"> {t.invoice.billedTo}</div>
        <div className="inv-party-name">{booking.customer?.fullName}</div>
        <div className="inv-party-detail">
          {booking.customer?.email}
          <br />
          {booking.customer?.phone}
        </div>
        <div className="inv-party-sub">
          <div className="inv-party-sub-label">
            {t.invoice.serviceLocation}
          </div>
          <div className="inv-party-sub-val">
            {formatCoords(booking.location?.coordinates)}
          </div>
        </div>
      </div>

      <div className="inv-party-divider" />

      <div style={{ paddingLeft: "7mm" }}>
        <div className="inv-party-label">{t.invoice.serviceProfessional}</div>
        <div className="inv-party-name">{worker?.fullName}</div>
        <div className="inv-party-detail">
          {worker?.email}
          <br />
          {worker?.phone}
        </div>
        <div className="inv-party-sub">
          <div className="inv-verified">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path
                d="M2 5l2 2 4-4"
                stroke="#5A8A5A"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {t.invoice.verifiedProfessional}
          </div>
        </div>
      </div>
    </div>
  );
}