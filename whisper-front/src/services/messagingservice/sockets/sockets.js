
import { io } from "socket.io-client";

// Create a socket instance
const socket = io("http://localhost:5000", {
  withCredentials: true,
});

// Socket event listeners for connection status
socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

// Custom error handler
socket.on('error', (error) => {
    console.error('Socket error:', error);
});


export { socket };