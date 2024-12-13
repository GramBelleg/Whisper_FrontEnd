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

    addAdmin(data) {
        this.socket.emit('addAdmin', data);
    }

    removeFromChat(data) {
        this.socket.emit('removeUser', data);
    }

    leaveGroup(data) {
        this.socket.emit('leaveChat', data)
    }

    onReceiveRemoveFromChat(callback) {
        this.socket.on('removeUser', callback);
    }

    onReceiveCreateChat(callback) {
        this.socket.on('createChat', callback);
    }

    onReceiveAddAdmin(callback) {
        this.socket.on('addAdmin', callback);
    }

    onReceiveAddAdmin(callback) {
        this.socket.on('addAdmin', callback);
    }

    offReceiveRemoveFromChat(callback) {
        this.socket.on('removeUser', callback);
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
