import { useEffect, useState } from "react";
import { useAuthStore } from "@/features/core/store/auth";
import { Input, Radio, RadioGroup } from "@/components/input";
import Button from "@/components/input/Button";
import CommonModal from "@/components/common/CommonModal";
import { useLanguage } from "@/features/context/LanguageContext";
interface AddressModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddressModal({ open, onClose }: AddressModalProps) {
  const { current_location, updateHome } = useAuthStore();
  const{t}=useLanguage();
  const [selectedType, setSelectedType] = useState<"home" | "office">("home");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (!open) return;

    const addresses = current_location?.addresses ?? [];
    const existing =
      addresses.find((addr) => addr.type === selectedType)?.value || "";

    setAddress(existing);
  }, [open, selectedType, current_location]);

  const handleSave = () => {
    if (!address.trim()) return;
    updateHome(selectedType, address.trim());
    onClose();
  };

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title="Select Address Type"
      width="max-w-lg"
      footer={
        <div className="flex gap-4 w-full">
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
      }
    >
      {/* Address Type */}
      <div className="flex gap-4 mb-6">

        {["home", "office"].map((type) => (
                  <RadioGroup
          name="addressType"
          value={selectedType}
          onChange={(value) => setSelectedType(value as "home" | "office")}
          className="flex flex-row gap-4 mb-6"
          options={[
            {
              label: "Home",
              value: "home",
            },
            {
              label: "Office",
              value: "office",
            },
          ]}
        />
        ))}

      </div>

      {/* Address Input */}
     <Input
  type="text"
  value={address}
  onChange={(value) => setAddress(value)}
  placeholder={t.profilepage.enterAddress}
/>
    </CommonModal>
  );
}