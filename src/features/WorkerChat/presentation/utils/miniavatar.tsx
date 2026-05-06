import { Image } from "@/components/input";

import { initials } from "./initials";
import type { Worker } from "@/features/Bookings/domain/entities/worker.types";

export  default function MiniAvatar({ worker }: { worker: Worker}) {
  return (
    <div className="w-6.5 h-6.5 min-w-[26px] rounded-full bg-green-100 text-green-800 text-[10px] font-bold flex items-center justify-center overflow-hidden">
      {worker.profilePictureUrl ? (
        <Image
          src={worker.profilePictureUrl}
          alt={worker.fullName}
          className="w-full h-full object-cover rounded-full"
        />
      ) : (
        initials(worker.fullName)
      )}
    </div>
  );
}