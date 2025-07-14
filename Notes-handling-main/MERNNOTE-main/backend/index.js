import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.router.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import noteroute from "./routes/noteroute.js";
import userrouter from "./routes/user.route.js";
import { Server } from "socket.io";
import http from "http"
import chatrouter from "./routes/chat.router.js";
import Chat from "./models/chat.js";
dotenv.config();
let app = express();
let port = process.env.PORT || 3000;
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "https://mernnote-f4gs.onrender.com", // or your frontend URL
  credentials: true
}));
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://mernnote-f4gs.onrender.com",
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("send-message", async (message) => {
    try {
      const saved = await Chat.create({
        text: message.text,
        sender: message.sender,
        timestamp: message.timestamp,
        author: message.userId,
      });

      const populated = await Chat.findById(saved._id).populate("author", "UserName");

      io.emit("receive-message", populated);
    } catch (err) {
      console.error("Socket message error:", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
app.use("/api/auth/",authRouter)
app.use("/api/notes/",noteroute)
app.use("/api/user/",userrouter)
app.use("/api/chat",chatrouter)
connectDB();
server.listen(port, () => {    
  console.log(`Server is running on port ${port}`);
});
