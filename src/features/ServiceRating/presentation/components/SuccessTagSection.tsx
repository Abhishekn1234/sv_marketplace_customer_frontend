import { useState } from "react";

export default function SuccessTagSection() {
  const initialTags = [
    { label: "Professional", selected: true },
    { label: "On Time", selected: false },
    { label: "Quality Work", selected: true },
    { label: "Friendly", selected: false },
    { label: "Good Communication", selected: false },
    { label: "Clean", selected: false },
  ];

  const [tags, setTags] = useState(initialTags);

  const toggleTag = (index: number) => {
    const updated = [...tags];
    updated[index].selected = !updated[index].selected;
    setTags(updated);
  };

  return (
    <div className="mb-8">
      {/* Label */}
      <label className="block text-sm font-semibold text-gray-900 mb-3">
        What went well?{" "}
        <span className="text-gray-500 font-normal">
          (Optional)
        </span>
      </label>

      {/* Tags Container (flex wrap EXACT like CSS version) */}
      <div className="flex flex-wrap gap-2.5">
        {tags.map((tag, index) => (
          <button
            key={index}
            onClick={() => toggleTag(index)}
            className={`
              px-[18px] py-[10px]
              rounded-full
              text-sm font-medium
              border
              transition-all duration-200
              whitespace-nowrap
              ${
                tag.selected
                  ? "bg-blue-50 border-blue-600 text-blue-600"
                  : "bg-white border-gray-200 text-gray-600 hover:border-blue-600 hover:text-blue-600"
              }
            `}
          >
            {tag.label}
          </button>
        ))}
      </div>
    </div>
  );
}