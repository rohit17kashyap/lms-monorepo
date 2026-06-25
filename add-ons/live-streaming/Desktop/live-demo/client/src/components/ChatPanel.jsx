import { useState, useEffect, useRef } from "react";

export default function ChatPanel({ messages, onSend, userName }) {
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <div style={s.panel}>
      <div style={s.header}>💬 Live Chat</div>

      <div style={s.messages}>
        {messages.length === 0 && (
          <p style={s.empty}>No messages yet...</p>
        )}
        {messages.map((m, i) => (
          <div key={i} style={m.isSystem ? s.sysMsg : s.msg}>
            {m.isSystem ? (
              <span style={s.sysText}>{m.message}</span>
            ) : (
              <>
                <div style={s.msgHeader}>
                  <span style={{
                    ...s.name,
                    color: m.userName === userName ? "#a5b4fc" : "#34d399"
                  }}>
                    {m.userName === userName ? "You" : m.userName}
                  </span>
                  <span style={s.time}>{m.timestamp}</span>
                </div>
                <p style={s.text}>{m.message}</p>
              </>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div style={s.inputRow}>
        <input
          style={s.input}
          value={input}
          placeholder="Type a message..."
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
        />
        <button style={s.sendBtn} onClick={send}>↑</button>
      </div>
    </div>
  );
}

const s = {
  panel: {
    width: "300px", background: "#0e0e25",
    display: "flex", flexDirection: "column",
    borderLeft: "1px solid #2a2a4a"
  },
  header: {
    padding: "14px 16px", fontWeight: "600",
    borderBottom: "1px solid #2a2a4a", fontSize: "15px"
  },
  messages: { flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: "12px" },
  empty: { color: "#555", fontSize: "13px", textAlign: "center", marginTop: "20px" },
  msg: { background: "#13132b", borderRadius: "10px", padding: "8px 12px" },
  sysMsg: { textAlign: "center" },
  sysText: { color: "#555", fontSize: "12px" },
  msgHeader: { display: "flex", justifyContent: "space-between", marginBottom: "4px" },
  name: { fontSize: "12px", fontWeight: "600" },
  time: { fontSize: "11px", color: "#555" },
  text: { fontSize: "14px", color: "#ddd", lineHeight: "1.4" },
  inputRow: { display: "flex", gap: "8px", padding: "12px", borderTop: "1px solid #2a2a4a" },
  input: {
    flex: 1, padding: "10px 12px", borderRadius: "10px",
    border: "1px solid #2a2a4a", background: "#1a1a35",
    color: "#fff", fontSize: "14px", outline: "none"
  },
  sendBtn: {
    width: "40px", height: "40px", borderRadius: "10px",
    border: "none", background: "#4f46e5", color: "#fff",
    fontSize: "18px", cursor: "pointer", fontWeight: "700"
  }
};