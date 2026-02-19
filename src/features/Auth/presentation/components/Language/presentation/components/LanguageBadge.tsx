export default function LanguageBadge() {
  return (
    <div className="flex justify-center mt-10">
      <div className="
        inline-flex items-center gap-2
        px-4 py-2
        bg-white border border-gray-200
        rounded-full shadow-sm
      ">
        <span className="w-2 h-2 rounded-full bg-warning"></span>
        <span className="
          text-xs font-bold uppercase tracking-widest text-gray-500
        ">
          Step 1 of 3
        </span>
      </div>
    </div>
  );
}

