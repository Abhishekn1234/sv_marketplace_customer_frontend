import { useLanguage } from "@/features/context/LanguageContext";
import { aboutteammembers } from "../data/aboutteam";
import { UserIcon } from "@/components/icons";
import CommonCard from "@/components/common/CommonCards";

export default function AboutTeam() {
  const { t, isRTLOrder } = useLanguage();
  const team = aboutteammembers(t);

  return (
    <section className="mb-8" dir={isRTLOrder ? "rtl" : "ltr"}>
      {/* Section Title */}
      <h2 className="mb-8 text-[32px] font-bold text-gray-900">
        {t.aboutpage.team.title}
      </h2>

      {/* Grid */}
      <div
        className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))]"
        dir={isRTLOrder ? "rtl" : "ltr"}
      >
        {team.map((member, index) => (
          <CommonCard
            key={index}
            className="border-2 border-gray-200 transition-all duration-300 hover:border-blue-600 hover:shadow-xl"
            contentClassName="flex flex-col items-center p-8 text-center"
          >
            {/* Avatar */}
            <div className="mb-5 flex h-[100px] w-[100px] items-center justify-center rounded-full bg-blue-50">
              <UserIcon className="h-16 w-16 text-blue-600" />
            </div>

            {/* Name */}
            <h3 className="mb-2 text-[18px] font-bold text-gray-900">
              {member.name}
            </h3>

            {/* Role */}
            <p className="text-[14px] text-gray-500">
              {member.role}
            </p>
          </CommonCard>
        ))}
      </div>
    </section>
  );
}