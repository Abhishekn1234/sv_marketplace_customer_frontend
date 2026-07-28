import Button from "@/components/input/Button";
import CommonModal from "@/components/common/CommonModal";
import { MailIcon, WhatsAppIcon } from "@/components/icons";
import { useLanguage } from "@/features/context/LanguageContext";
import { Booking } from "@/features/Bookings/domain/entities/booking.types";
import { useServices } from "@/features/Bookings/presentation/hooks/useServices";

interface Props {
  booking: Booking;
  onClose: () => void;
}

export default function ShareModal({ booking, onClose }: Props) {
  if (!booking) return null;

  const { t } = useLanguage();
  const { services, serviceTiers } = useServices();

  const selectedService = services?.find(
    (service: any) => service._id === booking.serviceId
  );

  const selectedTier = serviceTiers?.find(
    (tier: any) => tier._id === booking.serviceTierId
  );

  const share = t.jobcompletedpage.sharemodaljobcompleted;

  const message = `
${share.bookingDetails}

${share.service}: ${selectedService?.name || "-"}
${share.tier}: ${selectedTier?.displayName || "-"}
${share.status}: ${booking?.status || "-"}
${share.amount}: ${booking?.totalCost || 0} ${booking?.currency || ""}
${share.duration}: ${booking?.schedule?.estimatedHours || 0} ${share.hours}
`.trim();

  const handleWhatsApp = () => {
    const phone = "919207631486";

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const handleEmail = () => {
    const email = "abhishekpes123@gmail.com";

    window.location.href = `mailto:${email}?subject=${encodeURIComponent(
      share.emailSubject
    )}&body=${encodeURIComponent(message)}`;
  };

  return (
    <CommonModal open={true} onClose={onClose} width="max-w-md">
      <div className="mx-auto max-w-md p-6">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-gray-900">
            {share.title}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {share.subtitle}
          </p>
        </div>

        {/* Share Options */}
        <div className="grid grid-cols-2 gap-4">
          {/* WhatsApp */}
          <Button
            onClick={handleWhatsApp}
            variant="outline"
            className="group h-auto min-h-[170px] w-full rounded-2xl border-2 p-6 flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:border-green-500 hover:shadow-lg"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600 transition-all duration-300 group-hover:bg-green-500 group-hover:text-white">
              <WhatsAppIcon />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              {share.whatsapp}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {share.whatsappDescription}
            </p>
          </Button>

          {/* Gmail */}
          <Button
            onClick={handleEmail}
            variant="outline"
            className="group h-auto min-h-[170px] w-full rounded-2xl border-2 p-6 flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:border-red-500 hover:shadow-lg"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600 transition-all duration-300 group-hover:bg-red-500 group-hover:text-white">
              <MailIcon />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              {share.gmail}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {share.gmailDescription}
            </p>
          </Button>
        </div>

        {/* Footer */}
        <p className="mt-6 border-t border-gray-100 pt-4 text-center text-xs text-gray-400">
          {share.footer}
        </p>
      </div>
    </CommonModal>
  );
}