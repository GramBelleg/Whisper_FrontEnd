import Socket from './Socket.js';

class ChatSocket extends Socket {

    static instance;

    constructor() {

        if (ChatSocket.instance) {
            return ChatSocket.instance; // Return the existing instance
        }

        super();
        console.log("ChatSocket instance created");

        ChatSocket.instance = this;
    }

    createChat(data) {
        this.socket.emit('createChat', data);
    }

    leaveGroup(data) {
        this.socket.emit('leaveChat', data)
    }

    onReceiveCreateChat(callback) {
        this.socket.on('createChat', callback);
    }

    offReceiveCreateChat(callback) {
        this.socket.off('createChat', callback);
    }

    onReceiveLeaveChat(callback) {
        this.socket.on('leaveChat', callback);
    }

    offReceiveLeaveChat(callback) {
        this.socket.off('leaveChat', callback);
    }

    disconnect() {
        console.log(`Disconnecting from ${this.serverUrl}`);
        this.socket.disconnect();
    }
}

export default ChatSocket;
