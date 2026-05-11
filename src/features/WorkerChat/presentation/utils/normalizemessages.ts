import type { Message } from "../../domain/entities/messages";
import { getId } from "./getId";

export const normalizeMessage = (
  msg: any,
  myUserId?: string
): Message => ({
  ...msg,

  _id:
    msg._id ||
    msg.id ||
    `temp-${Date.now()}-${Math.random()}`,

  senderId: getId(
    msg.senderId ||
      msg.sender ||
      msg.userId
  ),

  text:
    msg.text ||
    msg.message ||
    msg.body ||
    "",

  timestamp:
    msg.timestamp ||
    msg.createdAt ||
    new Date().toISOString(),

  self:
    getId(
      msg.senderId ||
        msg.sender ||
        msg.userId
    ) === myUserId,

  status: msg.status || "sent",
});
