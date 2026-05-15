export type Message = {
  
  _id?:string;
   id?: string;

  senderId?: string;
  self?: boolean;
  bookingId?:string;
  text: string;
  senderType?:"CUSTOMER"|"WORKER"
  sender?: "customer" | "worker";
  workerId?:string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  timestamp: Date | string;
  status?: "sent" | "delivered" | "read";
};



