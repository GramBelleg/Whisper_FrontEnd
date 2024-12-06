import apiUrl from '@/config'
import { io } from 'socket.io-client'

class Socket {
    static socketInstance // Shared socket instance for all subclasses
    serverUrl = apiUrl

    constructor() {
        if (!Socket.socketInstance) {
            const token = localStorage.getItem("token")
            // Create the shared socket connection only once
            Socket.socketInstance = io(this.serverUrl, {
                query: {
                    token: token,
                },
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
