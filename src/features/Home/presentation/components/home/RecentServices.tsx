import React from "react";
import { useBookings } from "@/features/Bookings/presentation/hooks/useBookings";
import type { Booking } from "@/features/Bookings/domain/entities/booking.types";
import { RecentItem } from "./RecentItem";
import { useServiceCategory } from "@/features/Bookings/presentation/hooks/useServiceCategory";
import { getBookingPrice } from "../../helpers/getbookprice";
import { formatDate } from "../../helpers/formatdate";

const RecentServices: React.FC = () => {
  const { bookings = [] } = useBookings();
  const { data: categories = [] } = useServiceCategory();

  
  const serviceToCategoryMap = React.useMemo(() => {
    const map = new Map<string, string>();

    categories.forEach((category: any) => {
      category.services?.forEach((service: any) => {
        map.set(service._id, category._id);
      });
    });

    return map;
  }, [categories]);

  
  const sortedBookings = bookings
    .slice()
    .sort(
      (a: Booking, b: Booking) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );

  const recentBookings = sortedBookings.slice(0, 3);

  return (
    <aside className="flex flex-col gap-5 top-6">
      <div className="bg-white rounded-[20px] p-6 border border-gray-200 transition-all duration-300 hover:shadow-lg">
        
    
        <div className="flex items-center justify-between mb-5">
          <span className="text-[18px] font-bold text-gray-900">
            Recent
          </span>
        </div>

     
        <div className="flex flex-col gap-4">
          {recentBookings.length === 0 && (
            <p className="text-sm text-gray-400">
              No recent bookings available
            </p>
          )}

          {recentBookings.map((booking) => {
            const serviceId = booking.serviceId?._id;
            const categoryId = serviceToCategoryMap.get(serviceId || "");

            return (
              <RecentItem
                key={booking._id}
                categoryId={categoryId}
                serviceId={serviceId}
                title={booking.serviceId?.name || "Service"}
                date={
                  booking.bookingType === "SCHEDULED"
                    ? formatDate(booking.schedule?.startDateTime)
                    : formatDate(booking.createdAt)
                }
                price={`${booking.currency} ${getBookingPrice(booking)}`}
                iconUrl={booking.serviceId?.iconUrl}
              />
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default RecentServices;
