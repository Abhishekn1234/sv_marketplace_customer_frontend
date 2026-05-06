"use client";

import { Image } from "@/components/input";
import Button from "@/components/input/Button";
import { Phone, MoreVertical } from "lucide-react";

export default function WorkerChatPageHeader({
  worker,
}: {
  worker: {
    name: string;
    status?: string;
    avatar?: string;
  };
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-white border-b shadow-sm">

      {/* LEFT - WORKER INFO */}
      <div className="flex items-center gap-3">

        {/* AVATAR WITH ONLINE DOT */}
        <div className="relative w-10 h-10">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
            {worker.avatar ? (
              <Image
                src={worker.avatar}
                alt={worker.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-gray-500">
                {worker.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* ONLINE STATUS DOT */}
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
        </div>

        {/* NAME + STATUS */}
        <div>
          <p className="font-semibold text-gray-900">{worker.name}</p>
          <p className="text-sm text-gray-500">
            {worker.status || "Online"}
          </p>
        </div>
      </div>

      {/* RIGHT - ACTIONS */}
      <div className="flex items-center gap-3">

        <Button className="p-2 rounded-full hover:bg-gray-100 transition">
          <Phone className="w-5 h-5 text-gray-600" />
        </Button>

        <Button className="p-2 rounded-full hover:bg-gray-100 transition">
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </Button>

      </div>
    </div>
  );
}