import axios from "axios"
import axiosInstance from "../axiosInstance";



export const getMessagesForChatFromAPI = async (id) => {
    try {
        if (id == 1) {
            console.log("Hello");
            const  response = await axiosInstance.get("/chatMessages");
            // { withCredentials: true, }
            return response.data;
        }
        else {
            throw new  Error("Chat id is not valid");
        }
    } catch (error) {
        console.log(error.message);
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
  

export const getMessagesForChatCleaned = async (id) => {
    try {

        const messages = await getMessagesForChatFromAPI(id);
        const myMessages = []
        /*
            {
                // TODO: no need
                "sender": { 
                    "userName": "string", // TODO: no need
                    "profilePic": "string" // TODO: no need
                },
                "comments": [
                    {
                        "id": 0,
                        "sender": {
                        "id": 0,
                        "userName": "string",
                        "profilePic": "string"
                        },
                        "content": "string",
                        "time": "2024-11-01T19:41:37.286Z"
                    }
                ]
            }
        */

        messages.map((message) => {
            const tempMessage = {
                id:  message.id, // okay
                chatId:  message.chatId, // okay
                mentions: message.mentions, // TODO: handle mentions
                content:  message.content, // okay
                media:   message.media, // TODO: handle this
                extension:  message.extension, // TODO: handle this
                senderId:  message.sender.id, // okay
                time: message.createdAt.slice(0, 19).replace("T", " "), // okay
                sentAt: message.sentAt.slice(0, 19).replace("T", " "), // TODO: handle this
                // deliveredAt: message.delivered.slice(0, 19).replace("T", " "),
                // readAt: message.read.slice(0, 19).replace("T", " "),
                forwarded : message.forwarded, // okay
                expiresAfter: message.expiresAfter, // okay

                parentMessageId: message.parentMessage? message.parentMessage.id : null, // okay
                parentMessageSenderId: message.parentMessage? message.parentMessage.senderId: null, // okay
                parentMessageContent: message.parentMessage? message.parentMessage.content: null, // okay
                parentMessageMedia: message.parentMessage?  message.parentMessage.media: null, // okay
                parentMessageSenderName: message.parentMessage?  message.parentMessage.senderName: null, // okay
                parentMessageSenderProfilePic: message.parentMessage? message.parentMessage.senderProfilePic : null, // okay

                selfDestruct: message.selfDestruct, // okay
                type: message.type, // okay
                pinned : message.pinned, // okay
                sender: message.userName,
                isAnnouncement:  message.isAnnouncement, // TODO: handle this
                state: mapMessageState(message.read, message.delivered), // TODO: handle pending
                // TODO: See comments
            }
            myMessages.push(tempMessage);
        });

        return myMessages;

    } catch (error) {
        console.log("Error " ,error.message);
    }
}
