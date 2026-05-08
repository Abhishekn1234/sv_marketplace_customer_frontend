
import type { Worker } from "@/features/Bookings/domain/entities/worker.types";
import MiniAvatar from "./miniavatar";

export function TypingIndicator({ worker }: { worker: Worker }) {
  return (
    <div className="flex items-end gap-2 mb-2">
      <MiniAvatar worker={worker} />

      <div className="rounded-2xl rounded-bl-md border border-gray-200 bg-white px-3 py-2 shadow-sm">
        <div className="flex gap-1 items-center h-3">
          {[0, 150, 300].map((d) => (
            <span
              key={d}
              className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
              style={{ animationDelay: `${d}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
