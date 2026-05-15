export type Message = {
  _id: string; // normalized id (ONLY ONE SOURCE OF TRUTH)

  senderId?: string;
  workerId?: string;
  bookingId?: string;
  clientId?:string;
  text: string;

  senderType?: "CUSTOMER" | "WORKER";
  sender?: "customer" | "worker";

  createdAt?: string;
  timestamp?: string;
  updatedAt?: string;
   self?:boolean;
  status?: "sent" | "delivered" | "read";
};
export type PaginatedMessages = {
  data: Message[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
