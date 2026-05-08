import { Image } from "@/components/input";

import { initials } from "./initials";
import type { Worker } from "@/features/Bookings/domain/entities/worker.types";

export default function MiniAvatar({ worker }: { worker: Worker}) {
  return (
    <div className="flex h-[26px] min-w-[26px] items-center justify-center overflow-hidden rounded-full bg-blue-100 text-[10px] font-bold text-blue-800 shadow-sm">
      {worker.profilePictureUrl ? (
        <Image
          src={worker.profilePictureUrl}
          alt={worker.fullName}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        initials(worker.fullName)
      )}
    </div>
  );
}
