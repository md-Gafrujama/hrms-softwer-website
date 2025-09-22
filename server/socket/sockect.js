// server/socket/socket.js

import { Server } from "socket.io";

let io;
const userSockets = new Map();

/**
 * Initialize socket server
 * @param {http.Server} server - Your HTTP or HTTPS server
 */
export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // 🔒 In production, replace this with your frontend URL
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ A user connected:", socket.id);

    // Identify user
    socket.on("identify", (userId) => {
      if (!userId) return;
      userSockets.set(userId, socket.id);
      console.log(`📌 User identified: ${userId} with socket ${socket.id}`);
    });

    // Read notification
    socket.on("notification:read", (notificationId) => {
      console.log(`🟡 Notification read by client: ${notificationId}`);
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      for (const [userId, sId] of userSockets.entries()) {
        if (sId === socket.id) {
          userSockets.delete(userId);
          console.log(`❌ User disconnected: ${userId}`);
          break;
        }
      }
    });
  });
};

/**
 * Emit new notification to a specific user
 * @param {string} userId
 * @param {object|string} notification
 */
export const sendNewNotification = (userId, notification) => {
  const socketId = userSockets.get(userId);
  if (io && socketId) {
    io.to(socketId).emit("notification:new", notification);
    console.log(`📤 New notification sent to user ${userId}`);
  } else {
    console.warn(`⚠️ No socket found for user ${userId}`);
  }
};

/**
 * Emit updated notification to a specific user
 * @param {string} userId
 * @param {object|string} notification
 */
export const sendUpdatedNotification = (userId, notification) => {
  const socketId = userSockets.get(userId);
  if (io && socketId) {
    io.to(socketId).emit("notification:update", notification);
    console.log(`🔄 Updated notification sent to user ${userId}`);
  } else {
    console.warn(`⚠️ No socket found for user ${userId}`);
  }
};
