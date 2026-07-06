import { Label, Textarea } from "@/components/input";
import Button from "@/components/input/Button";
import Select, { type SelectOption } from "@/components/input/Select";
import { useLanguage } from "@/features/context/LanguageContext";
import { useState } from "react";
import { toast } from "react-toastify";

export function CancelConfirmationDialog({
  onConfirm,
  onCancel,
}: {
  onConfirm: (type: string, reason: string) => void;
  onCancel: () => void;
}) {
  const { t } = useLanguage();

  const cancelTypes = [
    {
      value: "BOOKED_WRONG_SERVICE",
      label: t.jobtrackingpage.cancelBooking.types.BOOKED_WRONG_SERVICE,
    },
    {
      value: "BOOKED_BY_MISTAKE",
      label: t.jobtrackingpage.cancelBooking.types.BOOKED_BY_MISTAKE,
    },
    {
      value: "SCHEDULE_CHANGED",
      label: t.jobtrackingpage.cancelBooking.types.SCHEDULE_CHANGED,
    },
    {
      value: "PRICE_TOO_HIGH",
      label: t.jobtrackingpage.cancelBooking.types.PRICE_TOO_HIGH,
    },
    {
      value: "SERVICE_NO_LONGER_NEEDED",
      label: t.jobtrackingpage.cancelBooking.types.SERVICE_NO_LONGER_NEEDED,
    },
    {
      value: "OTHER",
      label: t.jobtrackingpage.cancelBooking.types.OTHER,
    },
  ];

  const options = cancelTypes.map(type => ({
    label: type.label,
    value: type.value,
}));

  const [selectedType, setSelectedType] = useState("");
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    if (!selectedType) {
      toast.error(t.jobtrackingpage.cancelBooking.selectPlaceholder);
      return;
    }

    if (selectedType === "OTHER" && !reason.trim()) {
      toast.error(t.jobtrackingpage.cancelBooking.placeholder);
      return;
    }

    onConfirm(selectedType, selectedType === "OTHER" ? reason.trim() : "");
  };

  return (
    <div className="w-full px-1">
      {/* Cancel Type */}
      <div className="mb-5">
        <Label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t.jobtrackingpage.cancelBooking.cancelType}
        </Label>

        <Select
          placeholder={t.jobtrackingpage.cancelBooking.selectPlaceholder}
          options={options}
          value={selectedType}
          onChange={(val) => {
            setSelectedType(val);

            // Clear reason whenever a non-OTHER option is selected
            if (val !== "OTHER") {
              setReason("");
            }
          }}
          className="h-[48px] w-full"
        />
      </div>

      {/* Reason */}
      <div className="mb-6">
        <Label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t.jobtrackingpage.cancelBooking.reason}
          {selectedType === "OTHER" && (
            <span className="ml-1 text-red-500">*</span>
          )}
        </Label>

        <Textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={
            selectedType === "OTHER"
              ? t.jobtrackingpage.cancelBooking.placeholder
              : "Not required"
          }
          rows={5}
          disabled={selectedType !== "OTHER"}
          className={`w-full ${
            selectedType !== "OTHER"
              ? "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
              : ""
          }`}
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-2">
        <Button
          onClick={onCancel}
          className="min-w-[110px] h-[46px] rounded-2xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          {t.jobtrackingpage.cancelBooking.cancel}
        </Button>

        <Button
          onClick={handleConfirm}
          className="min-w-[150px] h-[46px] rounded-2xl bg-red-600 text-white hover:bg-red-700"
        >
          {t.jobtrackingpage.cancelBooking.confirm}
        </Button>
      </div>
    </div>
  );
}