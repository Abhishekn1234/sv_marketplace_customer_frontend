export type ChatMessage = {
  _id: string;
  id?:string;
  clientId?:string;
  status:"read"|"delivered"|"sent";
  bookingId: string;
  senderId: string;
  message: string;
  createdAt: string;
  updatedAt?: string;
};

export type GetChatMessagesResponse = {
  data: ChatMessage[];
  total: number;
  page: number;
  limit: number;
};

export type SendChatMessagePayload = {
  bookingId: string;
  message: string;
  clientId?: string;
};

export type GetChatMessagesPayload = {
  bookingId: string;
  page?: number;
  limit?: number;
};