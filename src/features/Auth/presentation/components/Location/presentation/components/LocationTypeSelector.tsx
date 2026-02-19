import { useLanguage } from "@/features/context/LanguageContext";

type Props = {
  selected: "home" | "office" | null;
  onSelect: (t: "home" | "office") => void;
};

export default function LocationTypeSelector({ selected, onSelect }: Props) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

      {/* HOME */}
      <div
        onClick={() => onSelect("home")}
        className={`group w-full sm:w-[260px] lg:w-[300px] flex items-center gap-4 p-6 rounded-2xl border-2 bg-white cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
          selected === "home"
            ? "border-blue-600 shadow-md"
            : "border-gray-200 hover:border-blue-600"
        }`}
      >
        {/* ICON CONTAINER (IMPORTANT) */}
        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${
            selected === "home"
              ? "bg-blue-600"
              : "bg-gray-100 group-hover:bg-blue-600"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`w-6 h-6 transition-colors ${
              selected === "home"
                ? "text-white"
                : "text-gray-900 group-hover:text-white"
            }`}
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>

        {/* TEXT */}
        <div className="flex-1 text-left">
          <h3 className="text-base font-bold text-gray-900">
            {t.location.home ?? "Home"}
          </h3>
          <p className="text-sm text-gray-500 font-medium">
            {t.location.homeDesc ?? "Your home address"}
          </p>
        </div>
      </div>

      {/* OFFICE */}
      <div
        onClick={() => onSelect("office")}
        className={`group w-full sm:w-[260px] lg:w-[300px] flex items-center gap-4 p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
          selected === "office"
            ? "border-amber-500 bg-amber-50 shadow-md"
            : "border-amber-200 bg-amber-50/50 hover:border-amber-500"
        }`}
      >
        {/* ICON CONTAINER (IMPORTANT) */}
        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${
            selected === "office"
              ? "bg-amber-500"
              : "bg-amber-100 group-hover:bg-amber-500"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`w-6 h-6 transition-colors ${
              selected === "office"
                ? "text-white"
                : "text-gray-900 group-hover:text-white"
            }`}
          >
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <path d="M9 22v-4h6v4" />
          </svg>
        </div>

        {/* TEXT */}
        <div className="flex-1 text-left">
          <h3 className="text-base font-bold text-gray-900">
            {t.location.office ?? "Office"}
          </h3>
          <p className="text-sm font-semibold text-amber-500 flex items-center gap-1">
            {t.location.premium ?? "Premium"}
          </p>
        </div>
      </div>
    </div>
  );
}

