import { useMutation } from "@tanstack/react-query";
import { AddDisputesRepoImpl } from "../../data/repositories/AddDisputesRepoImpl";
import { CreateDisputeUsecase } from "../../domain/usecase/CreateDisputeUsecase";
import type { DisputeInput } from "../../domain/entities/disputeinput";
import { getSocket } from "@/features/core/Websocket/socket";
import { BookingEvents } from "@/components/common/BookingEvents";


export function useCreateDispute() {
  const repo = new AddDisputesRepoImpl();
  const usecase = new CreateDisputeUsecase(repo);

  return useMutation({
    mutationKey: ["create-dispute"],

    mutationFn: (input: DisputeInput) => usecase.execute(input),

    onSuccess: (_, variables) => {
      const socket = getSocket();

      if (socket?.connected) {
        socket.emit(BookingEvents.DISPUTE_CREATED, {
          bookingId: variables.bookingId,
        });
      }
    },
  });
}