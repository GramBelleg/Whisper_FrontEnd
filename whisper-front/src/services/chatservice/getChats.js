import axios from "axios"
import noUser from "../../assets/images/no-user.png";

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

export const getChatsCleaned = async () => {
    try {
        const chats = await getChatsAPI();

        myChats = []
        
        chats.map((chat) => {
            const flattenedChat = {
                id: chat.id,
                lastMessage: chat.lastMessage.content, // Renamed to lastMessage
                messageTime: chat.lastMessage.createdAt?.slice(0, 19).replace("T", " "), // Renamed to messageTime
                expiresAfter: chat.lastMessage.expiresAfter,
                forwarded: chat.lastMessage.forwarded !== null ? chat.lastMessage.forwarded: false,
                parentMessageId: chat.lastMessage.parentMessageId,
                pinned: chat.lastMessage.pinned,
                selfDestruct: chat.lastMessage.selfDestruct,
                senderId: chat.lastMessage.senderId,
                messageType: chat.lastMessage.type, // Renamed to messageType
                lastMessageId: chat.lastMessage.id, // Keep this as is
                type: chat.type,
                othersId: chat.othersId,
                media: chat.lastMessage.media !== null ?  chat.media : false,
                story: chat.story !== null ?  chat.story: false,
                muted: chat.muted !== null ?  chat.muted: false,
                profilePic: chat.profilePic !== null ? chat.profilePic : noUser,
                unreadMessageCount: 0, // Assuming a value for unreadMessageCount
                sender : chat.userName
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
            lastSeen: "2024-11-11 17:05:32"
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
