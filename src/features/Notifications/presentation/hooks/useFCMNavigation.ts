// useFCMNavigation.ts

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  getMessaging,
  onMessage,
} from "firebase/messaging";

import { app } from "@/components/firebase/firebase";

import type {
  Notification as AppNotification,
} from "../../domain/entities/notifications";

import { useAuthStore } from "@/features/core/store/auth";

export function useFCMNavigation() {
  const navigate = useNavigate();

  useEffect(() => {
    // ---------------------------------------
    // CHECK SUPPORT
    // ---------------------------------------
    if (
      !("Notification" in window) ||
      !("serviceWorker" in navigator)
    ) {
      console.error(
        "Notifications not supported"
      );

      return;
    }

    const messaging = getMessaging(app);

    // ---------------------------------------
    // FOREGROUND LISTENER
    // ---------------------------------------
    const unsubscribe = onMessage(
      messaging,
      async (payload) => {
        console.log(
          "Foreground message:",
          payload
        );

        console.log(
          "Notification permission:",
          Notification.permission
        );

        // ---------------------------------------
        // BUILD NOTIFICATION OBJECT
        // ---------------------------------------
        const notification: AppNotification =
          {
            _id:
              payload.data?._id ||
              crypto.randomUUID(),

            recipientType:
              (payload.data
                ?.recipientType as any) ||
              "ADMIN",

            recipientId:
              payload.data?.recipientId ||
              "",

            type:
              (payload.data?.type as any) ||
              "ADMIN_MESSAGE",

            title:
              payload.notification
                ?.title ||
              payload.data?.title ||
              "Notification",

            message:
              payload.notification
                ?.body ||
              payload.data?.message ||
              "",

            bookingId:
              payload.data?.bookingId,

            data: {
              bookingCode:
                payload.data
                  ?.bookingCode,

              status:
                payload.data?.status,

              workerId:
                payload.data?.workerId,

              actualWorkHours:
                payload.data
                  ?.actualWorkHours
                  ? Number(
                      payload.data
                        .actualWorkHours
                    )
                  : undefined,

              actualWorkDays:
                payload.data
                  ?.actualWorkDays
                  ? Number(
                      payload.data
                        .actualWorkDays
                    )
                  : undefined,

              invoiceId:
                payload.data?.invoiceId,

              cancelReasonType:
                payload.data
                  ?.cancelReasonType,
            },

            isRead: false,

            createdAt:
              new Date().toISOString(),

            updatedAt:
              new Date().toISOString(),
          };

        // ---------------------------------------
        // UPDATE ZUSTAND
        // ---------------------------------------
        useAuthStore
          .getState()
          .pushNotification(
            notification
          );

        // ---------------------------------------
        // SHOW WEB NOTIFICATION
        // ONLY IF TAB NOT FOCUSED
        // ---------------------------------------
        if (
          Notification.permission ===
            "granted" &&
          !document.hasFocus()
        ) {
          try {
            const registration =
              await navigator
                .serviceWorker.ready;

            await registration.showNotification(
              notification.title,
              {
                body:
                  notification.message,

                icon: "/logo.png",

                badge: "/logo.png",

                tag:
                  notification._id,

                renotify: true,

                requireInteraction:
                  false,

                data: {
                  url: "/notifications",

                  notification,
                },
              } as NotificationOptions
            );

            console.log(
              "Browser notification shown"
            );
          } catch (error) {
            console.error(
              "showNotification error:",
              error
            );
          }
        }

        // ---------------------------------------
        // OPTIONAL:
        // AUTO NAVIGATE IF TAB ACTIVE
        // ---------------------------------------
        if (document.hasFocus()) {
          console.log(
            "Tab focused — no system notification"
          );

          // OPTIONAL AUTO NAVIGATION
          // navigate("/notifications");
        }
      }
    );

    // ---------------------------------------
    // CLEANUP
    // ---------------------------------------
    return () => {
      unsubscribe();
    };
  }, [navigate]);
}