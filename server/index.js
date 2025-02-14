import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { configDotenv } from "dotenv";
import { Server } from "socket.io";

const app = express();
configDotenv();
app.use(cors());
app.use(express.json({ limit: "1GB" }));

app.use("/auth", userRoutes);
app.use("/message", messageRoutes);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log(err.message);
  });
const server = app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});

//socket.io code to make a realTime chat.
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    global.onlineUsers.set(userId, socket.id);
  });
  socket.on("send-message", (data) => {
    // Corrected the event name to "send-message"
    const sendUserSocket = global.onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receive", data); // Corrected "msg-recieve" to "msg-receive"
    }
  });
  socket.on("call-user", (data) => {
    const sendUserSocket = global.onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("call-receive", data);
    }
  });

  socket.on("make-answer", (data) => {
    const sendUserSocket = global.onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("answer-made", data);
    }
  });

  socket.on("ice-candidate", (data) => {
    const sendUserSocket = global.onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("ice-candidate", data);
    }
  });

  socket.on("reject-call", (data) => {
    const sendUserSocket = global.onlineUsers.get(data.from);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("call-rejected");
    }
  });
});
