import { Image } from "@/components/input";
import { initials } from "./initials";
import type { Worker } from "@/features/Bookings/domain/entities/worker.types";

export function Avatar({ worker }: { worker: Worker}) {
  return (
    <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center overflow-hidden flex-shrink-0">
      {worker.profilePictureUrl ? (
        <Image
          src={worker.profilePictureUrl}
          alt={worker.fullName}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-green-800 text-sm font-bold">
          {initials(worker.fullName)}
        </span>
      )}
    </div>
  );
}