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
  const { t, isRTLOrder } = useLanguage();
  const navigate = useNavigate();

  const [openInvoice, setOpenInvoice] = useState(false);
  const [openShare, setOpenShare] = useState(false);

  const actionItems = [
    {
      label: t.jobcompletedpage.viewInvoice,
      onClick: () => setOpenInvoice(true),
    },
    {
      label: t.jobcompletedpage.bookAgain,
      onClick: () => navigate("/"),
    },
    {
      label: t.jobcompletedpage.getSupport,
      onClick: () => navigate("/help"),
    },
    {
      label: t.jobcompletedpage.share,
      onClick: () => setOpenShare(true),
    },
  ];

  
  const displayItems = isRTLOrder
    ? [
        actionItems[1],
        actionItems[0],
        actionItems[3],
        actionItems[2],
      ]
    : actionItems;

  return (
    <CommonCard>
      {/* TITLE */}
      <h2
        className={`text-base font-bold text-gray-900 mb-4 ${
          isRTLOrder ? "flex-row-reverse" : ""
        }`}
      >
        {t.jobcompletedpage.whatsNext}
      </h2>

      {/* ACTION GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {displayItems.map((item, index) => (
          <div
            key={index}
            onClick={item.onClick}
            className={`flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition ${
              isRTLOrder ? "flex-row-reverse" : ""
            }`}
          >
            <span className="text-sm font-semibold">
              {item.label}
            </span>
          </div>
        ))}
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
        <ShareModal
          booking={booking}
          onClose={() => setOpenShare(false)}
        />
      )}
    </CommonCard>
  );
}