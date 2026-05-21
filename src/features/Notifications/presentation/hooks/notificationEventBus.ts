type Listener = (notification: any) => void;

const listeners: Listener[] = [];

export const notificationEventBus = {
  emit(notification: any) {
    listeners.forEach((l) => l(notification));
  },

  subscribe(listener: Listener) {
    listeners.push(listener);

    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    };
  },
};