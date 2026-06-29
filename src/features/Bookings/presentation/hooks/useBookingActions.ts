import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CancelRepository } from "../../data/repositories/CancelRepository";
import { CancelBookingUseCase } from "../../domain/usecases/booking/CancelBookingUseCase";
import type { CancelBookingRequest } from "../../domain/entities/cancelbookingrequest.types";
import { toast } from "react-toastify";
import { handleApiError } from "@/components/common/ApiError";

interface UseBookingActionsProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const useBookingActions = (
  { onSuccess }: UseBookingActionsProps = {}
) => {
  const queryClient = useQueryClient();

  const cancelRepo = new CancelRepository();
  const cancelUseCase = new CancelBookingUseCase(cancelRepo);

  const cancelBookingMutation = useMutation({
  mutationFn: async (data: {
    bookingId: string;
    cancelReason: string;
  }) => {
    const request: CancelBookingRequest = {
      bookingId: data.bookingId,
      cancelReason: data.cancelReason,
    };

    return await cancelUseCase.execute(request);
  },

  onSuccess: (_data, variables) => {
    const bookingId = variables.bookingId;

    toast.success("Booking cancelled successfully");

    queryClient.setQueryData(["bookings"], (oldData: any) => {
      if (!oldData) return oldData;

      if (Array.isArray(oldData)) {
        return oldData.filter((b) => b._id !== bookingId);
      }

      if (oldData.data) {
        return {
          ...oldData,
          data: oldData.data.filter((b: any) => b._id !== bookingId),
        };
      }

      return oldData;
    });

    onSuccess?.();
  },

  onError: (err: unknown) => {
    handleApiError(err);
  },
});

  return {
    cancelBooking: cancelBookingMutation.mutateAsync,
    isCancelling: cancelBookingMutation.isPending,
    error: cancelBookingMutation.error,
  };
};


