import axios from "axios"
import noUser from "../../assets/images/no-user.png";
import axiosInstance from "../axiosInstance";

let myChats = [];
let myUsers = [];

export const getChatsAPI = async () => {

    try {
        const chats = await axios.get("http://localhost:5000/api/chats", {
            withCredentials: true, // Ensure credentials are included
        });

        console.log(chats.data);

        return chats.data;
    } catch (error) {
        console.log("Error ", error.message)
    }
}

// Function to map message_state values
const mapMessageState = ( read, delivered ) => {
    if(!read && !delivered) {
        return 0;
    }
    else if(delivered && !read) {
        return 1;
    }
    else {
        return 2;
    }
};
  

  export const getChatsCleaned = async () => {
    try {
        const chats = await getChatsAPI();

        myChats = []

        // TODO: "picture": "string"

        // const downloadedData = await getDownloadData();
        // const blob = await downloadAttachment(downloadedData);

        // const finalBlob = new Blob([blob]);
        // const newObjectUrl = URL.createObjectURL(finalBlob);

        
        chats.map((chat) => {
            const flattenedChat = {
                id: chat.id, 
                lastMessage: chat.lastMessage.content, 
                messageTime: chat.lastMessage.sentAt?.slice(0, 19).replace("T", " "), 
                forwarded: false, // TODO: to be removed
                senderId: chat.other.id,  // TODO: shpuld be sender id
                messageType: chat.lastMessage.type, 
                messageState: mapMessageState(chat.lastMessage.read, chat.lastMessage.delivered),
                lastMessageId: chat.lastMessage.id, 
                type: chat.type, 
                othersId: chat.othersId, // TODO: handle with back
                media: chat.lastMessage.media !== null ?  chat.lastMessage.media : false,// TODO: to be removed
                story: chat.hasStory !== null ?  chat.hasStory: false, 
                muted: chat.isMuted !== null ?  chat.isMuted: false, 
                profilePic: noUser,
                unreadMessageCount: chat.unreadMessageCount, 
                sender : chat.other.userName,
                lastSeen: chat.lastSeen?.slice(0, 19).replace("T", " ")
                // TODO:
                // Add status
            };
            myChats.push(flattenedChat);
        });

        setUsers();
        return myChats;
        
        
    } catch (error) {
        console.log("Error " ,error.message);
    }
    
    
}


const setUsers = () => {
    myUsers = []

    myChats.map((chat) => {
        const user = {
            userId: chat.othersId,
            correspondingChatId:  chat.id,
            name: chat.sender,
            profilePic: chat.profilePic,
            lastSeen: chat.lastSeen
        };
        myUsers.push(user);
    })
}


export const getUserForChat = (id) => {
    if(myUsers) {
        const requiredUser = myUsers.find((user) => user.correspondingChatId === id);
        if(requiredUser) {
            return requiredUser;
        }
    }
    return null;
}
