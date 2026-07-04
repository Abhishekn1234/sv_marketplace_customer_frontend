import { useState } from "react";
import { useAuthStore } from "@/features/core/store/auth";
import { useLanguage } from "@/features/context/LanguageContext";
import { AddressInput,Radio, RadioGroup } from "@/components/input";
import Button from "@/components/input/Button";
import CommonCard from "@/components/common/CommonCards";

export default function SavedAddress() {
  const {
    current_location,
    addAddress,
    updateAddress,
    deleteAddress,
  } = useAuthStore();

  const addresses = current_location?.addresses ?? [];
  const { t } = useLanguage();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [selectedType, setSelectedType] = useState<"home" | "office">("home");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempAddress, setTempAddress] = useState("");

  const startEdit = (id: string, value: string) => {
    setEditingId(id);
    setTempAddress(value);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTempAddress("");
  };

  const getCurrentLatLng = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) return reject("No geolocation");

      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        reject
      );
    });
  };

  const saveEdit = async () => {
    if (!editingId || !tempAddress.trim()) return;

    try {
      const { lat, lng } = await getCurrentLatLng();
      updateAddress(editingId, tempAddress.trim(), lat, lng);
      cancelEdit();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = () => {
    if (!newAddress.trim()) return;
    addAddress(selectedType, newAddress.trim());
    setNewAddress("");
    setShowAddForm(false);
  };

  return (
    <CommonCard className="mt-6">

      {/* Title */}
      <h3 className="text-xl font-bold mb-6">
        {t.profilepage.savedAddresses}
      </h3>

      {/* Address List */}
      <div className="flex flex-col gap-4">

        {addresses.map((addr, i) => (
          <CommonCard key={addr.id} className="bg-gray-50">

            {/* Header */}
            <div className="flex justify-between items-center mb-3">

              <span className="font-semibold text-gray-800">
                {addr.type === "home" ? "Home" : "Office"} {i + 1}
              </span>

              {/* Actions */}
              <div className="flex gap-2">

                {editingId === addr.id ? (
                  <>
                    <Button
                      onClick={saveEdit}
                      size="sm"
                      className="bg-green-500 text-white"
                    >
                      {t.profilepage.save}
                    </Button>

                    <Button
                      onClick={cancelEdit}
                      size="sm"
                      className="bg-gray-300"
                    >
                      {t.profilepage.cancel}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => startEdit(addr.id, addr.value)}
                      size="sm"
                      variant="secondary"
                    >
                      {t.profilepage.edit}
                    </Button>

                    <Button
                      onClick={() => deleteAddress(addr.id)}
                      size="sm"
                      variant="danger"
                    >
                      {t.profilepage.delete}
                    </Button>
                  </>
                )}

              </div>
            </div>

            {/* Body */}
            {editingId === addr.id ? (
              <AddressInput
                value={tempAddress}
                onChange={setTempAddress}
                placeholder={t.profilepage.enterAddress}
              />
            ) : (
              <p className="text-sm text-gray-600">{addr.value}</p>
            )}

          </CommonCard>
        ))}

        {/* Add Address */}
        {showAddForm ? (
          <CommonCard className="space-y-4 bg-gray-50">

            <div className="flex gap-6">
                              <RadioGroup
                  name="addressType"
                  value={selectedType}
                  onChange={(value) =>
                    setSelectedType(value as "home" | "office")
                  }
                  options={[
                    {
                      label: t.profilepage.home,
                      value: "home",
                    },
                    {
                      label: t.profilepage.office,
                      value: "office",
                    },
                  ]}
                  className="flex flex-row gap-6"
                />
            </div>

            <AddressInput
              value={newAddress}
              onChange={setNewAddress}
              placeholder={t.profilepage.enterAddress}
            />

            <div className="flex gap-3">
              <Button onClick={handleAdd} variant="primary">
                {t.profilepage.addAddress}
              </Button>

              <Button
                onClick={() => setShowAddForm(false)}
                variant="secondary"
              >
                {t.profilepage.cancel}
              </Button>
            </div>

          </CommonCard>
        ) : (
          <Button
            onClick={() => setShowAddForm(true)}
            className="w-full py-4 border-2 border-dashed border-blue-600 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition"
          >
            + {t.profilepage.addAddress}
          </Button>
        )}

      </div>
    </CommonCard>
  );
}