import { useParams } from "react-router-dom";
import BookingDetailAddress from "./BookingDetailAddress";
import BookingDetailDateandmoredetails from "./BookingDetailDateandmoredetails";
import { useLanguage } from "@/features/context/LanguageContext";
import { Image } from "@/components/input";
import CommonCard from "@/components/common/CommonCards";
import { useServices } from "@/features/Bookings/presentation/hooks/useServices";

export default function BookingDetailHeader() {
  const { serviceId, serviceTierId } = useParams();
  const { t, localize, lang } = useLanguage();

  const {
    categories: services,
    loading: isPending,
  } = useServices({
    language: lang,
  });

  if (isPending) return null;

  // Find category that contains the selected service
  const category = services?.find((category) =>
    category.services.some((service) => service._id === serviceId)
  );

  // Find selected service
  const service = category?.services.find(
    (service) => service._id === serviceId
  );

  // Find selected pricing tier
  const tier = service?.pricingTiers.find((pricingTier) => {
    if (typeof pricingTier.tierId === "string") {
      return pricingTier.tierId === serviceTierId;
    }

    return pricingTier.tierId?._id === serviceTierId;
  });

  // Service Details
  const serviceName = localize(service?.name);
  const serviceDescription = localize(service?.description);

  // Category Details
  const serviceType = localize(category?.name);
  const categoryIcon = category?.iconUrl;

  // Tier Details
  const tierName =
    typeof tier?.tierId === "string"
      ? ""
      : localize(tier?.tierId?.displayName);

  return (
    <div className="px-4 pb-16 sm:px-6 lg:px-8">
      <h1 className="mb-10 text-3xl font-bold tracking-[-0.02em] text-gray-900 sm:text-4xl lg:text-[42px]">
        {t.bookingdetailpage.title}
      </h1>

      <div className="max-w-7xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <CommonCard className="rounded-2xl border-2 border-gray-200 p-6 transition-all duration-200 hover:border-blue-300">
              <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.5px] text-gray-400">
                {t.bookingdetailpage.serviceSummary}
              </h2>

              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-600/10 sm:h-16 sm:w-16">
                  <Image src={categoryIcon} />
                </div>

                <div>
                  <h3 className="mb-1.5 text-lg font-bold text-gray-900 sm:text-xl">
                    {serviceName}
                  </h3>

                  <p className="text-sm leading-[1.6] text-gray-500">
                    {serviceDescription}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between border-b border-gray-200 py-3">
                  <span className="text-sm font-medium text-gray-500">
                    {t.bookingdetailpage.serviceType}
                  </span>

                  <span className="text-sm font-semibold text-gray-900">
                    {serviceType}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-gray-200 py-3">
                  <span className="text-sm font-medium text-gray-500">
                    {t.bookingdetailpage.serviceProfessional}
                  </span>

                  <span className="text-sm font-semibold text-gray-900">
                    {tierName}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3">
                  <span className="text-sm font-medium text-gray-500">
                    {t.bookingdetailpage.equipment}
                  </span>

                  <span className="text-sm font-semibold text-blue-600">
                    {t.bookingdetailpage.included}
                  </span>
                </div>
              </div>
            </CommonCard>

            <BookingDetailAddress />
          </div>

          <div className="h-fit lg:sticky lg:top-24">
            <BookingDetailDateandmoredetails />
          </div>
        </div>
      </div>
    </div>
  );
}