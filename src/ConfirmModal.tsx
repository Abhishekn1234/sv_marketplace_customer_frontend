import { useState, useEffect } from "react";
import { useAuthStore } from "./features/core/store/auth";
import Button from "./components/input/Button";
import CommonModal from "./components/common/CommonModal";

export default function ConfirmModal() {
  const { accessToken } = useAuthStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (accessToken) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [accessToken]);

  return (
    <CommonModal
      open={open}
      onClose={() => setOpen(false)}
      title="Confirm Action"
      width="max-w-md"
      footer={
        <div className="flex justify-end gap-3 w-full">
          
          <Button
            onClick={() => setOpen(false)}
            className="rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </Button>

          <Button
            className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
            onClick={() => setOpen(false)}
          >
            Confirm
          </Button>
        </div>
      }
    >
      <p className="text-sm text-gray-600">
        Are you sure you want to continue? This action cannot be undone.
      </p>
    </CommonModal>
  );
}