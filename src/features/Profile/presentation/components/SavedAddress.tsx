import { useState } from "react";
import { useAuthStore } from "@/features/core/store/auth";
import { useLanguage } from "@/features/context/LanguageContext";
import { AddressInput,Radio } from "@/components/input";
import Button from "@/components/input/Button";

export default function SavedAddress() {
  const { current_location, addAddress, updateAddress, deleteAddress } = useAuthStore();
  const addresses = current_location?.addresses ?? [];
 const {t}=useLanguage();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [selectedType, setSelectedType] = useState<"home" | "office">("home");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempAddress, setTempAddress] = useState("");

  const homeAddresses = addresses.filter((a) => a.type === "home");
  const officeAddresses = addresses.filter((a) => a.type === "office");

  // Start editing an address
  const startEdit = (id: string, currentValue: string) => {
    setEditingId(id);
    setTempAddress(currentValue);
  };
  const getCurrentLatLng = (): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => reject(err)
    );
  });
};

  // Save edited address
 const saveEdit = async () => {
  if (!editingId || !tempAddress.trim()) return;

  try {
    const { lat, lng } = await getCurrentLatLng();

    updateAddress(editingId, tempAddress.trim(), lat, lng);

    setEditingId(null);
    setTempAddress("");
  } catch (error) {
    console.error("Failed to get location", error);
  }
};

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setTempAddress("");
  };

  // Delete address
  const handleDelete = (id: string) => {
    deleteAddress(id);
  };

  // Add new address
  const handleAdd = () => {
    if (!newAddress.trim()) return;
    addAddress(selectedType, newAddress.trim());
    setNewAddress("");
    setShowAddForm(false);
  };

  // Render single address card
  const renderCard = (addr: any, index: number) => (
    <div key={addr.id} className="p-5 bg-gray-50 rounded-xl border">
      <div className="flex justify-between items-center mb-3">
        <span className="font-semibold text-gray-800">
          {addr.type === "home" ? "Home" : "Office"} {index + 1}
        </span>

        <div className="flex gap-2">
          {editingId === addr.id ? (
            <>
              <Button
                onClick={saveEdit}
                className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs"
              >
                {t.profilepage.save}
              </Button>
              <Button
                onClick={cancelEdit}
                className="px-3 py-1 bg-gray-300 rounded-lg text-xs"
              >
                {t.profilepage.cancel}
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => startEdit(addr.id, addr.value)}
                className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition text-xs"
              >
                {t.profilepage.edit}
              </Button>
              <Button
                onClick={() => handleDelete(addr.id)}
                className="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition text-xs"
              >
                {t.profilepage.delete}
              </Button>
            </>
          )}
        </div>
      </div>

      {editingId === addr.id ? (
        <AddressInput
          value={tempAddress}
          onChange={setTempAddress}
          placeholder={`Enter ${addr.type} address`}
        />
      ) : (
        <p className="text-sm text-gray-600">{addr.value}</p>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border mt-6">
      <h3 className="text-xl font-bold mb-6">{t.profilepage.savedAddresses}</h3>

      <div className="flex flex-col gap-4">
        {homeAddresses.map((addr, i) => renderCard(addr, i))}
        {officeAddresses.map((addr, i) => renderCard(addr, i))}

        {showAddForm ? (
          <div className="p-5 bg-gray-50 border rounded-2xl space-y-4">
            <div className="flex gap-6">
              <Radio
                label={t.profilepage.home}
                checked={selectedType === "home"}
                onChange={() => setSelectedType("home")}
              />
              <Radio
                label={t.profilepage.office}
                checked={selectedType === "office"}
                onChange={() => setSelectedType("office")}
              />
            </div>

            <AddressInput
              value={newAddress}
              onChange={setNewAddress}
              placeholder="Enter address"
            />

            <div className="flex gap-3">
              <Button
                onClick={handleAdd}
                className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
              >
                {t.profilepage.addAddress}
              </Button>
              <Button
                onClick={() => {
                  setShowAddForm(false);
                  setNewAddress("");
                }}
                className="px-5 py-2 bg-gray-200 rounded-xl text-sm"
              >
                {t.profilepage.cancel}
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => setShowAddForm(true)}
            className="w-full py-4 bg-blue-50 border-2 border-dashed border-blue-600 rounded-2xl text-blue-600 font-semibold hover:bg-blue-600 hover:text-white transition"
          >
            + {t.profilepage.addAddress}
          </Button>
        )}
      </div>
    </div>
  );
}