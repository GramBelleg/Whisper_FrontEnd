import axios from "axios";

export const draftMessage = async (draftedMessage) => {
    try {
        const response = await axios.post(
            `http://localhost:5000/api/chats/${draftedMessage.chatId}/draft`, 
            draftedMessage, 
            { withCredentials: true } 
        );
        console.log(response.data)
        return response.data;
    } catch (error) {
        throw error;
    }
    
}