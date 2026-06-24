import { useLanguage } from "@/features/context/LanguageContext";
import { aboutteammembers } from "../data/aboutteam";
import { UserIcon } from "@/components/icons";

export default function AboutTeam() {
  const {t,isRTLOrder}=useLanguage();
  const team =aboutteammembers(t);

  return (
    <section className="mb-8" dir={isRTLOrder?"rtl":""}>

      {/* Section Title */}
      <h2 className="text-[32px] font-bold text-gray-900  mb-8">
        {t.aboutpage.team.title}
      </h2>

      {/* Grid */}
      <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))]"dir={isRTLOrder?"rtl":""}>
        {team.map((member, index) => (
          <div
            key={index}
            className="bg-white rounded-[20px] p-8 border-2 border-gray-200 text-center transition-all duration-300 hover:border-blue-600 hover:shadow-xl"
          >
            {/* Avatar */}
            <div className="w-[100px] h-[100px] rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-5">
           <UserIcon className="h-16 w-16 text-blue-600" />
            </div>

            {/* Name */}
            <h3 className="text-[18px] font-bold text-gray-900 mb-2">
              {member.name}
            </h3>

            {/* Role */}
            <p className="text-[14px] text-gray-500">
              {member.role}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
