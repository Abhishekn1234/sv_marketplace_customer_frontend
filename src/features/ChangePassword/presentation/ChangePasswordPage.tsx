import ChangePasswordCard from "./components/ChangePasswordCard";
import ChangePasswordHeader from "./components/ChangePasswordHeader";


export default function ChangePasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <ChangePasswordHeader />
      <ChangePasswordCard />
    </div>
  );
}
