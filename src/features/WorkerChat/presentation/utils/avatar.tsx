import { Image } from "@/components/input";
import { initials } from "./initials";
import type { Worker } from "@/features/Bookings/domain/entities/worker.types";

export function Avatar({ worker }: { worker: Worker}) {
  return (
    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-white bg-blue-100 shadow-sm">
      {worker.profilePictureUrl ? (
        <Image
          src={worker.profilePictureUrl}
          alt={worker.fullName}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="text-sm font-bold text-blue-800">
          {initials(worker.fullName)}
        </span>
      )}
    </div>
  );
}
