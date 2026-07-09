import { StarIcon } from "@/components/icons";
import Button from "@/components/input/Button";
import type { FC } from "react";

export const StarRowSection: FC<{
  rating: number;
  setRating: (v: number) => void;
  label?: string;
}> = ({ rating, setRating, label }) => (
  <div className="flex flex-col items-center w-full">
    <div
      className="
        flex items-center justify-between
        w-full
        max-w-[280px]
        sm:max-w-[340px]
        md:max-w-[380px]
        lg:max-w-[440px]
        xl:max-w-[500px]
        mb-3
      "
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          className="
            p-0
            bg-transparent
            border-none
            shadow-none
            hover:scale-110
            active:scale-95
            transition-transform
            cursor-pointer
            w-10 h-10
            sm:w-12 sm:h-12
            md:w-14 md:h-14
            lg:w-16 lg:h-16
            flex items-center justify-center
          "
        >
          <StarIcon
            className={`w-full h-full transition-colors ${
              star <= rating
                ? "fill-yellow-500 text-yellow-500"
                : "fill-gray-300 text-gray-300"
            }`}
          />
        </Button>
      ))}
    </div>

    <p className="min-h-[24px] px-2 text-center text-sm sm:text-base text-gray-500">
      {label}
    </p>
  </div>
);