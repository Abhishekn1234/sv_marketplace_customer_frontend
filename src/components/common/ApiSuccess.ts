import { toast } from "react-toastify";

type ApiResponse = {
  data?: {
    message?: string;
  };
};

export const handleSuccess = (
  res: ApiResponse,
  fallback = "Success ✅"
) => {
  toast.success(res?.data?.message || fallback);
};