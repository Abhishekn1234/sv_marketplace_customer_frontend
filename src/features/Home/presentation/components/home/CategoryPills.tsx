import React from "react";

interface Props {
  categories: string[]; // just names now
  activeCategory: string | null;
  onChange: (categoryName: string) => void;
}

const CategoryPills: React.FC<Props> = ({
  categories,
  activeCategory,
  onChange,
}) => {
  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((name) => {
        const isActive = activeCategory === name;

        return (
          <button
            key={name}
            onClick={() => onChange(name)}
            className={`
              px-6 py-2.5 rounded-full
              text-[15px] font-medium
              transition-all duration-200
              active:scale-95 cursor-pointer
              ${isActive
                ? "bg-blue-50 text-blue-600"
                : "bg-white text-gray-500 border border-gray-200 hover:border-blue-600 hover:text-blue-600 hover:-translate-y-0.5 hover:shadow-sm"
              }
            `}
          >
            {name}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryPills;
