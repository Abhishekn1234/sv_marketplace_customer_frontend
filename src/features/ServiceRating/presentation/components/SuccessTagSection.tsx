import { useLanguage } from "@/features/context/LanguageContext";
import type { FC } from "react";

interface Tag {
  label: string;
  selected: boolean;
}

interface SuccessTagSectionProps {
  tags: Tag[];
  setTags: (tags: Tag[]) => void;
}

const SuccessTagSection: FC<SuccessTagSectionProps> = ({ tags, setTags }) => {
  const toggleTag = (index: number) => {
    const updated = [...tags];
    updated[index].selected = !updated[index].selected;
    setTags(updated);
  };
  const {t}=useLanguage();

  return (
    <div className="mb-8">
      <label className="block text-sm font-semibold text-gray-900 mb-3">
       {t.serviceratingpage.whatWentWell} <span className="text-gray-500 font-normal">({t.serviceratingpage.optional})</span>
      </label>

      <div className="flex flex-wrap gap-2.5">
        {tags.map((tag, index) => (
          <button
            key={index}
            onClick={() => toggleTag(index)}
            className={`px-[18px] py-[10px] rounded-full text-sm font-medium border transition-all duration-200 whitespace-nowrap ${
              tag.selected
                ? "bg-blue-50 border-blue-600 text-blue-600"
                : "bg-white border-gray-200 text-gray-600 hover:border-blue-600 hover:text-blue-600"
            }`}
          >
            {tag.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuccessTagSection;