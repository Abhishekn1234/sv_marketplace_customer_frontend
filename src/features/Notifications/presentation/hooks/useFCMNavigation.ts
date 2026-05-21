import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMessaging, onMessage } from "firebase/messaging";
import { app } from "@/components/firebase/firebase";
import type { Notification } from "../../domain/entities/notifications";


export function useFCMNavigation() {
  const navigate = useNavigate();

  useEffect(() => {
    const messaging = getMessaging(app);

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Foreground message:", payload);

      // 🔥 Build your Notification object properly
      const notification: Notification = {
        _id: payload.data?._id || crypto.randomUUID(),

        recipientType: (payload.data?.recipientType as any) || "ADMIN",
        recipientId: payload.data?.recipientId || "",

        type: (payload.data?.type as any) || "ADMIN_MESSAGE",

        title: payload.notification?.title || "Notification",
        message: payload.notification?.body || "",

        bookingId: payload.data?.bookingId,

        data: {
          bookingCode: payload.data?.bookingCode,
          status: payload.data?.status,
          workerId: payload.data?.workerId,
          actualWorkHours: payload.data?.actualWorkHours
            ? Number(payload.data.actualWorkHours)
            : undefined,
          actualWorkDays: payload.data?.actualWorkDays
            ? Number(payload.data.actualWorkDays)
            : undefined,
          invoiceId: payload.data?.invoiceId,
          cancelReasonType: payload.data?.cancelReasonType,
        },

        isRead: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // ✅ Chrome system notification
      const notif = new Notification(notification.title, {
        body: notification.message,
        icon: "/logo.png",
      });

      // ✅ Click → navigate + optionally pass data
      notif.onclick = () => {
        window.focus();
        navigate("/notifications", {
          state: { notification },
        });
      };
    });

    return () => unsubscribe();
  }, [navigate]);
}