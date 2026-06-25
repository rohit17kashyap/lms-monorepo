import { useEffect, useRef, useState } from "react";

const COLORS = ["#4f46e5","#7c3aed","#0891b2","#059669","#d97706","#dc2626"];

function FullscreenBtn({ targetRef }) {
  const handleFullscreen = () => {
    const el = targetRef.current;
    if (!el) return;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  };
  return (
    <button onClick={handleFullscreen} style={s.fsBtn} title="View Fullscreen">
      ⛶
    </button>
  );
}

function RemoteTile({ name, stream, index, isSharing }) {
  const videoRef = useRef(null);
  const tileRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const color = COLORS[index % COLORS.length];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream ?? null;
    }
  }, [stream]);

  return (
    <div
      ref={tileRef}
      style={s.tile}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{
            ...s.videoRemote,
            transform: isSharing ? "none" : "scaleX(-1)",
            objectFit: isSharing ? "contain" : "cover"
          }}
        />
      ) : (
        <div style={{ ...s.videoBg, background: `${color}22` }}>
          <div style={{ ...s.avatar, background: color }}>
            <span style={{ fontSize: "32px" }}>👤</span>
          </div>
        </div>
      )}
      <div style={s.nameTag}>{name}{isSharing ? " 🖥️" : ""}</div>
      {isSharing && stream && hovered && <FullscreenBtn targetRef={tileRef} />}
    </div>
  );
}

// stream prop ClassRoom se aata hai — yahan sirf render karo
function LocalTile({ name, stream, camOn, sharing, isTeacher }) {
  const videoRef = useRef(null);
  const tileRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream ?? null;
    }
  }, [stream]);

  return (
    <div
      ref={tileRef}
      style={s.tile}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{
          ...s.video,
          transform: sharing ? "none" : "scaleX(-1)",
          objectFit: sharing ? "contain" : "cover",
          display: (camOn || sharing) && stream ? "block" : "none"
        }}
      />

      {!camOn && !sharing && (
        <div style={{ ...s.videoBg, background: "#111827" }}>
          <div style={s.centerContent}>
            <span style={{ fontSize: "36px" }}>📷</span>
            <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "8px" }}>Camera Off</p>
          </div>
        </div>
      )}

      <div style={s.nameTag}>
        {isTeacher ? "👨‍🏫 " : ""}{name} (You){sharing ? " 🖥️" : ""}
      </div>
      {sharing && stream && hovered && <FullscreenBtn targetRef={tileRef} />}
    </div>
  );
}

export default function VideoGrid({ remoteStreams, userName, stream, camOn, isTeacher, sharing }) {
  return (
    <div style={s.grid}>
      <LocalTile
        name={userName}
        stream={stream}
        camOn={camOn}
        sharing={sharing}
        isTeacher={isTeacher}
      />
      {Object.entries(remoteStreams).map(([socketId, { name, stream: rs, isSharing }], i) => (
        <RemoteTile key={socketId} name={name} stream={rs} index={i + 1} isSharing={!!isSharing} />
      ))}
    </div>
  );
}

const s = {
  grid: {
    flex: 1,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "12px",
    padding: "16px",
    overflowY: "auto",
    alignContent: "start"
  },
  tile: {
    position: "relative",
    borderRadius: "14px",
    overflow: "hidden",
    aspectRatio: "16/9",
    border: "1px solid #2a2a4a",
    background: "#0f0f1f"
  },
  video: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  videoRemote: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  videoBg: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  avatar: {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  centerContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  nameTag: {
    position: "absolute",
    bottom: "8px",
    left: "10px",
    background: "rgba(0,0,0,0.65)",
    color: "#fff",
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "13px"
  },
  fsBtn: {
    position: "absolute",
    top: "8px",
    right: "8px",
    background: "rgba(0,0,0,0.7)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "4px 10px",
    fontSize: "18px",
    cursor: "pointer",
    lineHeight: 1,
    zIndex: 10
  }
};
