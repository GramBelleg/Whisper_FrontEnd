import axios from "axios"
import noUser from "../../assets/images/no-user.png";

let myStories = [];

export const getStoriesAPI = async () => {

    try {
        const stories = await axios.get("http://localhost:5000/api/stories", {
            withCredentials: true, // Ensure credentials are included
        });

        console.log(stories.data);

        return stories.data;
    } catch (error) {
        console.log("Error ", error.message)
    }
}

export const getStoriesCleaned = async () => {
    try {
        const stories = await getStoriesAPI();

        myStories = []
        
        stories.map((story) => {
            const flattenedStory = {
                // TODO: See how stories are returned
                id: chat.id,
                lastMessage: chat.lastMessage.content, // Renamed to lastMessage
                messageTime: chat.lastMessage.createdAt.slice(0, 19).replace("T", " "), // Renamed to messageTime
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
            myStories.push(flattenedChat);
        });

        setUsers();
        return myStories;
        
        
    } catch (error) {
        console.log("Error " ,error.message);
    }
    
    
}