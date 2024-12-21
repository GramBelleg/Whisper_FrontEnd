import apiUrl from "@/config";
import axios from "axios";


export const updateGroupMemberPermissions = async (chatId, memberId, permissions) => {
    try {
        const token = localStorage.getItem("token")
        const response = await axios.post(`${apiUrl}/api/groups/${chatId}/${memberId}/permissions`, permissions, {
            headers: {
                Authorization: `Bearer ${token}`  
            },
            withCredentials: true
        })
        return response.data
    } catch (error) {
        throw error
    }
}
export const updateChannelMemberPermissions = async (chatId, memberId, permissions) => {
    try {
        const token = localStorage.getItem("token")
        const response = await axios.post(`${apiUrl}/api/channels/${chatId}/${memberId}/permissions`, permissions, {
            headers: {
                Authorization: `Bearer ${token}`  
            },
            withCredentials: true
        })
        return response.data
    } catch (error) {
        throw error
    }
}