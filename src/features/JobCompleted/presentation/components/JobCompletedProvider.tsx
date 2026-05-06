import { Image } from "@/components/input";
import { useLanguage } from "@/features/context/LanguageContext";
import CommonCard from "@/components/common/CommonCards";

export default function JobCompletedProvider({ booking }: any) {
  const { t } = useLanguage();

  const worker = booking?.assignedWorkers?.[0];

  return (
    <CommonCard>
      {/* TITLE */}
      <h2 className="font-bold mb-4">
        {t.jobcompletedpage.yourProfessional}
      </h2>

      {/* CONTENT */}
      <div className="flex items-center gap-4">
        <Image
          src={
            worker?.profilePictureUrl ||
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
          }
          className="w-[72px] h-[72px] rounded-xl object-cover"
          alt="provider"
        />

        <div>
          <div className="font-bold flex items-center gap-2">
            {worker?.fullName || "Unknown Worker"}
          </div>

          <div className="text-sm text-gray-500">
            {worker?.email && <div>{worker.email}</div>}
            {worker?.phone && <div>{worker.phone}</div>}
          </div>
        </div>
      </div>
    </CommonCard>
  );
}