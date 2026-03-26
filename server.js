const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// store room users count
const roomUsers = {};

io.on("connection", (socket) => {

  socket.on("joinRoom", (roomCode) => {
    socket.join(roomCode);

    if (!roomUsers[roomCode]) {
      roomUsers[roomCode] = 0;
    }

    if (roomUsers[roomCode] >= 2) {
      socket.emit("roomFull");
      return;
    }

    roomUsers[roomCode]++;
    socket.roomCode = roomCode;

    io.to(roomCode).emit("message", "User joined");
  });

  socket.on("sendMessage", ({ roomCode, message }) => {
    io.to(roomCode).emit("message", message);
  });

  socket.on("disconnect", () => {
    const roomCode = socket.roomCode;
    if (roomCode && roomUsers[roomCode]) {
      roomUsers[roomCode]--;
      if (roomUsers[roomCode] <= 0) {
        delete roomUsers[roomCode];
      }
    }
  });
});

server.listen(3000, () => console.log("Server running on 3000"));
