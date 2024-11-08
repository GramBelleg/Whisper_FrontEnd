import axios from 'axios';
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

  async setProfilePic(userId,blobName) {
    try {
        const response = await axios.put("http://localhost:5000/api/user/profilepic", 
            { blobName:blobName,useId:userId  },
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.status === 200) {
            this.socket.emit("pfp", { profilePic: blobName,useId:userId });
            console.log("Sent profile pic set event with blobName:", blobName);
        } else {
            console.error("Failed to set profile picture:", response.statusText);
        }
    } catch (error) {
        console.error("Error updating profile picture:", error);
    }
}

getProfilePic(userID, callback) {
  const onProfilePic = (data) => {
    console.log("socket",data,userID)
      if (data && data.userId === userID && data.profilePic) {
          console.log("Received profile picture for user:", data.userId, userID, data.profilePic);
          callback(null, data.profilePic);
      } else if (data && data.userID !== userID) {
          console.log("Received profile picture, but for a different user. Ignoring...");
      } else {
          console.error("No profile picture data received for the specified user");
          callback("No profile picture found for the user", null);
      }
      this.socket.off("pfp", onProfilePic);
  };

  this.socket.on("pfp", onProfilePic);
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