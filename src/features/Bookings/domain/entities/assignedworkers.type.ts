import type { Worker } from "./worker.types";

export interface AssignedWorker {
  _id: string;
  workerId: string;
  bookingId: string;

  status: string;

  assignedAt: string;
  startedAt?: string;
  completedAt?: string;

  worker: Worker;
}