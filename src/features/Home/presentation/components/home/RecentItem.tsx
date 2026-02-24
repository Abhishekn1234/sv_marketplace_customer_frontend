import { useNavigate } from "react-router-dom";

interface RecentItemProps {
  categoryId?: string;
  serviceId?: string;
  title: string;
  date: string;
  price: string;
  iconUrl?: string;
}

export const RecentItem: React.FC<RecentItemProps> = ({
  categoryId,
  serviceId,
  title,
  date,
  price,
  iconUrl,
}) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (!categoryId || !serviceId) return;

 
    navigate(`/services/${categoryId}`);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleNavigate}
      className="
        flex items-center gap-3.5
        p-2 -m-2 rounded-xl
        cursor-pointer
        transition-all duration-200
        hover:bg-gray-50 hover:translate-x-1
        group
      "
    >
      {/* Icon */}
      <div className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
        {iconUrl ? (
          <img
            src={iconUrl}
            alt={title}
            className="w-6 h-6 object-contain"
          />
        ) : (
          <div className="w-6 h-6 bg-gray-300 rounded" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="text-[15px] font-semibold text-gray-900 truncate">
          {title}
        </div>
        <div className="text-[13px] text-gray-400">
          {date}
        </div>
      </div>

      {/* Price */}
      <div className="text-right flex-shrink-0">
        <div className="text-[15px] font-semibold text-gray-900">
          {price}
        </div>
        <div className="text-[13px] font-semibold text-amber-600 group-hover:text-amber-700 transition-all">
          Rebook →
        </div>
      </div>
    </div>
  );
};