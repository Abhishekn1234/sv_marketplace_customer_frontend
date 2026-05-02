export const playNotificationSound = () => {
  try {
    const audio = new Audio("/notification.mp3");
    audio.volume = 0.8;
    audio.play().catch((err) => {
      console.warn("🔇 Sound blocked by browser:", err);
    });
  } catch (err) {
    console.error("Sound error:", err);
  }
};