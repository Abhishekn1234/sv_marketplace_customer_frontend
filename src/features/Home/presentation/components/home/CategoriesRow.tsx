
import { useServices } from "../../../../Bookings/presentation/hooks/useServices";

const circleColors = [
  "from-blue-500 to-purple-500",
  "from-red-500 to-pink-500",
  "from-green-500 to-teal-500",
  "from-yellow-400 to-orange-400",
  "from-indigo-500 to-blue-400",
  "from-pink-500 to-rose-400",
  "from-cyan-500 to-sky-400",
  "from-lime-500 to-green-400",
  "from-fuchsia-500 to-purple-400",
  "from-amber-500 to-orange-500",
];

export default function CategoriesRow() {
  const { categories: categoryData = [], loading, error } = useServices();

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-600">
        Loading...
      </p>
    );

  if (error)
    return (
      <p className="text-center mt-10 text-red-500">
        {error}
      </p>
    );

  // ✅ EMPTY STATE
  if (categoryData.length === 0)
    return (
      <p className="text-center mt-10 text-gray-500">
        No service categories found
      </p>
    );

  return (
    <div className="container mx-auto px-6 py-12">
      <h2 className="text-3xl font-semibold mb-12 text-center">
        Service Categories
      </h2>

      <div className="flex gap-6 py-4 px-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 snap-x snap-mandatory">
        {categoryData.map((category, idx) => {
          const colorClass = circleColors[idx % circleColors.length];

          return (
            <div
              key={category._id}
              className="flex-shrink-0 flex flex-col items-center w-24 snap-start cursor-pointer transition-transform duration-200 hover:scale-110"
            >
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center mb-2 bg-gradient-to-br ${colorClass} shadow-md transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg`}
              >
                {category.iconUrl ? (
                  <img
                    src={category.iconUrl}
                    alt={category.name}
                    className="w-10 h-10 object-cover rounded-full"
                  />
                ) : (
                  <span className="text-white text-xl font-bold">
                    {category.name.charAt(0)}
                  </span>
                )}
              </div>

              <p className="text-sm text-center text-gray-800 font-medium line-clamp-1">
                {category.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

