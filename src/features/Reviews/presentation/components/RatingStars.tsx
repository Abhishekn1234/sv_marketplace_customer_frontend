import { StarIcon } from "@/components/icons";

interface RatingStarsProps {
  value: number;
  label?: string;
}

export default function RatingStars({ value, label }: RatingStarsProps) {
  return (
    <div className="flex items-center gap-1.5">
      {label && <span className="text-xs text-gray-500">{label}</span>}
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon
            key={i}
            className={
              i < value
                ? "h-3.5 w-3.5 fill-orange-400 text-orange-400"
                : "h-3.5 w-3.5 fill-gray-200 text-gray-200"
            }
          />
        ))}
      </div>
    </div>
  );
}