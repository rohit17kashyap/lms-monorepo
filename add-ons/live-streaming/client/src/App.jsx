import { useState, useEffect } from "react";
import JoinScreen from "./components/JoinScreen";
import ClassRoom from "./components/ClassRoom";

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const room = params.get("room");
    const user = params.get("user");
    const role = params.get("role");

    console.log("URL params:", room, user, role);

    if (room && user && role) {
      setSession({
        roomName: room,
        userName: user,
        isTeacher: role === "teacher",
      });
    }
  }, []);

  if (!session) {
    return <JoinScreen onJoin={setSession} />;
  }

  return (
    <ClassRoom
      roomName={session.roomName}
      userName={session.userName}
      isTeacher={session.isTeacher}
      onLeave={() => setSession(null)}
    />
  );
}