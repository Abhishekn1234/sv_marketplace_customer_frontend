import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/features/context/LanguageContext";
import InvoiceModal from "@/features/JobTracking/presentation/components/InvoiceModal";
import ShareModal from "./ShareModal";

export default function JobCompletedActions({
  booking,
  invoice,
  services,
  categories,
}: any) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [openInvoice, setOpenInvoice] = useState(false);
  const [openShare, setOpenShare] = useState(false);

  return (
    <div className="bg-white rounded-[20px] p-6 border border-gray-200 shadow-sm w-full max-w-3xl mx-auto mt-5">

      <h2 className="text-base font-bold text-gray-900 mb-4">
        {t.jobcompletedpage.whatsNext}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

        {/* VIEW INVOICE */}
        <div
          onClick={() => setOpenInvoice(true)}
          className="group flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer"
        >
          <span className="text-sm font-semibold">
            {t.jobcompletedpage.viewInvoice}
          </span>
        </div>

        {/* BOOK AGAIN */}
        <div
          onClick={() => navigate("/")}
          className="group flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer"
        >
          <span className="text-sm font-semibold">
            {t.jobcompletedpage.bookAgain}
          </span>
        </div>

        {/* GET SUPPORT */}
        <div
          onClick={() => navigate("/help")}
          className="group flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer"
        >
          <span className="text-sm font-semibold">
            {t.jobcompletedpage.getSupport}
          </span>
        </div>

        {/* SHARE */}
        <div
          onClick={() => setOpenShare(true)}
          className="group flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer"
        >
          <span className="text-sm font-semibold">
            {t.jobcompletedpage.share}
          </span>
        </div>
      </div>

      {/* INVOICE MODAL */}
      <InvoiceModal
        open={openInvoice}
        onClose={() => setOpenInvoice(false)}
        invoice={invoice}
        booking={booking}
        services={services}
      
        categories={categories}
      />

      {/* SHARE MODAL */}
      {openShare && (
        <ShareModal
          booking={booking}
          onClose={() => setOpenShare(false)}
        />
      )}
    </div>
  );
}