import CommonSpinner from "@/components/common/CommonLoadingSpinner"
import { useServices } from "../../../../Bookings/presentation/hooks/useServices"
import { circleColors } from "../../helpers/circlecolors"
import CommonCard from "@/components/common/CommonCards"
import { Image } from "@/components/input"

export default function CategoriesRow() {
  const { categories: categoryData = [], loading, error } = useServices()

  if (loading) {
    return (
     <CommonSpinner size={20}/>
    )
  }

  if (error) {
    return (
      <p className="text-center mt-10 text-red-500">
        {error}
      </p>
    )
  }

  if (categoryData.length === 0) {
    return (
      <p className="text-center mt-10 text-gray-500">
        No service categories found
      </p>
    )
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h2 className="text-3xl font-semibold mb-12 text-center">
        Service Categories
      </h2>

      <div className="flex gap-6 py-4 px-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 snap-x snap-mandatory">
        {categoryData.map((category, idx) => {
          const colorClass = circleColors[idx % circleColors.length]
          const service = category.services?.[0]

          return (
            <CommonCard
                key={category._id}
                
                className="
                  flex-shrink-0 snap-start cursor-pointer
                  bg-transparent border-none shadow-none
                  hover:scale-105 transition-transform
                "
              >

              <div className="flex flex-col items-center gap-3">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center text-center px-2 bg-gradient-to-br ${colorClass} shadow-md`}
                >
                  {service?.iconUrl ? (
                    <Image
                      src={service.iconUrl}
                      alt={service.name}
                      className="w-10 h-10 object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-white text-xs font-semibold leading-tight line-clamp-2">
                      {service?.name}
                    </span>
                  )}
                </div>

                <p className="text-sm text-center font-medium line-clamp-1">
                  {service?.name}
                </p>
              </div>
            </CommonCard>
          )
        })}
      </div>
    </div>
  )
}
