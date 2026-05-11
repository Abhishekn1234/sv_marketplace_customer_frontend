export const unpackMessages = (payload: any): any[] => {
  if (!payload) return [];

  if (Array.isArray(payload)) return payload;

  if (Array.isArray(payload.messages)) {
    return payload.messages;
  }

  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  if (Array.isArray(payload.data?.messages)) {
    return payload.data.messages;
  }

  return [payload];
};