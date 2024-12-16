import Socket from './Socket'

class UserSocket extends Socket {
    static instance

    constructor() {
        if (UserSocket.instance) {
            console.log('Returning existing instance of UserSocket')
            return UserSocket.instance
        }
        super()

        UserSocket.instance = this
    }

    onPFP(callback) {
        console.log("Listening for 'pfp' events")
        this.socket.on('pfp', (data) => {
            console.log("Received 'pfp' eventttt data:", data)
            callback(data)
        })
    }

    offPFP(callback) {
        console.log("Removing listener for 'pfp' events")
        this.socket.off('pfp', (data) => {
            callback(data)
        })
    }

    emitPFP(data) {
        console.log("Emitting 'pfp' event with data:", data)
        this.socket.emit('pfp', data)
    }

    disconnect() {
        super.disconnect()
    }
}

export default UserSocket
