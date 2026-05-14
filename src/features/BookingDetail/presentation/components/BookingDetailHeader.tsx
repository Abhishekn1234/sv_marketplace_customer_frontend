import { useServiceCategory } from "@/features/Bookings/presentation/hooks/useServiceCategory";
import { useParams } from "react-router-dom";
import BookingDetailAddress from "./BookingDetailAddress";
import BookingDetailDateandmoredetails from "./BookingDetailDateandmoredetails";
import { useLanguage } from "@/features/context/LanguageContext";
import { Image } from "@/components/input";
import CommonCard from "@/components/common/CommonCards";

export default function BookingDetailHeader() {
  const { serviceId, serviceTierId } = useParams();

  const { data: categories } = useServiceCategory();
  
  const {t}=useLanguage();
  // 🔎 Find service inside categories
  const service = categories
    ?.flatMap((cat) => cat.services)
    ?.find((service) => service._id === serviceId);
    // console.log(service);

  // 🔎 Find category of that service
  const category = categories?.find((cat) =>
    cat.services?.some((s) => s._id === serviceId)
  );

  // console.log(category);
  const tier = service?.pricingTiers?.find(
    (tier) => tier.tierId === serviceTierId
  );
  // console.log(tier);

  const servicename = service?.name;
  const servicedescription = service?.description;
  const servicetype = category?.name;
  const tiername = tier?.tier?.displayName;

  return (
  <div className="px-4 pb-16 sm:px-6 lg:px-8">
  
  {/* Title */}
  <h1
    className="
      mb-10
      text-3xl
      font-bold
      tracking-[-0.02em]
      text-gray-900
      sm:text-4xl
      lg:text-[42px]
    "
  >
    {t.bookingdetailpage.title}
  </h1>

  <div className="max-w-7xl">
    <div
      className="
        grid
        grid-cols-1
        gap-8
        lg:grid-cols-[2fr_1fr]
      "
    >

      {/* LEFT SIDE */}
      <div className="space-y-6">

        {/* Service Summary */}
        <CommonCard
          className="
            rounded-2xl
            border-2
            border-gray-200
            p-6
            transition-all
            duration-200
            hover:border-blue-300
          "
        >
          
          {/* Heading */}
          <h2
            className="
              mb-4
              text-xs
              font-bold
              uppercase
              tracking-[0.5px]
              text-gray-400
            "
          >
            {t.bookingdetailpage.serviceSummary}
          </h2>

          {/* Service Top */}
          <div className="mb-6 flex items-start gap-4">
            
            {/* Icon */}
            <div
              className="
                flex
                h-14
                w-14
                flex-shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-blue-600/10
                sm:h-16
                sm:w-16
              "
            >
              <Image src={category?.iconUrl} />
            </div>

            {/* Content */}
            <div>
              <h3
                className="
                  mb-1.5
                  text-lg
                  font-bold
                  text-gray-900
                  sm:text-xl
                "
              >
                {servicename}
              </h3>

              <p
                className="
                  text-sm
                  leading-[1.6]
                  text-gray-500
                "
              >
                {servicedescription}
              </p>
            </div>
          </div>

          {/* Service Details */}
          <div className="border-t border-gray-200 pt-4">

            {/* Type */}
            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-gray-200
                py-3
              "
            >
              <span
                className="
                  text-sm
                  font-medium
                  text-gray-500
                "
              >
                {t.bookingdetailpage.serviceType}
              </span>

              <span
                className="
                  text-sm
                  font-semibold
                  text-gray-900
                "
              >
                {servicetype}
              </span>
            </div>

            {/* Professional */}
            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-gray-200
                py-3
              "
            >
              <span
                className="
                  text-sm
                  font-medium
                  text-gray-500
                "
              >
                {
                  t.bookingdetailpage
                    .serviceProfessional
                }
              </span>

              <span
                className="
                  text-sm
                  font-semibold
                  text-gray-900
                "
              >
                {tiername}
              </span>
            </div>

            {/* Equipment */}
            <div
              className="
                flex
                items-center
                justify-between
                py-3
              "
            >
              <span
                className="
                  text-sm
                  font-medium
                  text-gray-500
                "
              >
                {t.bookingdetailpage.equipment}
              </span>

              <span
                className="
                  text-sm
                  font-semibold
                  text-blue-600
                "
              >
                {t.bookingdetailpage.included}
              </span>
            </div>

          </div>
        </CommonCard>

        {/* Address */}
        <BookingDetailAddress />

      </div>

      {/* RIGHT SIDE */}
      <div
        className="
          h-fit
          lg:sticky
          lg:top-24
        "
      >
        <BookingDetailDateandmoredetails />
      </div>

    </div>
  </div>
</div>
  );
}
