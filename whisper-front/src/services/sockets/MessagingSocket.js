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
        this.socket.emit('message', data);
    }

    pinMessage(data) {
        this.socket.emit('pinMessage', data);
    }

    unPinMessage(data) {
        this.socket.emit('unpinMessage', data);
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
