import axios from "axios";

export const draftMessage = async (chatId, draftedMessage) => {
    try {
        const response = await axios.post(
            `http://localhost:5000/api/messages/${chatId}/draftMessage`, 
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
            `http://localhost:5000/api/messages/${chatId}/undraftMessage`, 
            { withCredentials: true } 
        );
        
        return true;
    } catch (error) {
        throw error;
    }
    
}