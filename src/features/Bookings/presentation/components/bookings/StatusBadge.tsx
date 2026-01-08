import { AlertCircle, CheckCircle } from "lucide-react";

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusConfig = {
    REQUESTED: {
      label: "Pending Approval",
      color: "bg-amber-50 text-amber-700 border-amber-200",
      icon: <AlertCircle className="w-4 h-4" />
    },
    ACTIVE: {
      label: "Active",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: <CheckCircle className="w-4 h-4" />
    },
    CONFIRMED: {
      label: "Confirmed",
      color: "bg-blue-50 text-blue-700 border-blue-200",
      icon: <CheckCircle className="w-4 h-4" />
    },
    COMPLETED: {
      label: "Completed",
      color: "bg-gray-100 text-gray-700 border-gray-300",
      icon: <CheckCircle className="w-4 h-4" />
    },
    CANCELLED: {
      label: "Cancelled",
      color: "bg-red-50 text-red-700 border-red-200",
      icon: <AlertCircle className="w-4 h-4" />
    }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || {
    label: status,
    color: "bg-gray-100 text-gray-700 border-gray-300",
    icon: <AlertCircle className="w-4 h-4" />
  };

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${config.color}`}>
      {config.icon}
      <span className="font-semibold text-sm">{config.label}</span>
    </div>
  );
};