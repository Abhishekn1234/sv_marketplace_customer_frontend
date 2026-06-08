"use client";
import SummaryItem from "./SummaryItem";
import { formatSmartDate } from "../helpers/formatdatetime";
import { useLanguage } from "@/features/context/LanguageContext";
import { formatBookingDurationWithTranslation } from "@/features/Bookings/presentation/helpers/formatduration";
import { InfoIcon } from "@/components/icons";
import { useServices } from "@/features/Bookings/presentation/hooks/useServices";



interface BookingSummaryProps {
  data: any;
  placeName: string;
  tierName: string;
}

export default function BookingSummary({ data, placeName, tierName }: BookingSummaryProps) {
  const {t}=useLanguage();
  const duration = formatBookingDurationWithTranslation(data, t);
//  console.log(data);
   const { services } = useServices();

const serviceId =
  typeof data.serviceId === "string"
    ? data.serviceId
    : data.serviceId?._id;

const serviceName =
  services?.find((s: any) => String(s._id) === String(serviceId))?.name ||
  (typeof data.serviceId === "object" ? data.serviceId?.name : null) ||
  data.serviceName ||
  "N/A";
//  console.log("Service Object:", serviceObject);
//  console.log("Service Name:", serviceName);
  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden mb-8 shadow-lg text-left">
      <div className="px-6 py-5 bg-gray-50 border-b-2 border-gray-200">
                  <h3 className="text-xs font-bold uppercase text-gray-400">
            {t.confirmationpage.bookingSummary.title}
          </h3>
      </div>

      <div className="px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
         <SummaryItem label={t.confirmationpage.bookingSummary.service} value={serviceName} />
        <SummaryItem label={t.confirmationpage.bookingSummary.tier} value={tierName} />
        <SummaryItem label={t.confirmationpage.bookingSummary.timeAndDate} value={formatSmartDate(data?.schedule?.startDateTime)} />
        <SummaryItem label={t.confirmationpage.bookingSummary.location} value={placeName} />
        <SummaryItem label={t.confirmationpage.bookingSummary.duration} value={duration} />
        <SummaryItem label={t.confirmationpage.bookingSummary.workers} value={data?.numberOfWorkers} />
        <SummaryItem label={t.confirmationpage.bookingSummary.totalPaid} value={<span className="text-blue-600">{data?.currency} {data?.totalCost}</span>} />
                </div>

        {/* Info Box */}
        <div className="flex items-start gap-4 p-5 bg-emerald-50 border-2 border-emerald-200 rounded-xl">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
           <InfoIcon/>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-1">{t.confirmationpage.bookingSummary.providerAssignmentTitle}</h4>
            <p className="text-sm text-gray-500">
              {t.confirmationpage.bookingSummary.providerAssignmentDesc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}