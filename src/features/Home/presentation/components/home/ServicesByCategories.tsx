import  { useState } from "react";
import { useServices } from "../../../../Bookings/presentation/hooks/useServices";
import type { Service } from "../../../../Bookings/domain/entities/service.types";
import BookingServiceModal from "../../../../Bookings/presentation/components/bookings/BookServiceModal";


export default function ServicesByCategory() {
  const { categories: categoryData = [], loading, error } = useServices();

  /* ------------------------------------------------------------------ */
  /* MODAL STATE */
  /* ------------------------------------------------------------------ */

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const openModal = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedService(null);
    setIsModalOpen(false);
  };

  /* ------------------------------------------------------------------ */
  /* STATES */
  /* ------------------------------------------------------------------ */

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-600">
        Loading services...
      </p>
    );

  if (error)
    return (
      <p className="text-center mt-10 text-red-500">
        {error}
      </p>
    );

  // ✅ NO CATEGORIES
  if (categoryData.length === 0)
    return (
      <p className="text-center mt-10 text-gray-500">
        No service items found
      </p>
    );

  /* ------------------------------------------------------------------ */
  /* RENDER */
  /* ------------------------------------------------------------------ */

  return (
    <div className="container mx-auto px-6 py-12">
      {categoryData.map((category) => {
        const servicesInCategory = category.services ?? [];

        // ✅ SKIP EMPTY CATEGORIES
        if (servicesInCategory.length === 0) return null;

        return (
          <div key={category._id} className="mb-24">
            {/* CATEGORY HEADER */}
            <div className="flex items-center gap-4 mb-6">
              {category.iconUrl && (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
                  <img
                    src={category.iconUrl}
                    alt={category.name}
                    className="w-8 h-8 object-cover rounded-full"
                  />
                </div>
              )}
              <h3 className="text-3xl font-semibold">
                {category.name}
              </h3>
            </div>

            {/* SERVICES GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {servicesInCategory.map((service) => {
                const firstTier = service.pricingTiers?.[0];
                const hourly = firstTier?.HOURLY?.ratePerHour;
                const perDay = firstTier?.PER_DAY?.ratePerDay;
                const currency = service.currency || "SAR";

                return (
                  <div
                    key={service._id}
                    className="flex flex-col h-full p-4 shadow-md rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                  >
                    {/* SERVICE NAME */}
                    <h4 className="text-lg font-semibold mb-2">
                      {service.name}
                    </h4>

                    {/* THUMBNAIL */}
                    {service.thumbnailUrl && (
                      <img
                        src={service.thumbnailUrl}
                        alt={service.name}
                        className="w-full h-40 object-cover rounded-lg mb-2"
                      />
                    )}

                    {/* DESCRIPTION */}
                    <p className="text-gray-700 flex-1 mb-2 line-clamp-3">
                      {service.description}
                    </p>

                    {/* PRICING */}
                    <div className="mt-auto text-gray-800 font-medium space-y-1 mb-4">
                      {hourly && (
                        <p>
                          Hourly: {currency} {hourly}
                        </p>
                      )}
                      {perDay && (
                        <p>
                          Per Day: {currency} {perDay}
                        </p>
                      )}
                      {!hourly && !perDay && (
                        <p className="text-gray-400">
                          Pricing not available
                        </p>
                      )}
                    </div>

                    {/* ACTION */}
                    <button
                      onClick={() => openModal(service)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Book Now
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* BOOKING MODAL */}
      <BookingServiceModal
        isOpen={isModalOpen}
        onClose={closeModal}
        service={selectedService}
      />
    </div>
  );
}

