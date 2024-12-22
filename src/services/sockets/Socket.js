import apiUrl from '@/config'
import { io } from 'socket.io-client'

class Socket {
    static socketInstance 
    serverUrl = apiUrl

    constructor() {
        if (!Socket.socketInstance) {
            const token = localStorage.getItem("token")
            console.log("SOCKKKKKEEEEEET", token)
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
        this.socket = Socket.socketInstance 
    }

    sendData(data) {
        throw new Error("Method 'sendData' must be implemented by subclasses")
    }

    deleteData(data) {
        throw new Error("Method 'deleteData' must be implemented by subclasses")
    }

    disconnect() {
        // console.log(`Disconnecting from ${this.serverUrl}`)
        // this.socket.disconnect()
    }
}

export default Socket
