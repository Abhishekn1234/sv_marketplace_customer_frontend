"use client";

import { useState } from "react";
import { useAuthStore } from "@/features/core/store/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import LocationSearchInput from "./LocationSearchInput";
import LocationTypeSelector from "./LocationTypeSelector";
import ConfirmLocationFooter from "./ConfirmLocationFooter";
import { useAddLocation } from "../hooks/useAddLocation";

export default function LocationInputs() {
  const { customerData, updateUserLocation } = useAuthStore();
  const navigate = useNavigate();
  const { mutate: addLocation } = useAddLocation();

  const [selected, setSelected] =
    useState<"home" | "office" | null>(null);
  const [inputValue, setInputValue] = useState("");

  const homeLocation =
    customerData?.user?.current_location?.home ?? "";

  const officeLocation =
    customerData?.user?.current_location?.office ?? "";

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const handleSelect = (type: "home" | "office") => {
    setSelected(type);
    setInputValue(
      type === "home" ? homeLocation : officeLocation
    );
  };

  const handleContinue = () => {
    if (!homeLocation && !officeLocation && !inputValue) {
      toast.error("Please enter at least one location");
      return;
    }

    const locationPayload = {
      home:
        selected === "home" ? inputValue : homeLocation,
      office:
        selected === "office" ? inputValue : officeLocation,
    };

    addLocation(locationPayload, {
     onSuccess: () => {
  const updatedHome =
    selected === "home" ? inputValue : homeLocation;

  const updatedOffice =
    selected === "office" ? inputValue : officeLocation;

  const updatedAddresses = [
    {
      id: "home",
      type: "home",
      value: updatedHome,
    },
    {
      id: "office",
      type: "office",
      value: updatedOffice,
    },
    {
      id: "inputValue",
      type: "inputValue",
      value: inputValue,
    },
  ];

  updateUserLocation({ addresses: updatedAddresses });

  toast.success("Locations saved successfully!");
  navigate("/register");
},
      onError: (error: any) => {
        toast.error(
          "Failed to save location: " + error.message
        );
      },
    });
  };

  return (
    <div className="flex flex-col items-center w-full gap-6">
      <LocationSearchInput
        selected={selected}
        inputValue={inputValue}
        setInputValue={setInputValue}
        onChange={handleInputChange}
      />

      <LocationTypeSelector
        selected={selected}
        onSelect={handleSelect}
      />

      <ConfirmLocationFooter
        onConfirm={handleContinue}
      />
    </div>
  );
}