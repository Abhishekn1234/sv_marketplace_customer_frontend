// self.addEventListener("install", () => {
//   self.skipWaiting();
// });

// self.addEventListener("activate", () => {
//   self.clients.claim();
// });

// self.addEventListener("message", (event) => {
//   if (event.data?.type === "SHOW_NOTIFICATION") {
//     const { title, body } = event.data.payload;

//     self.registration.showNotification(title, {
//       body,
//       icon: "/vite.svg", 
//       badge: "/vite.svg",
//     });
//   }
// });
