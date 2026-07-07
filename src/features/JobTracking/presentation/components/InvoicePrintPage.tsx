import { useLanguage } from "@/features/context/LanguageContext";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import CommonTable, { type Column } from "@/components/common/CommonTable";

import type { InvoiceRow } from "../../domain/entities/invoicetyperow";
import InvoicePrintStyles from "./InvoicePrintStyles";
import { InvoiceHeader, InvoiceParties } from "./InvoicePrintHeader";
import InvoiceTotalsSignatures from "./InvoicePrintTotalsignatures";


export default function InvoicePrintPage() {
  const { state } = useLocation();
  const { t } = useLanguage();
  const {
    booking,
    invoice,
    service,
    serviceTierName,
    workedDuration,
    rate,
    finalAmount,
    currency,
  } = state || {};

  useEffect(() => {
    setTimeout(() => window.print(), 500);
  }, []);

  if (!booking || !invoice) return null;

  const worker = booking.assignedWorkers?.[0]?.worker;

  const format = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || invoice.currency || "SAR",
    }).format(n || 0);

  const formatCoords = (coords?: number[]) => {
    if (!coords || coords.length !== 2) return "—";
    const [lng, lat] = coords;
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  };

  const isPaid = invoice.status === "PAID";

  const tableData = [
    {
      service,
      tier: serviceTierName,
      qty: workedDuration,
      rate: booking.actualValues.finalAmount,
      amount: booking.actualValues.finalAmount,
    },
  ];

  const columns: Column<InvoiceRow>[] = [
    {
      header: t.common.service,
      accessor: "service",
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-900">{row.service}</p>

          <p className="mt-1 text-xs text-gray-500">
            Professional home service
          </p>
        </div>
      ),
    },

    {
      header: t.invoice.tier,
      accessor: "tier",
      render: (row) => (
        <span
          className="
            inline-flex
            rounded-full
            bg-blue-50
            px-3
            py-1
            text-xs
            font-semibold
            text-blue-700
          "
        >
          {row.tier}
        </span>
      ),
    },

    {
      header: t.invoice.qtyHours,
      accessor: "qty",
      render: (row) => (
        <div className="font-medium text-gray-700">{row.qty}</div>
      ),
    },

    {
      header: t.invoice.rate,
      accessor: "rate",
      render: (row) => (
        <div className="font-medium text-gray-700">{format(row.rate)}</div>
      ),
    },

    {
      header: t.invoice.amount,
      accessor: "amount",
      render: (row) => (
        <div
          className="
            text-right
            text-base
            font-bold
            text-gray-900
          "
        >
          {format(row.amount)}
        </div>
      ),
    },
  ];

  return (
    <div
      style={{
        background: "#F6F4F0",
        minHeight: "100vh",
        fontFamily: '"Inter", "system-ui", "sans-serif"',
      }}
    >
      <InvoicePrintStyles />

      <div className="invoice-root">
        <div className="invoice-page">
          <InvoiceHeader t={t} invoice={invoice} isPaid={isPaid} />

          <div className="inv-body">
            <InvoiceParties
              t={t}
              booking={booking}
              worker={worker}
              formatCoords={formatCoords}
            />

            {/* Section label */}
            <div className="inv-rule">
              <div className="inv-rule-label">
                {t.invoice.servicesRendered}
              </div>
              <div className="inv-rule-line" />
            </div>

            {/* Table */}
            <CommonTable data={tableData} columns={columns} pageSize={1} />

            {/* Spacer to push bottom content down */}
            <div style={{ flex: 1 }} />

            <InvoiceTotalsSignatures
              t={t}
              invoice={invoice}
              booking={booking}
              isPaid={isPaid}
              finalAmount={finalAmount}
              format={format}
            />
          </div>
        </div>
      </div>
    </div>
  );
}