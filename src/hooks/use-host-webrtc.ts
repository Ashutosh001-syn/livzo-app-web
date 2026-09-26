import { useEffect, useRef } from "react";
import { useSocket } from "@/components/providers/socket-provider";

export function useHostWebRTC(isLive: boolean, streamId: string | null, localStream: MediaStream | null) {
  const { socket, isConnected } = useSocket();
  const peerConnections = useRef<{ [socketId: string]: RTCPeerConnection }>({});

  useEffect(() => {
    if (!isLive || !streamId || !socket || !isConnected || !localStream) return;

    socket.emit("join_room", streamId);

    const handleViewerReady = async (data: { viewerSocketId: string }) => {
      console.log("Viewer ready:", data.viewerSocketId);
      const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      peerConnections.current[data.viewerSocketId] = peerConnection;

      // Add local stream tracks to the connection
      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("webrtc_ice_candidate", {
            target: data.viewerSocketId,
            candidate: event.candidate,
          });
        }
      };

      try {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.emit("webrtc_offer", {
          target: data.viewerSocketId,
          sdp: offer,
        });
      } catch (err) {
        console.error("Error creating offer:", err);
      }
    };

    const handleAnswer = async (data: { sender: string; sdp: RTCSessionDescriptionInit }) => {
      const peerConnection = peerConnections.current[data.sender];
      if (peerConnection) {
        try {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(data.sdp));
        } catch (err) {
          console.error("Error setting remote description from answer:", err);
        }
      }
    };

    const handleIceCandidate = async (data: { sender: string; candidate: RTCIceCandidateInit }) => {
      const peerConnection = peerConnections.current[data.sender];
      if (peerConnection) {
        try {
          await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (err) {
          console.error("Error adding ice candidate:", err);
        }
      }
    };

    socket.on("viewer_ready", handleViewerReady);
    socket.on("webrtc_answer", handleAnswer);
    socket.on("webrtc_ice_candidate", handleIceCandidate);

    return () => {
      socket.off("viewer_ready", handleViewerReady);
      socket.off("webrtc_answer", handleAnswer);
      socket.off("webrtc_ice_candidate", handleIceCandidate);
      
      // Cleanup all peer connections
      Object.values(peerConnections.current).forEach(pc => pc.close());
      peerConnections.current = {};
    };
  }, [isLive, streamId, socket, isConnected, localStream]);
}
