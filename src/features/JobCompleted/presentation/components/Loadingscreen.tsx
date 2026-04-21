import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
export function LoadingScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/"); // ⛔ redirect to home after delay
    }, 5000); // 5 seconds (adjust if needed)

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      
      {/* 🔵 Spinner */}
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />

      <p className="text-gray-500 text-sm">
        Loading completed job...
      </p>
    </div>
  );
}