export const getMessageKey = (msg: any) => {
  const id = msg?._id ?? msg?.id;
  const senderId = msg?.senderId ?? msg?.sender ?? msg?.userId;

  // Prefer server ids when available.
  if (id && !String(id).startsWith("temp-")) {
    return `server-${id}`;
  }

  // Keep temp ids stable for client-side optimistic messages.
  if (id && String(id).startsWith("temp-")) {
    return `temp-${id}`;
  }

  // Fallback key: include text + timestamp + sender.
  return `fallback-${senderId}-${msg?.timestamp ?? ""}-${msg?.text ?? ""}`;
};
