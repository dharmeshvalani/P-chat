io.on("connection", (socket) => {

  socket.on("joinRoom", ({ room, name }) => {
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

});
