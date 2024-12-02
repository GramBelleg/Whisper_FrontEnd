import { io } from 'socket.io-client'

class Socket {
    static socketInstance // Shared socket instance for all subclasses
    serverUrl = 'http://localhost:5000/'

    constructor() {
        if (!Socket.socketInstance) {
            // Create the shared socket connection only once
            Socket.socketInstance = io(this.serverUrl, {
                withCredentials: true,
                transports: ['websocket']
            })
            console.log('Socket connection established')
        }
        console.log('called')
        this.socket = Socket.socketInstance // Assign the shared socket to the instance
    }

    sendData(data) {
        throw new Error("Method 'sendData' must be implemented by subclasses")
    }

    deleteData(data) {
        throw new Error("Method 'deleteData' must be implemented by subclasses")
    }

    disconnect() {
        throw new Error("Method 'disconnect' must be implemented by subclasses")
    }
}

export default Socket
