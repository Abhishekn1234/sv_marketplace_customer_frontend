// "use client";

// import { useState } from "react";
// import { initializeSocket, getSocket } from "./socket";
// import { useAuthStore } from "../store/auth";

// export default function SocketModal() {
//   const [status, setStatus] = useState("Not Connected");
//   const [socketId, setSocketId] = useState<string | null>(null);
//   const token = useAuthStore((state) => state.accessToken);
//   const handleConnect = () => {
//     if (!token) return;

//     const socket = initializeSocket(token);

//     if (!socket) return;

//     if (socket.connected) {
//       setStatus("Already Connected ✅");
//       setSocketId(socket.id || null);
//       return;
//     }

//     socket.connect(); 

//     setStatus("Connecting...");
//     setSocketId(socket.id || null);
//   };

//   const handleDisconnect = () => {
//     const socket = getSocket();

//     socket?.disconnect();

//     setStatus("Disconnected ❌");
//     setSocketId(null);
//   };

//   const handleTestEvent = () => {
//     const socket = getSocket();

//     if (!socket) return alert("Socket not initialized");

//     socket.emit("ping", { message: "Hello from client" });
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
//       <div className="bg-white rounded-xl p-6 w-[320px] shadow-lg text-center space-y-4">

//         <h2 className="text-lg font-semibold">Socket Tester</h2>

//         <p className="text-sm text-gray-600">{status}</p>

//         {socketId && (
//           <p className="text-xs text-gray-500 break-all">
//             ID: {socketId}
//           </p>
//         )}

//         <div className="flex flex-col gap-2">

//           <button
//             onClick={handleConnect}
//             className="bg-blue-600 text-white py-2 rounded-lg"
//           >
//             Connect Socket
//           </button>

//           <button
//             onClick={handleDisconnect}
//             className="bg-gray-500 text-white py-2 rounded-lg"
//           >
//             Disconnect
//           </button>

//           <button
//             onClick={handleTestEvent}
//             className="bg-green-600 text-white py-2 rounded-lg"
//           >
//             Send Test Event
//           </button>

//         </div>
//       </div>
//     </div>
//   );
// }