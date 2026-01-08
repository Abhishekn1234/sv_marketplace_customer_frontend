import { X, Download, Printer } from "lucide-react";
import { useState } from "react";
import { type Booking } from "../../../domain/entities/booking.types";

interface InvoiceModalProps {
  booking: Booking;
  onClose: () => void;
}

export const InvoiceModal = ({ booking, onClose }: InvoiceModalProps) => {
  const [printing, setPrinting] = useState(false);

  const formatCurrency = (amount: number, currency: string) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  const handlePrint = () => {
    if (printing) return;
    setPrinting(true);
    window.print();
    setTimeout(() => setPrinting(false), 800);
  };

  return (
    <>
      {/* OVERLAY – hidden in print */}
      <div className="fixed inset-0 bg-black/50 z-40 print:hidden" />

      {/* INVOICE CONTAINER */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 print:p-0 print:static">
        <div
          className="
            bg-white w-full max-w-4xl rounded-2xl shadow-xl
            print:shadow-none print:rounded-none
            print:max-w-none print:w-full
          "
        >
          {/* Header */}
          <div className="border-b px-8 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Invoice
              </h1>
              <p className="text-sm text-gray-600">
                Invoice ID: {booking._id}
              </p>
              <p className="text-sm text-gray-600">
                Date: {new Date().toLocaleDateString()}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 print:hidden"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <div className="px-8 py-6 text-sm">
            {/* Service Info */}
            <div className="mb-6">
              <p className="text-lg font-semibold text-gray-900">
                {booking.service?.name}
              </p>
              <p className="text-gray-600">
                Service Tier: {booking.serviceTier?.displayName}
              </p>
            </div>

            {/* Table */}
            <div className="border rounded-lg overflow-hidden mb-6">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold">
                      Description
                    </th>
                    <th className="text-right px-4 py-3 font-semibold">
                      Rate
                    </th>
                    <th className="text-right px-4 py-3 font-semibold">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="px-4 py-4">
                      <p className="font-medium">
                        {booking.service?.name}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {booking.serviceTier?.displayName}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-right">
                      {formatCurrency(booking.amount, booking.currency)}
                    </td>
                    <td className="px-4 py-4 text-right font-semibold">
                      {formatCurrency(booking.amount, booking.currency)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div className="flex justify-end">
              <div className="w-64 border-t pt-3 flex justify-between text-base font-bold">
                <span>Total</span>
                <span>
                  {formatCurrency(booking.amount, booking.currency)}
                </span>
              </div>
            </div>

            {/* Terms */}
            <div className="mt-8 text-xs text-gray-600 border-t pt-4">
              Payment due within 15 days of invoice date.
            </div>
          </div>

          {/* Footer */}
          <div className="border-t px-8 py-5 flex justify-end gap-3 print:hidden">
            <button className="px-5 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
            <button
              onClick={handlePrint}
              disabled={printing}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
