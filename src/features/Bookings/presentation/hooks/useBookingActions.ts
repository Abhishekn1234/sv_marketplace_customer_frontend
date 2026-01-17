import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CancelRepository } from "../../data/repositories/CancelRepository";
import { CancelBookingUseCase } from "../../domain/usecases/booking/CancelBookingUseCase";
import type { CancelBookingRequest } from "../../domain/entities/booking.types";
import { toast } from "react-toastify";

interface UseBookingActionsProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const useBookingActions = (
  { onSuccess, onError }: UseBookingActionsProps = {}
) => {
  const queryClient = useQueryClient();

  // Init repo + usecase
  const cancelRepo = new CancelRepository();
  const cancelUseCase = new CancelBookingUseCase(cancelRepo);

  // -----------------------------
  // Cancel Booking Mutation
  // -----------------------------
  const cancelBookingMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      const request: CancelBookingRequest = { bookingId };
      return await cancelUseCase.execute(request);
    },
   onSuccess: (_data, bookingId) => {
  toast.success("Booking cancelled successfully");

  queryClient.setQueryData(["bookings"], (oldData: any) => {
    if (!oldData) return oldData;

    // If your bookings query returns an array
    if (Array.isArray(oldData)) {
      return oldData.filter((b) => b._id !== bookingId);
    }

    // If your bookings query returns { data: Booking[] }
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
      const message =
        err instanceof Error ? err.message : "Failed to cancel booking";
      onError?.(message);
    },
  });

  return {
    cancelBooking: cancelBookingMutation.mutateAsync,
    isCancelling: cancelBookingMutation.isPending,
    error: cancelBookingMutation.error,
  };
};

