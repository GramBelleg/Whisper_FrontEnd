import Socket from './Socket.js';

class MessagingSocket extends Socket {

    static instance;

    constructor() {

        if (MessagingSocket.instance) {
            return MessagingSocket.instance; // Return the existing instance
        }

        super();

        MessagingSocket.instance = this;
    }

    sendData(data) {
        console.log("Sending data: ", data);
        this.socket.emit('message', data);
    }

    pinMessage(data) {
        this.socket.emit('pinMessage', data);
    }

    unPinMessage(data) {
        this.socket.emit('unpinMessage', data);
    }

    onPinMessage(callback) {
        this.socket.on('pinMessage', callback);
    }

    onUnPinMessage(callback) {
        this.socket.on('unpinMessage', callback);
    }

    offPinMessage(callback) {
        this.socket.off('pinMessage', callback);
    }

    offUnPinMessage(callback) {
        this.socket.off('unpinMessage', callback);
    }

    onReceiveMessage(callback) {
        this.socket.on('message', callback);
    }

    offReceiveMessage(callback) {
        this.socket.off('message', callback);
    }
    
    deleteData(data) {
        //this.socket.emit("deleteStory",{storyId:data.id})
    }

    disconnect() {
        console.log(`Disconnecting from ${this.serverUrl}`);
        this.socket.disconnect();
    }
}

export default MessagingSocket;
