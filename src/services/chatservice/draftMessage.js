import axios from "axios";

export const draftMessage = async (chatId, draftedMessage) => {
    try {
        const response = await axios.post(
            `http://localhost:5000/api/chats/${chatId}/draft`, 
            draftedMessage, 
            { withCredentials: true } 
        );
        return response.data;
    } catch (error) {
        throw error;
    }
    
}

export const unDraftMessage = async (chatId) => {
    try {
        await axios.put(
            `http://localhost:5000/api/chats/${chatId}/undraftMessage`, 
            //{ withCredentials: true } 
        );
        
        return true;
    } catch (error) {
        throw error;
    }
    
}