import { useEffect, useState } from "react";
import { useAuthStore } from "@/features/core/store/auth";
import { Input, Radio } from "@/components/input";
import Button from "@/components/input/Button";

interface AddressModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddressModal({ open, onClose }: AddressModalProps) {
  const { current_location, updateHome } = useAuthStore();

  const [selectedType, setSelectedType] = useState<"home" | "office">("home");
  const [address, setAddress] = useState("");

  // Load existing address when modal opens or type changes
  useEffect(() => {
    if (!open) return;

    const addresses = current_location?.addresses ?? [];
    const existing = addresses.find((addr) => addr.type === selectedType)?.value || "";
    setAddress(existing);
  }, [open, selectedType, current_location]);

  const handleSave = () => {
    if (!address.trim()) return;
    updateHome(selectedType, address.trim());
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8">
        <h2 className="text-xl font-bold mb-6 text-gray-900">Select Address Type</h2>

        <div className="flex gap-4 mb-6">
          {["home", "office"].map((type) => (
            <Radio
              key={type}
              label={type}
              containerClassName={`flex-1 flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                selectedType === type ? "border-blue-600 bg-blue-50" : "border-gray-200"
              }`}
              checked={selectedType === type}
              onChange={() => setSelectedType(type as "home" | "office")}
            />
          ))}
        </div>

        <div className="relative">
          <Input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter address..."
          />
        </div>

        <div className="flex gap-4 pt-6">
          <Button
            onClick={handleSave}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-medium"
          >
            Save
          </Button>

          <Button
            onClick={onClose}
            className="flex-1 bg-gray-100 py-3 rounded-xl hover:bg-gray-200 transition font-medium"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}