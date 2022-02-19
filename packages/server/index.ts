import express from "express";
import { Server, Socket } from "socket.io";

interface SocketMod extends Socket {
  userId?: string;
}

const PORT = 8080;
const app = express();
const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
const io = new Server(server, {
  cors: { origin: "http://localhost:3000", credentials: true },
});
const users = new Map<string, { notes: [] }>();
const mapToArrOfObjects = (map: typeof users) =>
  Array.from(map, ([userName, value]) => ({
    userName,
    ...value,
  }));

io.on("connection", (socket: SocketMod) => {
  socket.on("new user", ({ userName, notes = [] }) => {
    socket.userId = userName;
    users.set(userName, { notes });
    socket.emit("authentication", {
      authenticated: true,
      allUsers: mapToArrOfObjects(users),
      userName,
      notes,
    });
    socket.broadcast.emit("all users", mapToArrOfObjects(users));
  });

  socket.on("update user", ({ userName, notes = [] }) => {
    users.set(userName, { notes });
    socket.broadcast.emit("all users", mapToArrOfObjects(users));
  });

  socket.on("disconnect", () => {
    if (socket.userId) {
      users.delete(socket.userId);
      socket.broadcast.emit("all users", mapToArrOfObjects(users));
    }
  });
});
