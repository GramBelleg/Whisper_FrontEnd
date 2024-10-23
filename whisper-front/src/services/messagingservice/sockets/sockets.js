
import { io } from "socket.io-client";

// Your existing code
export const socket = io("http://localhost:5000", {
  withCredentials: true,
});
