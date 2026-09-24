const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Simple in-memory state for streams
  const activeStreams = new Map();

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      
      if (!activeStreams.has(roomId)) {
        activeStreams.set(roomId, { viewers: 0 });
      }
      const stream = activeStreams.get(roomId);
      stream.viewers++;
      
      io.to(roomId).emit("viewer_count", stream.viewers);
      console.log(`Socket ${socket.id} joined ${roomId}, Viewers: ${stream.viewers}`);
    });

    socket.on("send_message", (data) => {
      // data: { roomId, message, user }
      io.to(data.roomId).emit("receive_message", {
        id: Date.now().toString(),
        message: data.message,
        user: data.user,
        timestamp: new Date().toISOString()
      });
    });

    socket.on("send_gift", (data) => {
      // data: { roomId, gift, user }
      io.to(data.roomId).emit("receive_gift", {
        id: Date.now().toString(),
        gift: data.gift,
        user: data.user,
        timestamp: new Date().toISOString()
      });
    });

    socket.on("disconnecting", () => {
      socket.rooms.forEach((roomId) => {
        if (activeStreams.has(roomId)) {
          const stream = activeStreams.get(roomId);
          stream.viewers = Math.max(0, stream.viewers - 1);
          io.to(roomId).emit("viewer_count", stream.viewers);
        }
      });
    });

    // --- Photo Gallery Features ---
    socket.on("join_photo", (photoId) => {
      socket.join(`photo_${photoId}`);
      console.log(`Socket ${socket.id} joined photo ${photoId}`);
    });

    socket.on("leave_photo", (photoId) => {
      socket.leave(`photo_${photoId}`);
      console.log(`Socket ${socket.id} left photo ${photoId}`);
    });

    socket.on("comment_photo", (data) => {
      // data: { photoId, text, user }
      io.to(`photo_${data.photoId}`).emit("receive_photo_comment", {
        id: Date.now().toString(),
        text: data.text,
        user: data.user,
        timestamp: new Date().toISOString()
      });
    });

    socket.on("like_photo", (data) => {
      // data: { photoId, user }
      io.to(`photo_${data.photoId}`).emit("receive_photo_like", {
        id: Date.now().toString(),
        user: data.user,
      });
    });


    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
