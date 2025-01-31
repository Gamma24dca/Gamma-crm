import { io } from 'socket.io-client';

const socket = io('https://gamma-crm.onrender.com', {
  transports: ['websocket'], // Force WebSocket to avoid polling issues
  withCredentials: true,
});

export default socket;
