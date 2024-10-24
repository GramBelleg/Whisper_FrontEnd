import axios from "axios"



export const getMessagesForChatFromAPI = async (id) => {
    try {
        console.log(`http://localhost:5000/api/chats/${id}`)
        const  response = await axios.get(`http://localhost:5000/api/chats/${id}`, {
            withCredentials: true, 
        });

        return response.data;
    } catch (error) {
        console.log(error.message);
    }
}


export const getMessagesForChatCleaned = async (id) => {
    try {

        const messages = await getMessagesForChatFromAPI(id);
        const myMessages = []

        messages.map((message) => {
            const tempMessage = {
                id:  message.id,
                chatId:  message.chatId,
                content:  message.content,
                senderId:  message.senderId,
                time: message.createdAt.slice(0, 19).replace("T", " "),
                deliveredAt: message.delivered.slice(0, 19).replace("T", " "),
                readAt: message.read.slice(0, 19).replace("T", " "),
                forwarded : message.forwarded,
                expiresAfter: message.expiresAfter,
                parentMessageId: message.parentMessageId,
                selfDestruct: message.selfDestruct,
                type: message.type,
                pinned : message.pinned,
                deleted: message.deleted,
                sender: message.userName,
                state:"sent",
            }
            myMessages.push(tempMessage);
        });

        return myMessages;

    } catch (error) {
        console.log("Error " ,error.message);
    }
}
