import Socket from './Socket.js'

class MessagingSocket extends Socket {
    static instance

    constructor() {
        if (MessagingSocket.instance) {
            return MessagingSocket.instance // Return the existing instance
        }

        super()

        MessagingSocket.instance = this
    }

    sendData(data) {
        this.socket.emit('message', data)
    }

    updateData(data) {
        this.socket.emit('editMessage', data)
    }

    pinMessage(data) {
        this.socket.emit('pinMessage', data)
    }

    unPinMessage(data) {
        this.socket.emit('unpinMessage', data)
    }

    onPinMessage(callback) {
        this.socket.on('pinMessage', callback)
    }

    onUnPinMessage(callback) {
        this.socket.on('unpinMessage', callback)
    }

    offPinMessage(callback) {
        this.socket.off('pinMessage', callback)
    }

    offUnPinMessage(callback) {
        this.socket.off('unpinMessage', callback)
    }

    onReceiveMessage(callback) {
        this.socket.on('message', callback)
    }

    onReceiveEditMessage(callback) {
        this.socket.on('editMessage', callback)
    }

    offReceiveMessage(callback) {
        this.socket.off('message', callback)
    }

    offReceiveEditMessage(callback) {
        this.socket.off('editMessage', callback)
    }

    deleteData(data) {
        //this.socket.emit("deleteStory",{storyId:data.id})
    }

    deleteMessage(data) {
        this.socket.emit('deleteMessage', data)
    }

    onReceiveDeleteMessage(callback) {
        this.socket.on('deleteMessage', callback)
    }

    offReceiveDeleteMessage(callback) {
        this.socket.off('deleteMessage', callback)
    }

    disconnect() {
        console.log(`Disconnecting from ${this.serverUrl}`)
        this.socket.disconnect()
    }
}

export default MessagingSocket
