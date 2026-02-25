import React from "react";
import { useNavigate } from "react-router-dom";
import type { Category } from "@/features/Bookings/domain/entities/category.types";

interface Props {
  categories: Category[];
}

const PopularService: React.FC<Props> = ({ categories }) => {
  const navigate = useNavigate();

  if (!categories.length) {
    return (
      <p className="text-gray-400 font-medium text-center py-10">
        No categories found.
      </p>
    );
  }

  return (
    <div className="mt-8 px-4 sm:px-6 lg:px-2">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center sm:text-left">
        Popular Services
      </h2>

      {/* Responsive Grid */}
      <div className="
        grid
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        gap-5
      ">
        {categories.map((category) => {
          const services = category.services || [];

          // Average Rating
          const totalRating = services.reduce(
            (acc, service) => acc + (service.avgRating || 0),
            0
          );

          const averageRating =
            services.length > 0
              ? (totalRating / services.length).toFixed(1)
              : "0";

          // Average Price
          let totalPrice = 0;
          let priceCount = 0;

          services.forEach((service) => {
            const pricing = service.pricingTiers?.[0];

            if (pricing?.HOURLY?.ratePerHour) {
              totalPrice += pricing.HOURLY.ratePerHour;
              priceCount++;
            } else if (pricing?.PER_DAY?.ratePerDay) {
              totalPrice += pricing.PER_DAY.ratePerDay;
              priceCount++;
            }
          });

          const averagePrice =
            priceCount > 0
              ? `${services[0]?.currency || "SAR"} ${(
                  totalPrice / priceCount
                ).toFixed(0)}`
              : null;

          return (
            <div
              key={category._id}
              tabIndex={0}
              role="button"
              onClick={() => navigate(`/services/${category._id}`)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                navigate(`/services/${category._id}`)
              }
              className="
                relative
                bg-white
                rounded-2xl
                px-5 py-6
                text-center
                border border-gray-200
                cursor-pointer
                transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                hover:shadow-2xl
                hover:-translate-y-1
                hover:border-transparent
                active:scale-95
                overflow-hidden
                group
              "
            >
              {/* Animated Top Border */}
              <span className="
                absolute top-0 left-0 right-0 h-[3px]
                bg-blue-600
                scale-x-0
                origin-left
                transition-transform duration-300
                group-hover:scale-x-100
              "></span>

              {/* Icon */}
              <div className="
                w-16 h-16
                bg-gray-100
                rounded-2xl
                flex items-center justify-center
                mx-auto mb-4
                transition-all duration-300
                group-hover:bg-blue-50
                group-hover:scale-110
                group-hover:-rotate-6
              ">
                {category.iconUrl ? (
                  <img
                    src={category.iconUrl}
                    alt={category.name}
                    className="w-8 h-8 object-contain"
                  />
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="w-8 h-8 text-gray-600 group-hover:text-blue-600 transition-colors duration-300"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                  </svg>
                )}
              </div>

              {/* Category Name */}
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 truncate">
                {category.name}
              </h3>

             
              {averagePrice && (
                <p className="text-blue-600 font-bold text-sm sm:text-base tabular-nums">
                  {averagePrice}
                </p>
              )}

             
              <div className="flex items-center justify-center gap-1 text-gray-500 text-sm mt-2">
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 fill-yellow-500 text-yellow-500"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {averageRating}
              </div>

              {/* Service Count */}
              <p className="text-gray-400 text-xs mt-1">
                {services.length} Services
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PopularService;