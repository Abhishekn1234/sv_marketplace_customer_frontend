import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/features/context/LanguageContext";
import InvoiceModal from "@/features/JobTracking/presentation/components/InvoiceModal";
import ShareModal from "./ShareModal";
import CommonCard from "@/components/common/CommonCards";

export default function JobCompletedActions({
  booking,
  services,
  categories,
}: any) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [openInvoice, setOpenInvoice] = useState(false);
  const [openShare, setOpenShare] = useState(false);

  return (
    <CommonCard>
      {/* TITLE */}
      <h2 className="text-base font-bold text-gray-900 mb-4">
        {t.jobcompletedpage.whatsNext}
      </h2>

      {/* ACTION GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

        <div
          onClick={() => setOpenInvoice(true)}
          className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition"
        >
          <span className="text-sm font-semibold">
            {t.jobcompletedpage.viewInvoice}
          </span>
        </div>

        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition"
        >
          <span className="text-sm font-semibold">
            {t.jobcompletedpage.bookAgain}
          </span>
        </div>

        <div
          onClick={() => navigate("/help")}
          className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition"
        >
          <span className="text-sm font-semibold">
            {t.jobcompletedpage.getSupport}
          </span>
        </div>

        <div
          onClick={() => setOpenShare(true)}
          className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition"
        >
          <span className="text-sm font-semibold">
            {t.jobcompletedpage.share}
          </span>
        </div>
      </div>

      {/* MODALS */}
      <InvoiceModal
        open={openInvoice}
        onClose={() => setOpenInvoice(false)}
        booking={booking}
        services={services}
        categories={categories}
      />

      {openShare && (
        <ShareModal booking={booking} onClose={() => setOpenShare(false)} />
      )}
    </CommonCard>
  );
}