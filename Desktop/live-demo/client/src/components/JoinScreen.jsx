import { useState } from "react";

export default function JoinScreen({ onJoin }) {
  const [userName, setUserName] = useState("");
  const [roomName, setRoomName] = useState("java-101");
  const [isTeacher, setIsTeacher] = useState(false);

  const handleJoin = () => {
    if (!userName.trim()) return alert("Enter your name!");
    onJoin({ userName: userName.trim(), roomName: roomName.trim(), isTeacher });
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>📡</div>
        <h1 style={s.title}>Live Classroom</h1>
        <p style={s.sub}>E-Learning Platform — Live Module</p>

        <div style={s.field}>
          <label style={s.label}>Your Name</label>
          <input
            style={s.input}
            placeholder="e.g. Rohit"
            value={userName}
            onChange={e => setUserName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleJoin()}
          />
        </div>

        <div style={s.field}>
          <label style={s.label}>Room / Class</label>
          <input
            style={s.input}
            placeholder="e.g. java-101"
            value={roomName}
            onChange={e => setRoomName(e.target.value)}
          />
        </div>

        <div style={s.roleRow}>
          <button
            style={s.roleBtn(!isTeacher)}
            onClick={() => setIsTeacher(false)}
          >
            👨‍🎓 Student
          </button>
          <button
            style={s.roleBtn(isTeacher)}
            onClick={() => setIsTeacher(true)}
          >
            👨‍🏫 Teacher
          </button>
        </div>

        <button style={s.joinBtn} onClick={handleJoin}>
          Join Class →
        </button>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh", display: "flex",
    alignItems: "center", justifyContent: "center",
    background: "linear-gradient(135deg, #0a0a1a 0%, #12122e 100%)"
  },
  card: {
    background: "#13132b", border: "1px solid #2a2a4a",
    borderRadius: "20px", padding: "40px 48px",
    width: "100%", maxWidth: "420px", textAlign: "center"
  },
  logo: { fontSize: "48px", marginBottom: "12px" },
  title: { fontSize: "26px", fontWeight: "700", marginBottom: "6px" },
  sub: { color: "#888", fontSize: "14px", marginBottom: "32px" },
  field: { textAlign: "left", marginBottom: "18px" },
  label: { display: "block", fontSize: "13px", color: "#aaa", marginBottom: "6px" },
  input: {
    width: "100%", padding: "11px 14px", borderRadius: "10px",
    border: "1px solid #2a2a4a", background: "#1a1a35",
    color: "#fff", fontSize: "15px", outline: "none"
  },
  roleRow: { display: "flex", gap: "10px", marginBottom: "24px" },
  roleBtn: (active) => ({
    flex: 1, padding: "10px", borderRadius: "10px", border: "none",
    cursor: "pointer", fontWeight: "600", fontSize: "14px",
    background: active ? "#4f46e5" : "#1e1e3a",
    color: active ? "#fff" : "#aaa",
    transition: "all 0.2s"
  }),
  joinBtn: {
    width: "100%", padding: "13px", borderRadius: "10px",
    border: "none", background: "#4f46e5", color: "#fff",
    fontSize: "16px", fontWeight: "700", cursor: "pointer"
  }
};