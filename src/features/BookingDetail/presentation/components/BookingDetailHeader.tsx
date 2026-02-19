import { useServices } from "@/features/Bookings/presentation/hooks/useServices";
import { useParams } from "react-router-dom";
import BookingDetailAddress from "./BookingDetailAddress";
import BookingDetailDateandmoredetails from "./BookingDetailDateandmoredetails";


export default function BookingDetailHeader() {
  const { serviceId, serviceTierId } = useParams();
  const { services, categories, serviceTiers } = useServices();
 
  const service = services?.find(
    (service) => service._id === serviceId
  );

  const category = categories?.find(
    (cat) => cat._id === service?.category?._id
  );

  const tier = serviceTiers?.find(
    (tier) => tier._id === serviceTierId
  );

  const servicename = service?.name;
  const servicedescription = service?.description;
  const servicetype = category?.name;
  const tiername = tier?.displayName;

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-16">
       <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-gray-900 mb-10 tracking-[-0.02em]">
          Booking Details
        </h1>
      {/* Centered Container */}
      <div className="max-w-7xl">

        {/* Page Title */}
       

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">

          {/* LEFT SIDE */}
          <div className="space-y-6">

            {/* Service Summary */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 transition-all duration-200 hover:border-blue-300">

              <h2 className="text-xs font-bold uppercase tracking-[0.5px] text-gray-400 mb-4">
                Service Summary
              </h2>

              {/* Service Info */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M9 3v18" />
                    <path d="M15 3v18" />
                  </svg>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5">
                    {servicename}
                  </h3>
                  <p className="text-sm text-gray-500 leading-[1.6]">
                    {servicedescription}
                  </p>
                </div>
              </div>

              {/* Service Details */}
              <div className="border-t border-gray-200 pt-4">

                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-sm text-gray-500 font-medium">
                    Service Type
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {servicetype}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-sm text-gray-500 font-medium">
                    Service Professional
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {tiername}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3">
                  <span className="text-sm text-gray-500 font-medium">
                    Equipment
                  </span>
                  <span className="text-sm font-semibold text-blue-600">
                    Included
                  </span>
                </div>

              </div>
            </div>

            {/* Address Card */}
            <BookingDetailAddress />

          </div>

          {/* RIGHT SIDE */}
          <div className="lg:sticky lg:top-24 h-fit">
           <BookingDetailDateandmoredetails/>
          </div>

        </div>
      </div>
    </div>
  );
}
