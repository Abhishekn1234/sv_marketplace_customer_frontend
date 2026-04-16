import * as XLSX from "xlsx";
import jsPDF from "jspdf";

export default function ShareModal({ booking, onClose }: any) {
  if (!booking) return null;

  // ---------- EXPORT EXCEL ----------
  const exportExcel = () => {
    const data = [
      {
        Service: booking?.serviceId?.name,
        Tier: booking?.serviceTierId?.displayName,
        Status: booking?.status,
        Amount: booking?.totalCost,
        Currency: booking?.currency,
        Duration: booking?.schedule?.estimatedHours,
      },
    ];

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Booking");

    XLSX.writeFile(wb, "booking-details.xlsx");
  };

  // ---------- EXPORT PDF ----------
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.text("Booking Details", 10, 10);
    doc.text(`Service: ${booking?.serviceId?.name}`, 10, 20);
    doc.text(`Tier: ${booking?.serviceTierId?.displayName}`, 10, 30);
    doc.text(`Status: ${booking?.status}`, 10, 40);
    doc.text(`Amount: ${booking?.totalCost} ${booking?.currency}`, 10, 50);

    doc.save("booking-details.pdf");
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[320px] space-y-4">

        <h2 className="font-bold text-lg">Export Booking</h2>

        <button
          onClick={exportPDF}
          className="w-full bg-red-500 text-white py-2 rounded-lg"
        >
          Download PDF
        </button>

        <button
          onClick={exportExcel}
          className="w-full bg-green-500 text-white py-2 rounded-lg"
        >
          Download Excel
        </button>

        <button
          onClick={onClose}
          className="w-full bg-gray-200 py-2 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}