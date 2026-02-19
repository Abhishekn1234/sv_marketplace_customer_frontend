import { Badge } from "@/components/ui/badge";

export default function LocationBadge() {
  return (
    <Badge
      variant="outline"
      className="
        inline-flex items-center gap-2
        px-4 py-2
        bg-white
        border border-gray-200
        rounded-full
        shadow-sm
        mb-1
      "
    >
      <span className="w-2 h-2 rounded-full bg-amber-500" />

      <span
        className="
          text-[12px] font-bold uppercase
          tracking-[1px]
          text-gray-500
        "
      >
        Step 2 of 3
      </span>
    </Badge>
  );
}
