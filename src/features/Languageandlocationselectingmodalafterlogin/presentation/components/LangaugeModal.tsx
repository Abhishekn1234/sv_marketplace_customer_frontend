import { useState } from "react";
import { useLang } from "@/features/Auth/presentation/components/Language/presentation/hooks/useLang";

export default function LanguageModal() {
  const [selected, setSelected] = useState<string | null>(null);
  const { setLanguage, loading } = useLang(); 
  const languages = [
    { code: "EN", label: "English" },
    { code: "AR", label: "Arabic" },
    { code: "HI", label: "Hindi" },
  ];

  const handleConfirm = async () => {
    if (!selected) return;

    try {
      await setLanguage(selected.toLowerCase() as "en" | "ar" | "hi");
      // optional: close modal or trigger a state update
      console.log("Language saved:", selected);
    } catch (err) {
      console.error("Failed to save language", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 space-y-6">
        <h2 className="text-xl font-semibold text-center">Select Language</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {languages.map((lang) => (
            <div
              key={lang.code}
              onClick={() => setSelected(lang.code)}
              className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center transition-all
                ${selected === lang.code ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:shadow-md"}
              `}
            >
              <span className="text-lg font-bold">{lang.code}</span>
              <span className="text-sm text-gray-500">{lang.label}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleConfirm}
            disabled={!selected || loading}
            className={`px-4 py-2 rounded-lg text-white font-semibold transition
              ${selected && !loading ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}
            `}
          >
            {loading ? "Saving..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
