import { Server } from 'socket.io';

let io;
const userSockets = new Map();

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('identify', (userId) => {
      userSockets.set(userId, socket.id);
      console.log(`User identified: ${userId} with socket ${socket.id}`);
    });

    socket.on('notification:read', (notificationId) => {
      console.log(`Notification read by client: ${notificationId}`);
    });

    socket.on('disconnect', () => {
      for (const [userId, sId] of userSockets.entries()) {
        if (sId === socket.id) {
          userSockets.delete(userId);
          console.log(`User disconnected: ${userId}`);
          break;
        }
      }
    });
  });
};

export const sendNewNotification = (userId, notification) => {
  const socketId = userSockets.get(userId);
  if (socketId && io) {
    io.to(socketId).emit('notification:new', notification);
    console.log(`New notification sent to user ${userId}`);
  }
};

export const sendUpdatedNotification = (userId, notification) => {
  const socketId = userSockets.get(userId);
  if (socketId && io) {
    io.to(socketId).emit('notification:update', notification);
    console.log(`Updated notification sent to user ${userId}`);
  }
};
