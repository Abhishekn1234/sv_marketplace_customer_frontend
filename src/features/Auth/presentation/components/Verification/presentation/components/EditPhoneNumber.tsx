import { useState } from "react";
import { useAuthStore } from "@/features/core/store/auth";
import { toast } from "react-toastify";

interface Props {
  onNext: () => void; // callback to move to OTP step
}

export default function EditPhoneNumber({ onNext }: Props) {
  const { mobileForVerification, setMobileForVerification } = useAuthStore();
  const [phone, setPhone] = useState<string>(mobileForVerification || "");

  const handleSave = () => {
    if (!phone.match(/^\d{10,15}$/)) {
      toast.error("Enter a valid mobile number");
      return;
    }
    setMobileForVerification(phone);
    onNext(); // go to OTP step
  };

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">Edit Mobile Number</h1>
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Enter mobile number"
        className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 mb-4 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none"
      />
      <button
        onClick={handleSave}
        className="w-full h-14 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
      >
        Save Number
      </button>
    </div>
  );
}