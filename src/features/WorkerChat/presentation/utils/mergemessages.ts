import type { Message } from "../../domain/entities/messages";

export const mergeMessages = (
  prev: Message[],
  incoming: Message[]
) => {
  const merged = [...prev];

  incoming.forEach((newMessage) => {
    const newId = String(
      newMessage._id || newMessage.id || ""
    );

    const existsIndex = merged.findIndex(
      (oldMessage) => {
        const oldId = String(
          oldMessage._id ||
            oldMessage.id ||
            ""
        );

        // SAME REAL ID
        if (
          newId &&
          oldId &&
          newId === oldId
        ) {
          return true;
        }

        // SAME MESSAGE CONTENT
        return (
          oldMessage.senderId ===
            newMessage.senderId &&
          oldMessage.text.trim() ===
            newMessage.text.trim() &&
          Math.abs(
            new Date(
              oldMessage.timestamp || 0
            ).getTime() -
              new Date(
                newMessage.timestamp || 0
              ).getTime()
          ) < 15000
        );
      }
    );

    // MESSAGE EXISTS
    if (existsIndex !== -1) {
      merged[existsIndex] = {
        ...merged[existsIndex],
        ...newMessage,

        // IMPORTANT
        status:
          newMessage.status ||
          "delivered",
      };
    } else {
      merged.push(newMessage);
    }
  });

  return merged.sort(
    (a, b) =>
      new Date(
        a.timestamp || 0
      ).getTime() -
      new Date(
        b.timestamp || 0
      ).getTime()
  );
};