export type Message = {
  id: number;
  text: string;
  sender: "customer" | "worker";
  timestamp: Date;
  status?: "sent" | "delivered" | "read";
};



