import { Outlet } from "react-router-dom";
import clsx from "clsx";
import { useTheme } from "../context/themeContext";
import DashboardHeader from "./DashboardHeader";
import ConfirmModal from "../../ConfirmModal";


interface Props { onLogout: () => void; }
export default function DashboardLayout({onLogout }: Props) {
  const { theme } = useTheme();


  return (
    <div
      className={clsx(
        "min-h-screen transition-colors duration-300",
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-50 text-gray-900"
      )}
    >
      {/* Header */}
     <DashboardHeader onLogout={onLogout} />

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
      <ConfirmModal/>
      
    </div>
  );
}

