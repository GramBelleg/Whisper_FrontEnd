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
        console.log("Sending data: ", data);
        this.socket.emit('story', data);
    }

    deleteData(data) {
        this.socket.emit("deleteStory", { storyId : data })
    }

    onReceiveStory(callback) {
        this.socket.on('story', callback); 
    }

    onReceiveDeleteStory(callback) {
        this.socket.on('deleteStory', callback);
    }

    offReceiveStory(callback) {
        // this.socket.off('receive', callback);
    }

    offRecieveDeleteStory(callback) {
        // this.socket.off('deleteStory', callback);
    }

    disconnect() {
        console.log(`Disconnecting from ${this.serverUrl}`);
        this.socket.disconnect();
    }
}

export default StorySocket;
