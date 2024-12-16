import Socket from './Socket.js';

class CallSocket extends Socket {

    static instance;

    constructor() {

        if (CallSocket.instance) {
            return CallSocket.instance; // Return the existing instance
        }

        super();

        CallSocket.instance = this;
    }

    onReceiveCall(callback) {
        this.socket.on('call', callback);
    }

    offReceiveCall(callback) {
        this.socket.off('call', callback);
    }

    onReceiveRejection(callback) {
        this.socket.on('callCanceled', callback);
    }

    offReceiveRejection(callback) {
        this.socket.off('callCanceled', callback);
    }

    disconnect() {
        console.log(`Disconnecting from ${this.serverUrl}`);
        this.socket.disconnect();
    }
}

export default CallSocket;
