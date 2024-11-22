import { io } from 'socket.io-client';

class Socket {

    serverUrl = "http://localhost:5000";

    constructor() {
        this.socket = io(this.serverUrl, {
            withCredentials: true
        });
        console.log("hello from socket base class");
    }

    sendData(data) {
        throw new Error("Method 'sendData' must be implemented by subclasses");
    }

    deleteData(data) {
        throw new Error("Method 'deleteData' must be implemented by subclasses")
    }

    disconnect() {
        throw new Error("Method 'disconnect' must be implemented by subclasses")
    }   
}

export default Socket;
