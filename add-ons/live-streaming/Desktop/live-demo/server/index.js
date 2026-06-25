const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] }
});

app.use(cors());
app.get("/", (req, res) => res.send("Server OK"));

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  socket.on("join-room", ({ roomName, userName, isTeacher }) => {
    // Existing users collect karo BEFORE joining
    const existingUsers = [];
    const room = io.sockets.adapter.rooms.get(roomName);
    if (room) {
      room.forEach(sid => {
        const s = io.sockets.sockets.get(sid);
        if (s) existingUsers.push({ socketId: sid, userName: s.data.userName, isSharing: s.data.isSharing || false });
      });
    }

    socket.join(roomName);
    socket.data.userName = userName;
    socket.data.roomName = roomName;
    socket.data.isTeacher = isTeacher;
    socket.data.joinedAt = new Date();

    console.log(`${userName} joined ${roomName} as ${isTeacher ? "Teacher" : "Student"}`);

    socket.emit("existing-users", existingUsers);
    socket.to(roomName).emit("user-joined", { userName, socketId: socket.id });
  });

  socket.on("send-message", ({ roomName, message, userName }) => {
    io.to(roomName).emit("receive-message", {
      userName,
      message,
      timestamp: new Date().toLocaleTimeString()
    });
  });

  socket.on("offer", ({ to, offer }) => {
    io.to(to).emit("offer", { from: socket.id, userName: socket.data.userName, offer });
  });

  socket.on("answer", ({ to, answer }) => {
    io.to(to).emit("answer", { from: socket.id, answer });
  });

  socket.on("ice-candidate", ({ to, candidate }) => {
    io.to(to).emit("ice-candidate", { from: socket.id, candidate });
  });

  socket.on("sharing-state", ({ roomName, isSharing }) => {
    socket.data.isSharing = isSharing;
    socket.to(roomName).emit("peer-sharing-state", { socketId: socket.id, isSharing });
  });

  socket.on("end-class", ({ roomName }) => {
    socket.to(roomName).emit("class-ended");
    console.log(`Teacher ended class: ${roomName}`);
  });

  socket.on("disconnect", () => {
    const { roomName, userName, isTeacher } = socket.data;

    if (roomName && isTeacher) {
      socket.to(roomName).emit("class-ended");
      console.log(`Teacher ${userName} disconnected — class ended: ${roomName}`);
    } else if (roomName) {
      socket.to(roomName).emit("user-left", { userName, socketId: socket.id });
      console.log(`Student ${userName} disconnected from: ${roomName}`);
    }

    console.log("User disconnected:", socket.id);
  });
});

// Room status API
app.get("/api/room/:roomName/status", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const room = io.sockets.adapter.rooms.get(req.params.roomName);
  res.json({
    room_name: req.params.roomName,
    is_live: !!room,
    participant_count: room ? room.size : 0,
  });
});

// GET /api/rooms — all active rooms
app.get("/api/rooms", (_req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const rooms = io.sockets.adapter.rooms;
  const result = [];

  rooms.forEach((sockets, roomName) => {
    // socket.io internal rooms (per-socket) skip karo
    if (io.sockets.sockets.has(roomName)) return;
    result.push({
      room_name: roomName,
      is_live: true,
      participant_count: sockets.size,
    });
  });

  res.json({ rooms: result, total: result.length });
});

// GET /api/room/:roomName/participants — participant list with name, role, joined_at
app.get("/api/room/:roomName/participants", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const room = io.sockets.adapter.rooms.get(req.params.roomName);

  if (!room) {
    return res.status(404).json({ error: "Room not found", participants: [] });
  }

  const participants = [];
  room.forEach((socketId) => {
    const socket = io.sockets.sockets.get(socketId);
    if (socket) {
      participants.push({
        name: socket.data.userName || "Unknown",
        role: socket.data.isTeacher ? "teacher" : "student",
        joined_at: socket.data.joinedAt || null,
      });
    }
  });

  res.json({ room_name: req.params.roomName, participants, total: participants.length });
});

// GET /api/health — server status
app.get("/api/health", (_req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const rooms = io.sockets.adapter.rooms;
  let activeRooms = 0;
  rooms.forEach((_, roomName) => {
    if (!io.sockets.sockets.has(roomName)) activeRooms++;
  });

  res.json({
    status: "ok",
    uptime: Math.floor(process.uptime()),
    active_rooms: activeRooms,
    total_connections: io.sockets.sockets.size,
  });
});

httpServer.listen(5001, () => console.log("Server on http://localhost:5001"));