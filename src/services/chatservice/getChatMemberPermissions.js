import apiUrl from "@/config";
import axios from "axios";


export const getMemberPermissions = async (chatId, memberId) => {
    try {
        const tokenFromCookies = localStorage.getItem('token')
        const response = await axios.get(`${apiUrl}/api/groups/${chatId}/${memberId}/permissions`,
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
export const getSubscriberPermissions = async (chatId, memberId) => {
    try {
        const tokenFromCookies = localStorage.getItem('token')
        const response = await axios.get(`${apiUrl}/api/channels/${chatId}/${memberId}/permissions`,
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