import axios from "axios"
import axiosInstance from "../axiosInstance";
import noUser from "../../assets/images/no-user.png";


export const getMessagesForChatFromAPI = async (id) => {
    try {
        const  response = await axiosInstance.get(`/chatMessages/${id}`);
        // { withCredentials: true, }
        return response.data;
    } catch (error) {
        throw error;
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

export const mapMessage = (message) => {
    const tempMessage = {
        id:  message.id, 
        chatId:  message.chatId, 
        mentions: message.mentions,  // TODO: handle mentions
        content:  message.content, 
        media:   message.media,  // TODO: handle this
        extension:  message.extension,  // TODO: handle this
        time: message.time.slice(0, 19).replace("T", " "),  
        sentAt: message.sentAt.slice(0, 19).replace("T", " "),  // TODO: handle this
        state: mapMessageState(message.read, message.delivered),  // TODO: handle pending
        forwarded : message.forwarded, 
        expiresAfter: message.expiresAfter, 
        pinned : message.pinned, 
        selfDestruct: message.selfDestruct, 
        type: message.type, 
        edited: message.edited, 
        isSecret : message.isSecret, 
        isAnnouncement: message.isAnnouncement, 
        parentMessageId: message.parentMessage? message.parentMessage.id : null,  
        parentMessageSenderId: message.parentMessage? message.parentMessage.senderId: null,  
        parentMessageContent: message.parentMessage? message.parentMessage.content: null,  
        parentMessageMedia: message.parentMessage?  message.parentMessage.media: null,  
        parentMessageSenderName: message.parentMessage?  message.parentMessage.senderName: null,  
        parentMessageSenderProfilePic: message.parentMessage? message.parentMessage.senderProfilePic : null,  
        
        sender: message.sender.userName,
        senderId: message.sender.id, 
        profilePic: noUser, 
        
        // TODO: See comments
    }

    return tempMessage;
}
  

export const getMessagesForChatCleaned = async (id) => {
    try {

        const messages = await getMessagesForChatFromAPI(id);
        const myMessages = []
        console.log(messages.messages)

        messages?.messages?.map((message) => {
            myMessages.push(mapMessage(message));
        });

        return myMessages;

    } catch (error) {
        throw error;
    }
}


export const getPinnedMessagesForChat = async (id) => {

    try {
        const messages = await getMessagesForChatFromAPI(id); // TODO: handle with IndexedDB
        let pinnedMessages = []
       
        if (messages && messages.pinnedMessages.length > 0) {
            pinnedMessages = [...messages.pinnedMessages];
        } else {
            throw new Error("No pinned messages found");
        }
        console.log(pinnedMessages)

        return pinnedMessages;
    } catch (error) {
        throw error;
    }
}