import { useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import VideoGrid from "./VideoGrid";
import ChatPanel from "./ChatPanel";
import Controls from "./Controls";

export default function ClassRoom({ roomName, userName, isTeacher }) {
  const socketRef = useRef(null);
const streamRef = useRef(null);
  const peersRef = useRef({});

  const [stream, setStream] = useState(null);
  const [messages, setMessages] = useState([]);
  const [remoteStreams, setRemoteStreams] = useState({});
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [classEnded, setClassEnded] = useState(false);
  const [mediaReady, setMediaReady] = useState(false);

  // Camera + mic start on mount — must finish before socket connects
  useEffect(() => {
    async function startMedia() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = s;
        setStream(s);
      } catch (err) {
        console.warn("Media error (camera/mic denied or unavailable):", err);
        setCamOn(false);
      } finally {
        setMediaReady(true);
      }
    }
    startMedia();
    return () => streamRef.current?.getTracks().forEach(t => t.stop());
  }, []);

  useEffect(() => {
    if (!mediaReady) return;
    const ICE = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

    const socket = io("http://localhost:5001");
    socketRef.current = socket;

    const createPeer = (socketId, peerName, isInitiator) => {
      const pc = new RTCPeerConnection(ICE);

      streamRef.current?.getTracks().forEach(track =>
        pc.addTrack(track, streamRef.current)
      );

      pc.onicecandidate = (e) => {
        if (e.candidate)
          socket.emit("ice-candidate", { to: socketId, candidate: e.candidate });
      };

      pc.ontrack = (e) => {
        setRemoteStreams(prev => ({
          ...prev,
          [socketId]: { ...prev[socketId], name: peerName, stream: e.streams[0] }
        }));
      };

      peersRef.current[socketId] = pc;

      if (isInitiator) {
        pc.createOffer()
          .then(o => pc.setLocalDescription(o))
          .then(() => socket.emit("offer", { to: socketId, offer: pc.localDescription }));
      }

      return pc;
    };

    socket.emit("join-room", { roomName, userName, isTeacher });

    socket.on("existing-users", (users) => {
      users.forEach(({ socketId, userName: name, isSharing }) => {
        setRemoteStreams(prev => ({ ...prev, [socketId]: { name, stream: null, isSharing: !!isSharing } }));
        createPeer(socketId, name, true);
      });
    });

    socket.on("user-joined", ({ socketId, userName: name }) => {
      setRemoteStreams(prev => ({ ...prev, [socketId]: { name, stream: null } }));
      setMessages(prev => [...prev, {
        userName: "System", message: `${name} joined`,
        timestamp: new Date().toLocaleTimeString(), isSystem: true
      }]);
    });

    socket.on("offer", async ({ from, userName: name, offer }) => {
      const pc = createPeer(from, name, false);
      await pc.setRemoteDescription(offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer", { to: from, answer: pc.localDescription });
    });

    socket.on("answer", async ({ from, answer }) => {
      await peersRef.current[from]?.setRemoteDescription(answer);
    });

    socket.on("ice-candidate", async ({ from, candidate }) => {
      await peersRef.current[from]?.addIceCandidate(candidate);
    });

    socket.on("user-left", ({ userName: name, socketId }) => {
      peersRef.current[socketId]?.close();
      delete peersRef.current[socketId];
      setRemoteStreams(prev => {
        const next = { ...prev };
        delete next[socketId];
        return next;
      });
      setMessages(prev => [...prev, {
        userName: "System", message: `${name} left`,
        timestamp: new Date().toLocaleTimeString(), isSystem: true
      }]);
    });

    socket.on("receive-message", (msg) => setMessages(prev => [...prev, msg]));

    socket.on("peer-sharing-state", ({ socketId, isSharing }) => {
      setRemoteStreams(prev => {
        if (!prev[socketId]) return prev;
        return { ...prev, [socketId]: { ...prev[socketId], isSharing } };
      });
    });

    socket.on("class-ended", () => {
      setClassEnded(true);
      setTimeout(() => {
        window.close();
      }, 2000);
    });

    return () => {
      Object.values(peersRef.current).forEach(pc => pc.close());
      peersRef.current = {};
      socket.disconnect();
    };
  }, [roomName, userName, isTeacher, mediaReady]);

  const handleToggleMic = () => {
    const audioTrack = streamRef.current?.getAudioTracks()[0];
    if (audioTrack) audioTrack.enabled = !micOn;
    setMicOn(v => !v);
  };

  const handleToggleCam = () => {
    const videoTrack = streamRef.current?.getVideoTracks()[0];
    if (videoTrack) videoTrack.enabled = !camOn;
    setCamOn(v => !v);
  };

  const replaceVideoTrack = (newTrack) => {
    Object.values(peersRef.current).forEach(pc => {
      const sender = pc.getSenders().find(s => s.track?.kind === "video");
      if (sender) sender.replaceTrack(newTrack);
    });
  };

  const restoreCamera = useCallback(async () => {
    try {
      const camStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      const videoTrack = camStream.getVideoTracks()[0];
      const audioTracks = streamRef.current?.getAudioTracks() ?? [];
      streamRef.current?.getVideoTracks().forEach(t => t.stop());
      const newStream = new MediaStream([...audioTracks, videoTrack]);
      streamRef.current = newStream;
      setStream(newStream);
      setCamOn(true);
      replaceVideoTrack(videoTrack);
      socketRef.current?.emit("sharing-state", { roomName, isSharing: false });
    } catch (err) {
      console.warn("Camera restore error:", err);
    }
    setSharing(false);
  }, []);

  const handleToggleShare = async () => {
    if (!sharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: { width: { ideal: 1920 }, height: { ideal: 1080 }, frameRate: { ideal: 30 } }
        });
        const screenTrack = screenStream.getVideoTracks()[0];
        const audioTracks = streamRef.current?.getAudioTracks() ?? [];
        streamRef.current?.getVideoTracks().forEach(t => t.stop());
        const newStream = new MediaStream([...audioTracks, screenTrack]);
        streamRef.current = newStream;
        setStream(newStream);
        setSharing(true);
        replaceVideoTrack(screenTrack);
        socketRef.current?.emit("sharing-state", { roomName, isSharing: true });
        screenTrack.onended = restoreCamera;
      } catch (err) {
        console.warn("Screen share cancelled:", err);
      }
    } else {
      restoreCamera();
    }
  };

  const handleLeave = () => {
    socketRef.current?.disconnect();
    window.close();
  };

  const handleEndClass = () => {
    socketRef.current?.emit("end-class", { roomName });
    window.close();
  };

  if (classEnded) {
    return (
      <div style={s.center}>
        <h2 style={{ color: "#fff" }}>Class has ended</h2>
        <p style={{ color: "#aaa" }}>Redirecting to home...</p>
      </div>
    );
  }

  return (
    <div style={s.wrapper}>
      {/* Top bar */}
      <div style={s.topBar}>
        <div style={s.roomInfo}>
          <span style={s.dot} />
          <span style={s.roomName}>{roomName}</span>
          <span style={s.badge}>{isTeacher ? "Teacher" : "Student"}</span>
        </div>
        <span style={s.count}>👥 {Object.keys(remoteStreams).length + 1} participants</span>
      </div>

      {/* Main layout */}
      <div style={s.body}>
        <VideoGrid
          remoteStreams={remoteStreams}
          userName={userName}
          stream={stream}
          camOn={camOn}
          isTeacher={isTeacher}
          sharing={sharing}
        />
        <ChatPanel
          messages={messages}
          onSend={(text) => socketRef.current?.emit("send-message", { roomName, userName, message: text })}
          userName={userName}
        />
      </div>

      {/* Controls */}
      <Controls
        micOn={micOn} camOn={camOn} sharing={sharing}
        isTeacher={isTeacher}
        onToggleMic={handleToggleMic}
        onToggleCam={handleToggleCam}
        onToggleShare={handleToggleShare}
        onLeave={handleLeave}
        onEndClass={handleEndClass}
      />
    </div>
  );
}

const s = {
  wrapper: {
    display: "flex", flexDirection: "column",
    height: "100vh", background: "#0a0a1a"
  },
  topBar: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "12px 20px", background: "#10102a",
    borderBottom: "1px solid #2a2a4a"
  },
  roomInfo: { display: "flex", alignItems: "center", gap: "10px" },
  dot: {
    width: "10px", height: "10px", borderRadius: "50%",
    background: "#22c55e", boxShadow: "0 0 6px #22c55e"
  },
  roomName: { fontWeight: "700", fontSize: "16px", color: "#fff" },
  badge: {
    background: "#1e1e3a", color: "#a5b4fc",
    padding: "3px 10px", borderRadius: "20px", fontSize: "12px"
  },
  count: { color: "#aaa", fontSize: "14px" },
  body: { display: "flex", flex: 1, overflow: "hidden" },
  center: {
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    height: "100vh", gap: "12px", background: "#0a0a1a"
  },
};