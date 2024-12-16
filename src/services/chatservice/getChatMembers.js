import apiUrl from "@/config";
import axios from "axios";


export const getMembers = async (chatId) => {
    try {
        const tokenFromCookies = localStorage.getItem('token')
        const response = await axios.get(`${apiUrl}/api/chats/${chatId}/getMembers`,
            { withCredentials: true }, {
                headers: {
                    Authorization: `Bearer ${tokenFromCookies}`
                }
            }
        )
        
        return response.data;
    } catch (error) {
        console.error(error);
        return [];
    }
}