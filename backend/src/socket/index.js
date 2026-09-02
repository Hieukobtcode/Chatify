import { Server } from "socket.io"
import http from "http"
import express from "express"
import { socketAuthMiddleware } from "../middlewares/socketMiddleware.js";
import { getUserConversationsForSocketIO } from "../controllers/conversationController.js";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true
    },
    // Giảm overhead ping
    pingInterval: 25000,
    pingTimeout: 20000,
});
io.use(socketAuthMiddleware)

const onlineUsers = new Map(); // {userId : socketId}

// Chỉ gửi danh sách online users cho các user đang online (không broadcast toàn bộ)
const emitOnlineUsers = () => {
    const userIds = Array.from(onlineUsers.keys());
    // Gửi riêng cho từng socket để giảm payload
    for (const [userId, socketId] of onlineUsers.entries()) {
        const socket = io.sockets.sockets.get(socketId);
        if (socket) {
            socket.emit("online-users", userIds);
        }
    }
};

io.on("connection", async (socket) => {
    const user = socket.user;

    onlineUsers.set(user._id, socket.id);

    // Gửi danh sách online users chỉ cho user vừa kết nối
    socket.emit("online-users", Array.from(onlineUsers.keys()));

    // Thông báo cho các user khác rằng user này online (chỉ gửi userId)
    socket.broadcast.emit("user-online", user._id.toString());

    const conversationIds = await getUserConversationsForSocketIO(user._id)
    conversationIds.forEach((id) => {
        socket.join(id);
    })

    socket.on("join-conversation", (conversationId) => {
        socket.join(conversationId)
    })

    socket.join(user._id.toString());

    socket.on("disconnect", () => {
        onlineUsers.delete(user._id)
        // Chỉ thông báo user offline cho các user khác
        socket.broadcast.emit("user-offline", user._id.toString());
        console.log(`Socket disconnected: ${socket.id}`);
    })
})

export { io, server, app }