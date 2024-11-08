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

    deleteData(data) {
        //this.socket.emit("deleteStory",{storyId:data.id})
    }
    pinMessage(messageId, chatId) {
        this.socket.emit('pinMessage', { messageId, chatId, duration: 0 });
    }

    unpinMessage(messageId, chatId) {
        this.socket.emit('unpinMessage', { messageId, chatId });
    }
    listenForPinEvents(onPin, onUnpin) {
        this.socket.on('pinMessage', onPin);
        this.socket.on('unpinMessage', onUnpin);
    }

    removePinEventListeners() {
        this.socket.off('pinMessage');
        this.socket.off('unpinMessage');
    }

    disconnect() {
        console.log(`Disconnecting from ${this.serverUrl}`);
        this.socket.disconnect();
    }
}

export default MessagingSocket;
