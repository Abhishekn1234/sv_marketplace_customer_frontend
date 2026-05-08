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
  timestamp: Date | string;
  status?: "sent" | "delivered" | "read";
};



