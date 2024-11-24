import axios from "axios";



export const muteChat = async (chatId, muteObject) => {
    try {
        const response = await axios.post(
            `http://localhost:5000/api/chats/${chatId}/muteChat`, 
            muteObject, 
            { withCredentials: true } 
        );

        return response.data;
    } catch (error) {
        throw error;
    }
}


export const unMuteChat = async (chatId, muteObject) => {
    try {
        const response = await axios.post(
            `http://localhost:5000/api/chats/${chatId}/muteChat`, 
            muteObject, 
            { withCredentials: true } 
        );

        return response.data;
    } catch (error) {
        throw error;
    }
}