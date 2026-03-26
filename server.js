const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

// create server
const server = http.createServer(app);

// create socket server ✅
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// socket logic
io.on("connection", (socket) => {

  socket.on("joinRoom", ({ room, name }) => {
    const clients = io.sockets.adapter.rooms.get(room);

    if (clients && clients.size >= 2) {
      socket.emit("roomFull");
      return;
    }

    socket.join(room);
    socket.to(room).emit("online");
  });

  socket.on("sendMessage", (data) => {
    io.to(data.room).emit("message", data);
  });

  socket.on("typing", (data) => {
    socket.to(data.room).emit("typing", data);
  });

  socket.on("seen", ({ room }) => {
    socket.to(room).emit("seen");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

});

// IMPORTANT for Render
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
