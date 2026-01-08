import { type ReactNode } from "react";

interface InfoCardProps {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  className?: string;
}

export const InfoCard = ({ icon, label, value, className = "" }: InfoCardProps) => (
  <div className={` rounded-xl p-4 ${className}`}>
    <div className="flex items-center gap-3">
      <div className="p-2  rounded-lg shadow-sm">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium mb-1">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  </div>
);