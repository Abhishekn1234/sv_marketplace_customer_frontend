import { Image } from "@/components/input";
import { getStatusText } from "../utils/getstatustexts";
import { useLanguage } from "@/features/context/LanguageContext";
import { Link } from "react-router-dom";
import CommonCard from "@/components/common/CommonCards";
import { TickIcon } from "@/components/icons";


export default function ProviderWorkingCard({ booking }: any) {
  const { t } = useLanguage();

  const assignment = booking?.assignedWorkers?.[0];
  const worker = assignment?.worker;

  const name = worker?.fullName ?? "Not Assigned";

  const image =
    worker?.profilePictureUrl ||
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face";

  const status = booking?.status;

  return (
    <CommonCard>
      {/* Header */}
      <h2 className="text-[16px] font-bold text-gray-900 mb-5">
        {t.jobprogresspage.professionalOnSite}
      </h2>

      {/* Worker Info */}
      <div className="flex items-center gap-4 mb-5">
        <Image
          src={image}
          className="w-16 h-16 rounded-2xl object-cover border-4 border-gray-100"
        />

        <div>
          <div className="flex items-center gap-2 text-[17px] font-bold text-gray-900">
            {name}

            {worker && (
              <TickIcon color="text-blue-400"/>
            )}
          </div>

          <div
            className={`text-sm font-medium ${
              status === "IN_PROGRESS"
                ? "text-emerald-600"
                : "text-gray-500"
            }`}
          >
            {getStatusText(status)}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link
          to={worker?.phone ? `tel:${worker.phone}` : "#"}
          className="flex-1 h-11 bg-blue-600 text-white rounded-xl font-semibold shadow-md hover:bg-blue-700 transition active:scale-95 flex items-center justify-center"
        >
          {t.jobprogresspage.call}
        </Link>

            <Link
        to={`/message/${booking._id}`}
        className="flex-1 h-11 bg-white border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition active:scale-95 flex items-center justify-center"
      >
        {t.jobprogresspage.message}
      </Link>
      </div>
    </CommonCard>
  );
}