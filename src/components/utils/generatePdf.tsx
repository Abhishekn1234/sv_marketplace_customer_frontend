import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateInvoicePdf = (
  invoice: any,
  categories: any[],
  services: any[],
  serviceTiers: any[]
) => {
  const doc = new jsPDF();
  const booking = invoice.bookingId;

  // ✅ Find service
  const service = services?.find((s) => s._id === booking.serviceId);

  // ✅ Find category
  const category = categories?.find(
    (c) => c._id === service?.category
  );

  // ✅ Find tier
  const tier = serviceTiers?.find(
    (t) => t._id === booking.serviceTierId
  );

  const workDuration =
    booking.pricingMode === "HOURLY"
      ? `${invoice.actualWorkHours} Hours`
      : `${invoice.actualWorkDays} Days`;

  const estimatedDuration =
    booking.pricingMode === "HOURLY"
      ? `${booking.schedule?.estimatedHours ?? 0} Hours`
      : `${booking.schedule?.estimatedDays ?? 0} Days`;

  // ---------- HEADER ----------
  doc.setFontSize(22);
  doc.text("INVOICE", 14, 20);

  doc.setFontSize(10);
  doc.text(`Invoice No : ${invoice.invoiceNumber}`, 14, 30);
  doc.text(`Status : ${booking.status}`, 14, 36);
  doc.text(
    `Generated At : ${new Date(invoice.generatedAt).toLocaleString()}`,
    14,
    42
  );

  // ---------- BOOKING DETAILS ----------
  autoTable(doc, {
    startY: 50,
    head: [["Booking Details", ""]],
    body: [
      ["Booking ID", booking._id],
      ["Category", category?.name ?? "-"],
      ["Service", service?.name ?? "-"],
      ["Service Tier", tier?.name ?? "-"],
      ["Customer ID", booking.userId],
      ["Pricing Mode", booking.pricingMode],
      ["Estimated Duration", estimatedDuration],
      ["Workers", booking.numberOfWorkers],
      ["Currency", invoice.currency],
      ["Worked Duration", workDuration],
    ],
    theme: "grid",
    styles: {
      cellPadding: 4,
      fontSize: 10,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
    },
  });

  // ---------- AMOUNT BREAKDOWN ----------
  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 12,
    head: [["Amount Breakdown", "Value"]],
    body: [
      ["Original Amount", `${invoice.originalAmount} ${invoice.currency}`],
      ["Worker Pool Amount", `${invoice.workerPoolAmount} ${invoice.currency}`],
      ["Commission", `${invoice.commissionAmount} ${invoice.currency}`],
      ["Final Amount", `${invoice.finalAmount} ${invoice.currency}`],
    ],
    theme: "grid",
    styles: {
      cellPadding: 4,
      fontSize: 10,
    },
    headStyles: {
      fillColor: [39, 174, 96],
      textColor: 255,
    },
  });

  // ---------- FOOTER ----------
  const endY = (doc as any).lastAutoTable.finalY + 20;

  doc.setFontSize(10);
  doc.text(
    "Thank you for using our service!",
    14,
    endY
  );

  doc.save(`${invoice.invoiceNumber}.pdf`);
};