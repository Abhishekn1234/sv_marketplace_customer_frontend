import { useEffect, useRef } from "react";
import { getSocket } from "@/features/core/Websocket/socket";

export default function VideoCallPage() {
  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const socket = getSocket();

  useEffect(() => {
    let localStream: MediaStream;
    let peer: RTCPeerConnection;

    async function startCall() {
      // 1. get camera
      localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (localVideo.current) {
        localVideo.current.srcObject = localStream;
      }

      // 2. create peer connection
      peer = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      // 3. add tracks
      localStream.getTracks().forEach((track) =>
        peer.addTrack(track, localStream)
      );

      // 4. remote stream
      peer.ontrack = (event) => {
        if (remoteVideo.current) {
          remoteVideo.current.srcObject = event.streams[0];
        }
      };

      // 5. ICE candidates
      peer.onicecandidate = (event) => {
        if (event.candidate) {
          socket?.emit("ice-candidate", event.candidate);
        }
      };

      // 6. create offer
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);

      socket?.emit("video-offer", offer);
    }

    startCall();

    // receive answer
    socket?.on("video-answer", async (answer) => {
      await peer.setRemoteDescription(answer);
    });

    // receive ICE
    socket?.on("ice-candidate", async (candidate) => {
      await peer.addIceCandidate(candidate);
    });

    return () => {
      socket?.off("video-answer");
      socket?.off("ice-candidate");
      localStream?.getTracks().forEach((t) => t.stop());
      peer?.close();
    };
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <video ref={localVideo} autoPlay playsInline muted />
      <video ref={remoteVideo} autoPlay playsInline />
    </div>
  );
}