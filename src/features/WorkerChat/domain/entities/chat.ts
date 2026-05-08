export type ChatMessage = {
  _id: string;
  bookingId: string;
  senderId: string;
  message: string;
  createdAt: string;
  updatedAt?: string;
};

export type GetChatMessagesResponse = {
  messages: ChatMessage[];
  total: number;
  page: number;
  limit: number;
};

export type SendChatMessagePayload = {
  bookingId: string;
  message: string;
};

export type GetChatMessagesPayload = {
  bookingId: string;
  page?: number;
  limit?: number;
};