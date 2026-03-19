
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, Calendar, Home } from "lucide-react";
import SummaryItem from "./SummaryItem";
import NextStep from "./Nextstep";
import { formatSmartDate } from "../helpers/formatdatetime";

export default function ConfirmationCard({ data, placeName }: any) {
  const navigate = useNavigate();

  const tierName =
    data?.serviceTier?.displayName ||
    data?.serviceTierId?.displayName ||
    "N/A";

  const duration =
    data?.pricingMode === "HOURLY"
      ? `${data?.schedule?.estimatedHours ?? 0} Hours`
      : data?.pricingMode === "PER_DAY"
      ? `${data?.schedule?.estimatedDays ?? 0} Days`
      : "N/A";

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      {/* Summary */}
      <div className="grid sm:grid-cols-2 gap-5 mb-6">
        <SummaryItem label="Service" value={data?.serviceId?.name} />
        <SummaryItem label="Tier" value={tierName} />
        <SummaryItem
          label="Time & Date"
          value={formatSmartDate(data?.schedule?.startDateTime)}
        />
        <SummaryItem label="Location" value={placeName} />
        <SummaryItem label="Duration" value={duration} />
        <SummaryItem
          label="Total Paid"
          value={<span className="text-blue-600">{data.currency} {data.amount}</span>}
        />
      </div>

      {/* CTA */}
      <button
        onClick={() => navigate(`/jobtracking/${data._id}`)}
        className="w-full h-12 bg-blue-600 text-white rounded-full mb-6 flex justify-center items-center gap-2"
      >
        Track Job <ArrowRight className="w-5" />
      </button>

      {/* Links */}
       <div className="flex justify-center gap-8 mb-10 text-sm font-bold uppercase">

          <Link to="/" className="text-gray-900 hover:text-blue-600">
            <span className="flex gap-2">
              <Home className="w-5" />
              Return Home
            </span>
          </Link>

          <Link to="/bookings" className="text-gray-900 hover:text-blue-600">
            <span className="flex gap-2">
              <Calendar className="w-5" />
              View All Bookings
            </span>
          </Link>

        </div>

      {/* Next Steps */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-left">
      
                <h3 className="text-xs font-bold uppercase text-gray-400 mb-5">
                  What's Next?
                </h3>
      
                <div className="flex flex-col gap-4">
      
                  <NextStep
                    number="1"
                    title="Provider Assignment"
                    description="We'll match you with a top-rated professional"
                  />
      
                  <NextStep
                    number="2"
                    title="Confirmation Call"
                    description="Your provider will contact you"
                  />
      
                  <NextStep
                    number="3"
                    title="Service Delivery"
                    description="Enjoy professional service at your scheduled time"
                  />
      
                </div>
              </div>
    </div>
  );
}