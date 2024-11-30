import Socket from './Socket.js';

class StorySocket extends Socket {

    static instance;

    constructor() {

        if (StorySocket.instance) {
            return StorySocket.instance; // Return the existing instance
        }

        super();

        StorySocket.instance = this;
    }

    sendData(data) {
        this.socket.emit('story', data);
    }

    deleteData(data) {
        console.log("hello ", data)
        this.socket.emit("deleteStory", { storyId : data })
    }

    onReceiveMessage(callback) {
        //this.socket.on('receive', callback);
    }

    offReceiveMessage(callback) {
        //this.socket.off('receive', callback);
    }

    disconnect() {
        console.log(`Disconnecting from ${this.serverUrl}`);
        this.socket.disconnect();
    }
}

export default StorySocket;
