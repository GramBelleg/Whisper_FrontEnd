import Socket from './Socket.js';
class UserSocket extends Socket {
  static instance;
  constructor() {
    if (UserSocket.instance) {
      return UserSocket.instance;
    }
    super();
    this.socket.on('setPfp', this.handleSetPfp);
    this.socket.on('getPfp', this.handleGetPfp);
    this.socket.on('pfp', this.handleBroadcastedPfp);
    UserSocket.instance = this;
  }
  // Handle received profile picture update broadcast
  handleBroadcastedPfp(data) {
    if (data && data.profilePic) {
      console.log("Received broadcasted profile picture update:", data.profilePic);
    } else {
      console.log("No profile picture data received in broadcast.");
    }
  }

  setProfilePic(blobName) {
    this.socket.emit("pfp", { profilePic: blobName });
    console.log("Sent profile pic set event with blobName:", blobName);
  }
  //currently not working
  getProfilePic(userId) {
    return new Promise((resolve, reject) => {
        this.socket.emit("getPfp", { userId });
        this.socket.on("getPfp", (data) => {
            if (data && data.profilePic) {
                console.log("Received profile picture:", data.profilePic);
                resolve(data.profilePic);
            } else {
                reject("No profile picture found for the user");
            }
        });
    });
}
  handleSetPfp(data) {
    if (data && data.profilePic) {
      console.log("Profile picture updated to:", data.profilePic);
    } else {
      console.log("No profile picture data received");
    }
  }
  handleGetPfp(data) {
    if (data && data.profilePic) {
      console.log("Received profile picture:", data.profilePic);
    } else {
      console.log("No profile picture found for the user");
    }
  }
  deleteData(data) {
  }
  disconnect() {
    console.log(`Disconnecting from ${this.serverUrl}`);
    this.socket.disconnect();
  }
}
export default UserSocket;