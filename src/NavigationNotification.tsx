"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NotificationNavigation() {
  const navigate = useNavigate();

  useEffect(() => {
    const channel = new BroadcastChannel("fcm_channel");

    const handler = (event: MessageEvent) => {
      const data = event.data;

      console.log("📡 Navigation event:", data);

      if (!data) return;
      if (data.type !== "NAVIGATE") return;
      if (!data.url) return;

      navigate(data.url, {
        state: data.payload,
      });
    };

    channel.addEventListener("message", handler);

    return () => {
      channel.removeEventListener("message", handler);
      channel.close();
    };
  }, [navigate]);

  return null;
}