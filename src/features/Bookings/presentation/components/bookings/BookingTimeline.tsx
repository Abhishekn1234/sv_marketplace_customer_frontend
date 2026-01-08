import { type Booking } from "../../../domain/entities/booking.types";

interface BookingTimelineProps {
  booking: Booking;
}

export const BookingTimeline = ({ booking }: BookingTimelineProps) => {
  const timelineSteps = [
    { status: 'Requested', date: booking.createdAt, active: true },
    { status: 'Confirmed', date: booking.updatedAt, active: booking.status !== 'REQUESTED' },
    { status: 'In Progress', date: null, active: false },
    { status: 'Completed', date: null, active: false }
  ];

  return (
    <div className="p-6 border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Timeline</h3>
      <div className="relative pl-8">
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-300"></div>
        {timelineSteps.map((step, index) => (
          <div key={index} className="relative mb-6 last:mb-0">
            <div className={`absolute -left-[26px] top-0 w-4 h-4 rounded-full border-2 ${
              step.active 
                ? 'bg-blue-600 border-blue-600' 
                : 'bg-white border-gray-300'
            }`}></div>
            <div className="flex justify-between items-start">
              <div>
                <p className={`font-medium ${
                  step.active ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.status}
                </p>
                {step.date && (
                  <p className="text-sm text-gray-500">
                    {new Date(step.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};