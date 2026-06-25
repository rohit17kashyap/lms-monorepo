export default function Controls({
  micOn, camOn, sharing, isTeacher,
  onToggleMic, onToggleCam, onToggleShare,
  onLeave, onEndClass
}) {
  return (
    <div style={s.bar}>
      <button style={s.btn(micOn)} onClick={onToggleMic}>
        {micOn ? "🎙 Mute" : "🔇 Unmute"}
      </button>

      <button style={s.btn(camOn)} onClick={onToggleCam}>
        {camOn ? "📷 Stop Cam" : "📷 Start Cam"}
      </button>

      <button style={s.btn(!sharing)} onClick={onToggleShare}>
        {sharing ? "🖥 Stop Share" : "🖥 Share Screen"}
      </button>

      <div style={s.spacer} />

      {isTeacher ? (
        <button style={s.danger} onClick={onEndClass}>
          ⏹ End Class
        </button>
      ) : (
        <button style={s.danger} onClick={onLeave}>
          📤 Leave
        </button>
      )}
    </div>
  );
}

const s = {
  bar: {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "14px 24px", background: "#0c0c22",
    borderTop: "1px solid #2a2a4a"
  },
  btn: (active) => ({
    padding: "10px 18px", borderRadius: "10px",
    border: "none", cursor: "pointer",
    background: active ? "#1e1e3a" : "#2d2d50",
    color: active ? "#fff" : "#aaa",
    fontWeight: "600", fontSize: "14px"
  }),
  spacer: { flex: 1 },
  danger: {
    padding: "10px 20px", borderRadius: "10px",
    border: "none", background: "#7f1d1d",
    color: "#fca5a5", fontWeight: "700",
    fontSize: "14px", cursor: "pointer"
  }
};