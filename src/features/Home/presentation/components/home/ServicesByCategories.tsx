import { useState } from "react"
import { useServices } from "../../../../Bookings/presentation/hooks/useServices"
import type { Service } from "../../../../Bookings/domain/entities/service.types"
import BookingServiceModal from "../../../../Bookings/presentation/components/bookings/BookServiceModal"
import { CommandCard } from "@/components/common/CommonCards"
import { Button } from "@/components/ui/button"

export default function ServicesByCategory() {
  const { categories: categoryData = [], loading, error } = useServices();
  console.log(categoryData);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  const openModal = (service: Service) => {
    setSelectedService(service)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setSelectedService(null)
    setIsModalOpen(false)
  }

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading services...</p>

  if (error)
    return <p className="text-center mt-10 text-red-500">{error}</p>

  if (categoryData.length === 0)
    return <p className="text-center mt-10 text-gray-500">No service items found</p>

  return (
    <div className="container mx-auto px-6 py-12">
      {categoryData.map((category) => {
        const servicesInCategory = category.services ?? []
        if (servicesInCategory.length === 0) return null
        const service = category.services?.[0]
        return (
          <div key={category._id} className="mb-24">
           
            <h3 className="text-3xl font-semibold mb-6">{service.name ?? category.name} </h3>

           
            <div className="flex flex-wrap gap-6">
              {servicesInCategory.map((service) => {
                const firstTier = service.pricingTiers?.[0]
                const hourly = firstTier?.HOURLY?.ratePerHour
                const perDay = firstTier?.PER_DAY?.ratePerDay
                const currency = service.currency || "SAR"

                return (
                  <CommandCard
                    key={service._id}
                    width="w-80"
                    className="flex flex-col h-[500px] flex-shrink-0"
                    footer={
                      <Button
                        onClick={() => openModal(service)}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        Book Now
                      </Button>
                    }
                  >
                    {/* Service Title */}
                    <h4 className="text-lg font-semibold mb-2">{service.name}</h4>

                    {/* Thumbnail */}
                    {service.thumbnailUrl && (
                      <img
                        src={service.thumbnailUrl}
                        alt={service.name}
                        className="w-full h-40 object-cover rounded-lg mb-14"
                        loading="lazy"
                      />
                    )}

                    {/* Description */}
                    <p className="text-sm flex-1 mb-3 line-clamp-3">
                      {service.description}
                    </p>

                    {/* Pricing */}
                    <div className="font-medium space-y-1">
                      {hourly && <p>Hourly: {currency} {hourly}</p>}
                      {perDay && <p>Per Day: {currency} {perDay}</p>}
                      {!hourly && !perDay && (
                        <p className="text-muted-foreground">Pricing not available</p>
                      )}
                    </div>
                  </CommandCard>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* Booking Modal */}
      <BookingServiceModal
        isOpen={isModalOpen}
        onClose={closeModal}
        service={selectedService}
      />
    </div>
  )
}




