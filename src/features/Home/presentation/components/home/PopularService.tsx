import { useNavigate } from "react-router-dom";
import { useServiceCategory } from "@/features/Bookings/presentation/hooks/useServiceCategory";
import { useServices } from "@/features/Bookings/presentation/hooks/useServices";

export default function PopularService() {
  const { data: categories, isPending: loadingCategories, error: errorCategories } =
    useServiceCategory();
  const { services, loading: loadingServices, error: errorServices } = useServices();

  const navigate = useNavigate();

  if (loadingCategories || loadingServices) {
    return <p className="text-gray-500">Loading...</p>;
  }

  if (errorCategories || errorServices) {
    return <p className="text-red-500">Failed to load data.</p>;
  }

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold text-gray-900 mb-5">Popular Services</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories?.map((category) => {
          // Filter services for this category
          const categoryServices = services?.filter(
            (service) => service.category._id === category._id
          );

          // Price from first service (if exists)
         const priceInfo =
  categoryServices && categoryServices.length
    ? (() => {
        const firstService = categoryServices[0];
        // console.log("First service for category", category.name, firstService);
        if (!firstService.pricingTiers?.length) return "N/A";

        let minPrice = Infinity;
        let minLabel = "";

        firstService.pricingTiers.forEach((tier: any) => {
          let basePrice: number | undefined;
          let label = "";

          if (tier.HOURLY) {
            basePrice = tier.HOURLY.ratePerHour;
            label = "/ hr";
          } else if (tier.PER_DAY) {
            basePrice = tier.PER_DAY.ratePerDay;
            label = "/ day";
          }

          if (!basePrice) return;

          let totalPrice = basePrice;

          if (tier.commissionType === "PERCENTAGE") {
            totalPrice += (basePrice * tier.commissionValue) / 100;
          } else {
            totalPrice += tier.commissionValue;
          }

          if (totalPrice < minPrice) {
            minPrice = totalPrice;
            minLabel = label;
          }
        });

        if (minPrice === Infinity) return "N/A";

        return `${firstService.currency || "$"} ${minPrice.toFixed(2)} ${minLabel}`;
      })()
    : null;


          const ratingInfo =
            categoryServices && categoryServices.length
              ? categoryServices[0].avgRating || 0
              : null;

          return (
            <div
              key={category._id}
              onClick={() => navigate(`/services/${category._id}`)}
              tabIndex={0}
              role="button"
              onKeyDown={(e) => {
                if (e.key === "Enter") navigate(`/services/${category._id}`);
              }}
              className="relative bg-white rounded-xl p-6 text-center border border-gray-200 cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-transparent group"
            >
              {/* Top border animation */}
              <span className="absolute top-0 left-0 right-0 h-1 bg-blue-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>

              {/* Category Icon */}
              <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3 transition-transform duration-300 group-hover:bg-blue-100 group-hover:scale-110 group-hover:-rotate-6">
                {category.iconUrl ? (
                  <img src={category.iconUrl} alt={category.name} className="w-7 h-7" />
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="w-7 h-7 text-gray-600"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                  </svg>
                )}
              </div>

              {/* Category Name */}
              <div className="text-sm font-semibold text-gray-900 mb-1">{category.name}</div>

              {/* Price */}
              {priceInfo && (
                <div className="text-lg font-bold text-gray-900 mb-1 tabular-nums">{priceInfo}</div>
              )}

              {/* Rating */}
              {ratingInfo !== null && (
                <div className="flex items-center justify-center gap-1 text-sm text-gray-500 font-medium">
                  ⭐ {ratingInfo}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}





