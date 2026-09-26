import { useEffect, useRef, useState } from "react";
import { useSocket } from "@/components/providers/socket-provider";

export function useViewerWebRTC(roomId: string) {
  const { socket, isConnected } = useSocket();
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    if (!roomId || !socket || !isConnected) return;

    // Signal host that viewer is ready
    socket.emit("viewer_joined", roomId);

    const handleOffer = async (data: { sender: string; sdp: RTCSessionDescriptionInit }) => {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      peerConnectionRef.current = pc;

      pc.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("webrtc_ice_candidate", {
            target: data.sender,
            candidate: event.candidate,
          });
        }
      };

      try {
        await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("webrtc_answer", {
          target: data.sender,
          sdp: answer,
        });
      } catch (err) {
        console.error("Error handling offer:", err);
      }
    };

    const handleIceCandidate = async (data: { sender: string; candidate: RTCIceCandidateInit }) => {
      if (peerConnectionRef.current) {
        try {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (err) {
          console.error("Error adding ice candidate:", err);
        }
      }
    };

    socket.on("webrtc_offer", handleOffer);
    socket.on("webrtc_ice_candidate", handleIceCandidate);

    return () => {
      socket.off("webrtc_offer", handleOffer);
      socket.off("webrtc_ice_candidate", handleIceCandidate);
      
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
    };
  }, [roomId, socket, isConnected]);

  return { remoteStream };
}
